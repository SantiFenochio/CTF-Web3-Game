import { PublicKey } from '@solana/web3.js';

// Enums that match the Solana smart contract
export enum PokemonType {
  Normal = 0,
  Fire = 1,
  Water = 2,
  Electric = 3,
  Grass = 4,
  Ice = 5,
  Fighting = 6,
  Poison = 7,
  Ground = 8,
  Flying = 9,
  Psychic = 10,
  Bug = 11,
  Rock = 12,
  Ghost = 13,
  Dragon = 14,
  Dark = 15,
  Steel = 16,
  Fairy = 17,
}

export enum Nature {
  Hardy = 0,
  Lonely = 1,
  Brave = 2,
  Adamant = 3,
  Naughty = 4,
  Bold = 5,
  Docile = 6,
  Relaxed = 7,
  Impish = 8,
  Lax = 9,
  Timid = 10,
  Hasty = 11,
  Serious = 12,
  Jolly = 13,
  Naive = 14,
  Modest = 15,
  Mild = 16,
  Quiet = 17,
  Bashful = 18,
  Rash = 19,
  Calm = 20,
  Gentle = 21,
  Sassy = 22,
  Careful = 23,
  Quirky = 24,
}

export enum BattleState {
  Challenged = 0,
  Active = 1,
  Finished = 2,
}

// Interfaces that match the Solana account structures
export interface GameState {
  authority: PublicKey;
  pokeCoinMint: PublicKey;
  treasury: PublicKey;
  totalBattles: number;
  totalTrainers: number;
  totalPokemon: number;
  season: number;
  bump: number;
}

export interface Trainer {
  publicKey: PublicKey;
  username: string;
  level: number;
  experience: number;
  battlesWon: number;
  battlesLost: number;
  pokemonCaught: number;
  pokeCoins: number;
  badges: number[];
  pokemonTeam: PublicKey[];
  pokemonBox: PublicKey[];
  createdAt: number;
  bump: number;
}

export interface Pokemon {
  trainer: PublicKey;
  speciesId: number;
  name: string;
  level: number;
  experience: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  types: PokemonType[];
  moves: number[];
  nature: Nature;
  isShiny: boolean;
  caughtAt: number;
  mint: PublicKey;
  bump: number;
}

export interface Battle {
  id: number;
  challenger: PublicKey;
  opponent: PublicKey;
  wager: number;
  state: BattleState;
  currentTurn: number;
  challengerActivePokemon?: PublicKey;
  opponentActivePokemon?: PublicKey;
  winner?: number;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  bump: number;
}

export interface PokemonData {
  speciesId: number;
  name: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpAttack: number;
  baseSpDefense: number;
  baseSpeed: number;
  types: PokemonType[];
  moves: number[];
}

// Frontend-specific interfaces
export interface PokemonCard extends Pokemon {
  maxHp: number;
  imageUrl: string;
  description: string;
}

export interface BattleLog {
  id: string;
  type: 'move' | 'switch' | 'faint' | 'win';
  message: string;
  timestamp: number;
  player?: string;
  pokemon?: string;
  damage?: number;
}

export interface BattleUI {
  battle: Battle;
  playerPokemon?: PokemonCard;
  opponentPokemon?: PokemonCard;
  playerTeam: PokemonCard[];
  opponentTeam: PokemonCard[];
  battleLog: BattleLog[];
  selectedMove?: number;
  isPlayerTurn: boolean;
  isLoading: boolean;
}

export interface TrainerProfile {
  trainer: Trainer;
  pokemonCollection: PokemonCard[];
  battleHistory: Battle[];
  winRate: number;
  currentRank: number;
}

// Event interfaces
export interface TrainerRegisteredEvent {
  trainer: PublicKey;
  username: string;
}

export interface PokemonCaughtEvent {
  trainer: PublicKey;
  pokemonMint: PublicKey;
  speciesId: number;
  name: string;
}

export interface BattleChallengeEvent {
  battleId: number;
  challenger: PublicKey;
  opponent: PublicKey;
  wager: number;
}

export interface BattleAcceptedEvent {
  battleId: number;
  startedAt: number;
}

export interface PokemonSelectedEvent {
  battleId: number;
  trainer: PublicKey;
  pokemonMint: PublicKey;
}

export interface MoveUsedEvent {
  battleId: number;
  trainer: PublicKey;
  pokemonMint: PublicKey;
  moveId: number;
  damage: number;
}

export interface BattleEndedEvent {
  battleId: number;
  winner: number;
}

export interface BattleRewardsDistributedEvent {
  battleId: number;
  winner: PublicKey;
  loser: PublicKey;
  wager: number;
}

// Helper types
export type PokemonStat = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed';

export interface StatBoosts {
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  accuracy: number;
  evasion: number;
}

export interface Weather {
  type: 'none' | 'sun' | 'rain' | 'sandstorm' | 'hail';
  turnsLeft: number;
}

export interface FieldConditions {
  weather: Weather;
  spikes: number;
  stealthRock: boolean;
  toxicSpikes: number;
}

// Wallet and transaction types
export interface WalletState {
  connected: boolean;
  publicKey?: PublicKey;
  balance?: number;
  pokeCoinBalance?: number;
}

export interface TransactionState {
  loading: boolean;
  signature?: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PokemonMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
} 