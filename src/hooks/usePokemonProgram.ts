import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
// Note: @solana/spl-token imports would go here in production
import { Trainer, Pokemon, Battle, PokemonData, BattleState } from '../types/pokemon';
import { BasePokemon } from '../data/pokemon';

// Using a valid Solana Program ID format (this is a placeholder for development)
const PROGRAM_ID = new PublicKey('11111111111111111111111111111112');

export function usePokemonProgram() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get program instance
  const getProgram = useCallback(() => {
    if (!publicKey) return null;
    
    const provider = new AnchorProvider(
      connection,
      window.solana,
      { commitment: 'confirmed' }
    );
    
    // Mock IDL - in production you'd import the actual IDL
    const idl = {
      version: "0.1.0",
      name: "pokemon_game",
      instructions: [],
      accounts: [],
      types: []
    };
    
    return new Program(idl as any, PROGRAM_ID, provider);
  }, [connection, publicKey]);

  // Load trainer data
  const loadTrainer = useCallback(async () => {
    if (!publicKey) return;

    try {
      const [trainerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('trainer'), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const trainerAccount = await connection.getAccountInfo(trainerPda);
      
      if (trainerAccount) {
        // Parse trainer data - this would use proper deserialization in production
        const mockTrainer: Trainer = {
          publicKey,
          username: 'Trainer',
          level: 1,
          experience: 0,
          battlesWon: 0,
          battlesLost: 0,
          pokemonCaught: 0,
          pokeCoins: 1000,
          badges: [],
          pokemonTeam: [],
          pokemonBox: [],
          createdAt: Date.now(),
          bump: 0
        };
        
        setTrainer(mockTrainer);
      }
    } catch (err) {
      console.error('Error loading trainer:', err);
    }
  }, [publicKey, connection]);

  // Register new trainer
  const registerTrainer = useCallback(async (username: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Mock transaction - in production this would call the actual program
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTrainer: Trainer = {
        publicKey,
        username,
        level: 1,
        experience: 0,
        battlesWon: 0,
        battlesLost: 0,
        pokemonCaught: 0,
        pokeCoins: 1000,
        badges: [],
        pokemonTeam: [],
        pokemonBox: [],
        createdAt: Date.now(),
        bump: 0
      };

      setTrainer(newTrainer);
    } catch (err) {
      setError('Failed to register trainer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  // Catch a new Pokemon
  const catchPokemon = useCallback(async (basePokemon: BasePokemon) => {
    if (!publicKey || !trainer) {
      throw new Error('Trainer not found');
    }

    setLoading(true);
    setError(null);

    try {
      // Mock transaction - in production this would mint an NFT
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newPokemon: Pokemon = {
        trainer: publicKey,
        speciesId: basePokemon.id,
        name: basePokemon.name,
        level: 5,
        experience: 0,
        hp: basePokemon.baseStats.hp + 20,
        attack: basePokemon.baseStats.attack + 10,
        defense: basePokemon.baseStats.defense + 10,
        spAttack: basePokemon.baseStats.spAttack + 10,
        spDefense: basePokemon.baseStats.spDefense + 10,
        speed: basePokemon.baseStats.speed + 10,
        types: basePokemon.types,
        moves: basePokemon.moves,
        nature: 0, // Hardy
        isShiny: Math.random() < 0.01, // 1% shiny rate
        caughtAt: Date.now(),
        mint: PublicKey.unique(),
        bump: 0
      };

      setPokemon(prev => [...prev, newPokemon]);
      
      // Update trainer stats
      setTrainer(prev => prev ? {
        ...prev,
        pokemonCaught: prev.pokemonCaught + 1,
        pokemonTeam: prev.pokemonTeam.length < 6 
          ? [...prev.pokemonTeam, newPokemon.mint]
          : prev.pokemonTeam,
        pokemonBox: prev.pokemonTeam.length >= 6
          ? [...prev.pokemonBox, newPokemon.mint]
          : prev.pokemonBox
      } : null);

    } catch (err) {
      setError('Failed to catch Pokemon');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, trainer]);

  // Challenge another trainer
  const challengeTrainer = useCallback(async (opponentKey: PublicKey, wager: number) => {
    if (!publicKey || !trainer) {
      throw new Error('Trainer not found');
    }

    setLoading(true);
    setError(null);

    try {
      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newBattle: Battle = {
        id: battles.length + 1,
        challenger: publicKey,
        opponent: opponentKey,
        wager,
        state: BattleState.Challenged,
        currentTurn: 0,
        createdAt: Date.now(),
        bump: 0
      };

      setBattles(prev => [...prev, newBattle]);
      return newBattle;

    } catch (err) {
      setError('Failed to create battle challenge');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, trainer, battles]);

  // Accept battle challenge
  const acceptBattle = useCallback(async (battleId: number) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setBattles(prev => prev.map(battle => 
        battle.id === battleId 
          ? { ...battle, state: BattleState.Active, startedAt: Date.now() }
          : battle
      ));

    } catch (err) {
      setError('Failed to accept battle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Use move in battle
  const useMove = useCallback(async (battleId: number, moveId: number) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setBattles(prev => prev.map(battle => 
        battle.id === battleId 
          ? { ...battle, currentTurn: battle.currentTurn + 1 }
          : battle
      ));

    } catch (err) {
      setError('Failed to use move');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on wallet change
  useEffect(() => {
    if (publicKey) {
      loadTrainer();
    } else {
      setTrainer(null);
      setPokemon([]);
      setBattles([]);
    }
  }, [publicKey, loadTrainer]);

  return {
    trainer,
    pokemon,
    battles,
    loading,
    error,
    registerTrainer,
    catchPokemon,
    challengeTrainer,
    acceptBattle,
    useMove,
    loadTrainer
  };
} 