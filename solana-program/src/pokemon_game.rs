use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instruction::create_metadata_accounts_v3;
use solana_program::program::invoke;

declare_id!("PokeGamE1111111111111111111111111111111111111");

#[program]
pub mod pokemon_game {
    use super::*;

    /// Initialize the Pokemon game program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.authority = ctx.accounts.authority.key();
        game_state.poke_coin_mint = ctx.accounts.poke_coin_mint.key();
        game_state.treasury = ctx.accounts.treasury.key();
        game_state.total_battles = 0;
        game_state.total_trainers = 0;
        game_state.total_pokemon = 0;
        game_state.season = 1;
        game_state.bump = *ctx.bumps.get("game_state").unwrap();
        
        msg!("Pokemon Game program initialized!");
        Ok(())
    }

    /// Register a new trainer
    pub fn register_trainer(
        ctx: Context<RegisterTrainer>,
        username: String,
    ) -> Result<()> {
        let trainer = &mut ctx.accounts.trainer;
        let game_state = &mut ctx.accounts.game_state;
        
        trainer.public_key = ctx.accounts.authority.key();
        trainer.username = username;
        trainer.level = 1;
        trainer.experience = 0;
        trainer.battles_won = 0;
        trainer.battles_lost = 0;
        trainer.pokemon_caught = 0;
        trainer.poke_coins = 1000; // Starting coins
        trainer.badges = Vec::new();
        trainer.pokemon_team = Vec::new();
        trainer.pokemon_box = Vec::new();
        trainer.created_at = Clock::get()?.unix_timestamp;
        trainer.bump = *ctx.bumps.get("trainer").unwrap();

        game_state.total_trainers += 1;

        // Mint starting PokéCoins
        let seeds = &[
            b"game_state".as_ref(),
            &[game_state.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.poke_coin_mint.to_account_info(),
            to: ctx.accounts.trainer_coin_account.to_account_info(),
            authority: ctx.accounts.game_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, 1000 * 1_000_000_000)?; // 1000 coins with 9 decimals

        emit!(TrainerRegistered {
            trainer: trainer.public_key,
            username: trainer.username.clone(),
        });

        Ok(())
    }

    /// Catch/Mint a new Pokemon NFT
    pub fn catch_pokemon(
        ctx: Context<CatchPokemon>,
        pokemon_data: PokemonData,
    ) -> Result<()> {
        let trainer = &mut ctx.accounts.trainer;
        let game_state = &mut ctx.accounts.game_state;
        
        // Initialize Pokemon NFT
        let pokemon = &mut ctx.accounts.pokemon;
        pokemon.trainer = trainer.public_key;
        pokemon.species_id = pokemon_data.species_id;
        pokemon.name = pokemon_data.name.clone();
        pokemon.level = 5; // All Pokemon start at level 5
        pokemon.experience = 0;
        pokemon.hp = calculate_stat(pokemon_data.base_hp, pokemon.level, 31); // Perfect IVs for now
        pokemon.attack = calculate_stat(pokemon_data.base_attack, pokemon.level, 31);
        pokemon.defense = calculate_stat(pokemon_data.base_defense, pokemon.level, 31);
        pokemon.sp_attack = calculate_stat(pokemon_data.base_sp_attack, pokemon.level, 31);
        pokemon.sp_defense = calculate_stat(pokemon_data.base_sp_defense, pokemon.level, 31);
        pokemon.speed = calculate_stat(pokemon_data.base_speed, pokemon.level, 31);
        pokemon.types = pokemon_data.types;
        pokemon.moves = pokemon_data.moves;
        pokemon.nature = Nature::Hardy; // Default nature
        pokemon.is_shiny = false; // TODO: Add shiny probability
        pokemon.caught_at = Clock::get()?.unix_timestamp;
        pokemon.mint = ctx.accounts.pokemon_mint.key();
        pokemon.bump = *ctx.bumps.get("pokemon").unwrap();

        // Mint the NFT
        let seeds = &[
            b"game_state".as_ref(),
            &[game_state.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.pokemon_mint.to_account_info(),
            to: ctx.accounts.trainer_pokemon_account.to_account_info(),
            authority: ctx.accounts.game_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, 1)?;

        // Create metadata for the Pokemon NFT
        let metadata_instruction = create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata_account.key(),
            ctx.accounts.pokemon_mint.key(),
            ctx.accounts.game_state.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.game_state.key(),
            format!("{} #{}", pokemon_data.name, pokemon_data.species_id),
            "PKMN".to_string(),
            format!("https://pokemon-api.com/metadata/{}", ctx.accounts.pokemon_mint.key()),
            Some(vec![]), 
            0,
            true,
            false,
            None,
            None,
            None,
        );

        invoke(
            &metadata_instruction,
            &[
                ctx.accounts.metadata_account.to_account_info(),
                ctx.accounts.pokemon_mint.to_account_info(),
                ctx.accounts.game_state.to_account_info(),
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.game_state.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
                ctx.accounts.token_metadata_program.to_account_info(),
            ],
        )?;

        // Add to trainer's collection
        if trainer.pokemon_team.len() < 6 {
            trainer.pokemon_team.push(ctx.accounts.pokemon_mint.key());
        } else {
            trainer.pokemon_box.push(ctx.accounts.pokemon_mint.key());
        }

        trainer.pokemon_caught += 1;
        game_state.total_pokemon += 1;

        emit!(PokemonCaught {
            trainer: trainer.public_key,
            pokemon_mint: ctx.accounts.pokemon_mint.key(),
            species_id: pokemon_data.species_id,
            name: pokemon_data.name,
        });

        Ok(())
    }

    /// Challenge another trainer to a battle
    pub fn challenge_trainer(
        ctx: Context<ChallengeBattle>,
        wager: u64,
    ) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        let challenger = &mut ctx.accounts.challenger;
        let game_state = &mut ctx.accounts.game_state;

        battle.id = game_state.total_battles;
        battle.challenger = challenger.public_key;
        battle.opponent = ctx.accounts.opponent.key();
        battle.wager = wager;
        battle.state = BattleState::Challenged;
        battle.current_turn = 0;
        battle.challenger_active_pokemon = None;
        battle.opponent_active_pokemon = None;
        battle.winner = None;
        battle.created_at = Clock::get()?.unix_timestamp;
        battle.bump = *ctx.bumps.get("battle").unwrap();

        game_state.total_battles += 1;

        emit!(BattleChallenge {
            battle_id: battle.id,
            challenger: battle.challenger,
            opponent: battle.opponent,
            wager,
        });

        Ok(())
    }

    /// Accept a battle challenge
    pub fn accept_battle(ctx: Context<AcceptBattle>) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        
        require!(battle.state == BattleState::Challenged, ErrorCode::BattleNotChallenged);
        require!(battle.opponent == ctx.accounts.opponent.key(), ErrorCode::UnauthorizedOpponent);

        battle.state = BattleState::Active;
        battle.started_at = Some(Clock::get()?.unix_timestamp);

        emit!(BattleAccepted {
            battle_id: battle.id,
            started_at: battle.started_at.unwrap(),
        });

        Ok(())
    }

    /// Select Pokemon for battle
    pub fn select_pokemon(
        ctx: Context<SelectPokemon>,
        pokemon_mint: Pubkey,
    ) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        let trainer = &ctx.accounts.trainer;
        let pokemon = &ctx.accounts.pokemon;

        require!(battle.state == BattleState::Active, ErrorCode::BattleNotActive);
        require!(pokemon.trainer == trainer.public_key, ErrorCode::PokemonNotOwned);
        require!(pokemon.mint == pokemon_mint, ErrorCode::InvalidPokemonMint);

        if battle.challenger == trainer.public_key {
            battle.challenger_active_pokemon = Some(pokemon_mint);
        } else if battle.opponent == trainer.public_key {
            battle.opponent_active_pokemon = Some(pokemon_mint);
        } else {
            return Err(ErrorCode::TrainerNotInBattle.into());
        }

        emit!(PokemonSelected {
            battle_id: battle.id,
            trainer: trainer.public_key,
            pokemon_mint,
        });

        Ok(())
    }

    /// Execute a move in battle
    pub fn use_move(
        ctx: Context<UseMove>,
        move_id: u16,
    ) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        let attacker_pokemon = &mut ctx.accounts.attacker_pokemon;
        let defender_pokemon = &mut ctx.accounts.defender_pokemon;

        require!(battle.state == BattleState::Active, ErrorCode::BattleNotActive);
        
        // Verify it's the correct trainer's turn
        let is_challenger_turn = battle.current_turn % 2 == 0;
        let attacker_key = ctx.accounts.trainer.key();
        
        if is_challenger_turn {
            require!(battle.challenger == attacker_key, ErrorCode::NotYourTurn);
            require!(Some(attacker_pokemon.mint) == battle.challenger_active_pokemon, ErrorCode::InvalidActivePokemon);
        } else {
            require!(battle.opponent == attacker_key, ErrorCode::NotYourTurn);
            require!(Some(attacker_pokemon.mint) == battle.opponent_active_pokemon, ErrorCode::InvalidActivePokemon);
        }

        // Calculate damage (simplified)
        let damage = calculate_damage(
            attacker_pokemon, 
            defender_pokemon, 
            move_id
        );

        defender_pokemon.hp = defender_pokemon.hp.saturating_sub(damage);

        battle.current_turn += 1;

        emit!(MoveUsed {
            battle_id: battle.id,
            trainer: attacker_key,
            pokemon_mint: attacker_pokemon.mint,
            move_id,
            damage,
        });

        // Check if Pokemon fainted
        if defender_pokemon.hp == 0 {
            // Simplified: Battle ends when one Pokemon faints
            end_battle(battle, if is_challenger_turn { 0 } else { 1 })?;
        }

        Ok(())
    }

    /// End a battle and distribute rewards
    pub fn end_battle_and_reward(ctx: Context<EndBattle>) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        let winner_trainer = &mut ctx.accounts.winner_trainer;
        let loser_trainer = &mut ctx.accounts.loser_trainer;

        require!(battle.state == BattleState::Finished, ErrorCode::BattleNotFinished);

        // Transfer wager from loser to winner
        if battle.wager > 0 {
            let cpi_accounts = Transfer {
                from: ctx.accounts.loser_coin_account.to_account_info(),
                to: ctx.accounts.winner_coin_account.to_account_info(),
                authority: ctx.accounts.loser_trainer.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::transfer(cpi_ctx, battle.wager)?;
        }

        // Update trainer stats
        winner_trainer.battles_won += 1;
        winner_trainer.experience += 100;
        loser_trainer.battles_lost += 1;

        emit!(BattleRewardsDistributed {
            battle_id: battle.id,
            winner: winner_trainer.public_key,
            loser: loser_trainer.public_key,
            wager: battle.wager,
        });

        Ok(())
    }
}

// Helper functions
fn calculate_stat(base_stat: u16, level: u8, iv: u8) -> u16 {
    ((2 * base_stat as u32 + iv as u32) * level as u32 / 100 + 5) as u16
}

fn calculate_damage(attacker: &Pokemon, defender: &Pokemon, _move_id: u16) -> u16 {
    // Simplified damage calculation
    let attack_stat = attacker.attack as u32;
    let defense_stat = defender.defense as u32;
    let level = attacker.level as u32;
    
    ((((2 * level + 10) / 250) * (attack_stat / defense_stat) * 50 + 2) * 100 / 100) as u16
}

fn end_battle(battle: &mut Battle, winner: u8) -> Result<()> {
    battle.state = BattleState::Finished;
    battle.winner = Some(winner);
    battle.ended_at = Some(Clock::get()?.unix_timestamp);

    emit!(BattleEnded {
        battle_id: battle.id,
        winner,
    });

    Ok(())
}

// Account structures and data types follow...
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GameState::INIT_SPACE,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub poke_coin_mint: Account<'info, Mint>,
    /// CHECK: Treasury account
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterTrainer<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Trainer::INIT_SPACE,
        seeds = [b"trainer", authority.key().as_ref()],
        bump
    )]
    pub trainer: Account<'info, Trainer>,
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub poke_coin_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = poke_coin_mint,
        associated_token::authority = authority,
    )]
    pub trainer_coin_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CatchPokemon<'info> {
    #[account(mut)]
    pub trainer: Account<'info, Trainer>,
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(
        init,
        payer = payer,
        space = 8 + Pokemon::INIT_SPACE,
        seeds = [b"pokemon", pokemon_mint.key().as_ref()],
        bump
    )]
    pub pokemon: Account<'info, Pokemon>,
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = game_state,
    )]
    pub pokemon_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = pokemon_mint,
        associated_token::authority = trainer_authority,
    )]
    pub trainer_pokemon_account: Account<'info, TokenAccount>,
    /// CHECK: Metadata account
    #[account(mut)]
    pub metadata_account: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub trainer_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: Token Metadata Program
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Additional account structs for other instructions...
#[derive(Accounts)]
pub struct ChallengeBattle<'info> {
    #[account(
        init,
        payer = challenger,
        space = 8 + Battle::INIT_SPACE,
        seeds = [b"battle", game_state.total_battles.to_le_bytes().as_ref()],
        bump
    )]
    pub battle: Account<'info, Battle>,
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub challenger: Account<'info, Trainer>,
    /// CHECK: Opponent trainer account
    pub opponent: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptBattle<'info> {
    #[account(mut)]
    pub battle: Account<'info, Battle>,
    #[account(mut)]
    pub opponent: Signer<'info>,
}

#[derive(Accounts)]
pub struct SelectPokemon<'info> {
    #[account(mut)]
    pub battle: Account<'info, Battle>,
    pub trainer: Account<'info, Trainer>,
    pub pokemon: Account<'info, Pokemon>,
    pub trainer_authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UseMove<'info> {
    #[account(mut)]
    pub battle: Account<'info, Battle>,
    #[account(mut)]
    pub attacker_pokemon: Account<'info, Pokemon>,
    #[account(mut)]
    pub defender_pokemon: Account<'info, Pokemon>,
    pub trainer: Signer<'info>,
}

#[derive(Accounts)]
pub struct EndBattle<'info> {
    #[account(mut)]
    pub battle: Account<'info, Battle>,
    #[account(mut)]
    pub winner_trainer: Account<'info, Trainer>,
    #[account(mut)]
    pub loser_trainer: Account<'info, Trainer>,
    #[account(mut)]
    pub winner_coin_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub loser_coin_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// Data structures
#[account]
#[derive(InitSpace)]
pub struct GameState {
    pub authority: Pubkey,
    pub poke_coin_mint: Pubkey,
    pub treasury: Pubkey,
    pub total_battles: u64,
    pub total_trainers: u64,
    pub total_pokemon: u64,
    pub season: u32,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Trainer {
    pub public_key: Pubkey,
    #[max_len(32)]
    pub username: String,
    pub level: u8,
    pub experience: u32,
    pub battles_won: u32,
    pub battles_lost: u32,
    pub pokemon_caught: u32,
    pub poke_coins: u64,
    #[max_len(8)]
    pub badges: Vec<u8>,
    #[max_len(6)]
    pub pokemon_team: Vec<Pubkey>,
    #[max_len(100)]
    pub pokemon_box: Vec<Pubkey>,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Pokemon {
    pub trainer: Pubkey,
    pub species_id: u16,
    #[max_len(20)]
    pub name: String,
    pub level: u8,
    pub experience: u32,
    pub hp: u16,
    pub attack: u16,
    pub defense: u16,
    pub sp_attack: u16,
    pub sp_defense: u16,
    pub speed: u16,
    #[max_len(2)]
    pub types: Vec<PokemonType>,
    #[max_len(4)]
    pub moves: Vec<u16>,
    pub nature: Nature,
    pub is_shiny: bool,
    pub caught_at: i64,
    pub mint: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Battle {
    pub id: u64,
    pub challenger: Pubkey,
    pub opponent: Pubkey,
    pub wager: u64,
    pub state: BattleState,
    pub current_turn: u16,
    pub challenger_active_pokemon: Option<Pubkey>,
    pub opponent_active_pokemon: Option<Pubkey>,
    pub winner: Option<u8>,
    pub created_at: i64,
    pub started_at: Option<i64>,
    pub ended_at: Option<i64>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct PokemonData {
    pub species_id: u16,
    #[max_len(20)]
    pub name: String,
    pub base_hp: u16,
    pub base_attack: u16,
    pub base_defense: u16,
    pub base_sp_attack: u16,
    pub base_sp_defense: u16,
    pub base_speed: u16,
    #[max_len(2)]
    pub types: Vec<PokemonType>,
    #[max_len(4)]
    pub moves: Vec<u16>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum PokemonType {
    Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison,
    Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum Nature {
    Hardy, Lonely, Brave, Adamant, Naughty,
    Bold, Docile, Relaxed, Impish, Lax,
    Timid, Hasty, Serious, Jolly, Naive,
    Modest, Mild, Quiet, Bashful, Rash,
    Calm, Gentle, Sassy, Careful, Quirky,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum BattleState {
    Challenged,
    Active,
    Finished,
}

// Events
#[event]
pub struct TrainerRegistered {
    pub trainer: Pubkey,
    #[index]
    pub username: String,
}

#[event]
pub struct PokemonCaught {
    pub trainer: Pubkey,
    pub pokemon_mint: Pubkey,
    pub species_id: u16,
    #[index]
    pub name: String,
}

#[event]
pub struct BattleChallenge {
    pub battle_id: u64,
    pub challenger: Pubkey,
    pub opponent: Pubkey,
    pub wager: u64,
}

#[event]
pub struct BattleAccepted {
    pub battle_id: u64,
    pub started_at: i64,
}

#[event]
pub struct PokemonSelected {
    pub battle_id: u64,
    pub trainer: Pubkey,
    pub pokemon_mint: Pubkey,
}

#[event]
pub struct MoveUsed {
    pub battle_id: u64,
    pub trainer: Pubkey,
    pub pokemon_mint: Pubkey,
    pub move_id: u16,
    pub damage: u16,
}

#[event]
pub struct BattleEnded {
    pub battle_id: u64,
    pub winner: u8,
}

#[event]
pub struct BattleRewardsDistributed {
    pub battle_id: u64,
    pub winner: Pubkey,
    pub loser: Pubkey,
    pub wager: u64,
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Battle is not in challenged state")]
    BattleNotChallenged,
    #[msg("Unauthorized opponent")]
    UnauthorizedOpponent,
    #[msg("Battle is not active")]
    BattleNotActive,
    #[msg("Pokemon not owned by trainer")]
    PokemonNotOwned,
    #[msg("Invalid Pokemon mint")]
    InvalidPokemonMint,
    #[msg("Trainer not in this battle")]
    TrainerNotInBattle,
    #[msg("Not your turn")]
    NotYourTurn,
    #[msg("Invalid active Pokemon")]
    InvalidActivePokemon,
    #[msg("Battle not finished")]
    BattleNotFinished,
}