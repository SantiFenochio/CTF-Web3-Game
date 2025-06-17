use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("GJQx7NjqkrE5nRfQAeEEmpZ9eHH3NiAvCv9CXjkEpYyx");

#[program]
pub mod pokemon_game {
    use super::*;

    // Función para inicializar el juego
    pub fn initialize_game(ctx: Context<InitializeGame>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.admin = ctx.accounts.admin.key();
        game_state.total_packs_opened = 0;
        game_state.total_pokemon_minted = 0;
        
        msg!("Pokemon Game initialized by admin: {}", ctx.accounts.admin.key());
        Ok(())
    }

    // Función para abrir pack GRATUITO (Starter Pack)
    pub fn open_starter_pack(ctx: Context<OpenStarterPack>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let game_state = &mut ctx.accounts.game_state;
        
        // Verificar que el usuario no haya abierto pack gratuito antes
        require!(!user_state.has_opened_starter, ErrorCode::StarterPackAlreadyOpened);
        
        // Generar Pokémon aleatorio (simulado con timestamp)
        let clock = Clock::get()?;
        let random_seed = clock.unix_timestamp as u64;
        
        let pokemon = generate_pokemon(random_seed, false)?; // false = no es pack premium
        
        // Actualizar estados
        user_state.has_opened_starter = true;
        user_state.pokemon_count += 1;
        user_state.total_packs_opened += 1;
        
        game_state.total_packs_opened += 1;
        game_state.total_pokemon_minted += 1;
        
        // Emitir evento
        emit!(PokemonObtained {
            user: ctx.accounts.user.key(),
            pokemon_id: pokemon.id,
            pokemon_name: pokemon.name,
            rarity: pokemon.rarity,
            pack_type: "Starter".to_string(),
        });
        
        msg!("Starter pack opened! Pokemon: {} (Rarity: {})", pokemon.name, pokemon.rarity);
        Ok(())
    }

    // Función para abrir pack PREMIUM (50 USDC)
    pub fn open_premium_pack(ctx: Context<OpenPremiumPack>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let game_state = &mut ctx.accounts.game_state;
        
        // Verificar que el usuario tenga suficientes PokéCoins (50 USDC = 5000 PokéCoins)
        require!(user_state.poke_coins >= 5000, ErrorCode::InsufficientFunds);
        
        // Generar Pokémon aleatorio premium
        let clock = Clock::get()?;
        let random_seed = clock.unix_timestamp as u64;
        
        let pokemon = generate_pokemon(random_seed, true)?; // true = pack premium
        
        // Actualizar estados
        user_state.poke_coins -= 5000; // Cobrar el pack
        user_state.pokemon_count += 1;
        user_state.total_packs_opened += 1;
        
        game_state.total_packs_opened += 1;
        game_state.total_pokemon_minted += 1;
        
        // Emitir evento
        emit!(PokemonObtained {
            user: ctx.accounts.user.key(),
            pokemon_id: pokemon.id,
            pokemon_name: pokemon.name,
            rarity: pokemon.rarity,
            pack_type: "Premium".to_string(),
        });
        
        msg!("Premium pack opened! Pokemon: {} (Rarity: {})", pokemon.name, pokemon.rarity);
        Ok(())
    }

    // Función para inicializar usuario
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        user_state.user = ctx.accounts.user.key();
        user_state.poke_coins = 1000; // 1000 PokéCoins iniciales
        user_state.pokemon_count = 0;
        user_state.total_packs_opened = 0;
        user_state.has_opened_starter = false;
        user_state.level = 1;
        
        msg!("User initialized: {}", ctx.accounts.user.key());
        Ok(())
    }
}

// ESTRUCTURAS DE DATOS

#[account]
pub struct GameState {
    pub admin: Pubkey,
    pub total_packs_opened: u64,
    pub total_pokemon_minted: u64,
}

#[account]
pub struct UserState {
    pub user: Pubkey,
    pub poke_coins: u64,
    pub pokemon_count: u32,
    pub total_packs_opened: u32,
    pub has_opened_starter: bool,
    pub level: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Pokemon {
    pub id: u32,
    pub name: String,
    pub rarity: String,
    pub type1: String,
    pub type2: Option<String>,
}

// CONTEXTOS (QUÉ CUENTAS NECESITA CADA FUNCIÓN)

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 8, // discriminator + pubkey + u64 + u64
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 4 + 4 + 1 + 4, // discriminator + pubkey + u64 + u32 + u32 + bool + u32
        seeds = [b"user_state", user.key().as_ref()],
        bump
    )]
    pub user_state: Account<'info, UserState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OpenStarterPack<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump
    )]
    pub user_state: Account<'info, UserState>,
    #[account(
        mut,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct OpenPremiumPack<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump
    )]
    pub user_state: Account<'info, UserState>,
    #[account(
        mut,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    pub user: Signer<'info>,
}

// EVENTOS
#[event]
pub struct PokemonObtained {
    pub user: Pubkey,
    pub pokemon_id: u32,
    pub pokemon_name: String,
    pub rarity: String,
    pub pack_type: String,
}

// FUNCIONES AUXILIARES
fn generate_pokemon(seed: u64, is_premium: bool) -> Result<Pokemon> {
    // Lista de Pokémon disponibles
    let pokemon_list = [
        ("Charmander", "Fire", None, "Common"),
        ("Squirtle", "Water", None, "Common"),
        ("Bulbasaur", "Grass", Some("Poison"), "Common"),
        ("Pikachu", "Electric", None, "Common"),
        ("Jigglypuff", "Normal", Some("Fairy"), "Common"),
        ("Psyduck", "Water", None, "Common"),
        ("Machop", "Fighting", None, "Common"),
        ("Geodude", "Rock", Some("Ground"), "Common"),
        ("Magikarp", "Water", None, "Common"),
        ("Eevee", "Normal", None, "Shiny"), // 5% chance
        ("Ditto", "Normal", None, "Shiny"),
        ("Zapdos", "Electric", Some("Flying"), "Legendary"), // 3% chance
        ("Articuno", "Ice", Some("Flying"), "Legendary"),
        ("Moltres", "Fire", Some("Flying"), "Legendary"),
        ("Mewtwo", "Psychic", None, "Legendary"),
    ];
    
    // Generar números aleatorios basados en el seed
    let rarity_roll = (seed % 100) as u8;
    let pokemon_roll = (seed >> 8) % (pokemon_list.len() as u64);
    
    // Determinar rareza
    let rarity = if is_premium {
        // Pack premium: mejores chances
        if rarity_roll < 10 { "Legendary" } // 10% legendary
        else if rarity_roll < 25 { "Shiny" } // 15% shiny
        else { "Common" } // 75% common
    } else {
        // Pack starter: chances normales
        if rarity_roll < 3 { "Legendary" } // 3% legendary
        else if rarity_roll < 8 { "Shiny" } // 5% shiny
        else { "Common" } // 92% common
    };
    
    // Filtrar Pokémon por rareza
    let filtered_pokemon: Vec<_> = pokemon_list.iter()
        .enumerate()
        .filter(|(_, (_, _, _, r))| *r == rarity)
        .collect();
    
    if filtered_pokemon.is_empty() {
        // Fallback a Pokémon común si no hay de la rareza solicitada
        let (name, type1, type2, _) = pokemon_list[0];
        return Ok(Pokemon {
            id: 1,
            name: name.to_string(),
            rarity: "Common".to_string(),
            type1: type1.to_string(),
            type2: type2.map(|s| s.to_string()),
        });
    }
    
    let selected_index = (pokemon_roll as usize) % filtered_pokemon.len();
    let (id, (name, type1, type2, _)) = filtered_pokemon[selected_index];
    
    Ok(Pokemon {
        id: (id + 1) as u32,
        name: name.to_string(),
        rarity: rarity.to_string(),
        type1: type1.to_string(),
        type2: type2.map(|s| s.to_string()),
    })
}

// ERRORES PERSONALIZADOS
#[error_code]
pub enum ErrorCode {
    #[msg("Starter pack already opened")]
    StarterPackAlreadyOpened,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}