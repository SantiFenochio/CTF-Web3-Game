import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

export interface WalletContextType {
  wallet: any;
  connection: Connection;
  provider: AnchorProvider | null;
  program: Program | null;
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => Promise<void>;
}

export interface GameProgram {
  id: PublicKey;
  treasury: PublicKey;
  authority: PublicKey;
  tokenMint: PublicKey;
  version: number;
}

export interface GameAccount {
  id: PublicKey;
  players: PublicKey[];
  redScore: number;
  blueScore: number;
  state: number; // Enum converted to number for Solana
  winner: PublicKey | null;
  prizePool: number;
  entryFee: number;
  createdAt: number; // Unix timestamp
  endedAt: number | null;
}

export interface PlayerAccount {
  publicKey: PublicKey;
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  tokensEarned: number;
  flagsCaptured: number;
  nftsOwned: PublicKey[];
  createdAt: number;
  lastActive: number;
}

export interface FlagNFT {
  mint: PublicKey;
  metadata: PublicKey;
  image: string;
  capturedBy: PublicKey;
  capturedAt: number;
  gameId: PublicKey;
  team: number; // 0 = red, 1 = blue
  attributes: {
    rarity: string;
    generationPrompt: string;
    captureTime: string;
    winningGame: boolean;
  };
}

export interface TokenReward {
  amount: number;
  reason: 'flag_capture' | 'game_win' | 'kill' | 'assist' | 'participation';
  transaction: string;
  timestamp: number;
}

export interface StakingPool {
  poolId: PublicKey;
  totalStaked: number;
  rewardRate: number; // APY
  lockPeriod: number; // en días
  participants: number;
  gameRewards: boolean; // Si otorga rewards adicionales en juegos
}

export interface GameTransaction {
  signature: string;
  type: 'join_game' | 'end_game' | 'mint_flag' | 'claim_reward' | 'stake_tokens';
  amount?: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  gameId?: PublicKey;
}

export interface LeaderboardEntry {
  rank: number;
  publicKey: PublicKey;
  username: string;
  score: number;
  winRate: number;
  tokensEarned: number;
  flagsCaptured: number;
  seasonRank: number;
}

export interface SeasonData {
  seasonNumber: number;
  startDate: number;
  endDate: number;
  totalPrizePool: number;
  participants: number;
  topPlayers: LeaderboardEntry[];
  isActive: boolean;
}

export interface DAOProposal {
  id: PublicKey;
  proposer: PublicKey;
  title: string;
  description: string;
  proposalType: 'map_addition' | 'rule_change' | 'reward_adjustment' | 'feature_request';
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  createdAt: number;
  votingEnds: number;
  executionDate?: number;
}

export interface Vote {
  proposalId: PublicKey;
  voter: PublicKey;
  vote: 'for' | 'against' | 'abstain';
  tokenWeight: number;
  timestamp: number;
}

export interface TournamentBracket {
  tournamentId: PublicKey;
  name: string;
  entryFee: number;
  prizePool: number;
  maxTeams: number;
  currentTeams: number;
  format: 'single_elimination' | 'double_elimination' | 'round_robin';
  status: 'registration' | 'active' | 'completed';
  startDate: number;
  endDate?: number;
  winner?: PublicKey;
}

export interface TeamRegistration {
  teamId: PublicKey;
  captain: PublicKey;
  members: PublicKey[];
  teamName: string;
  tournamentId: PublicKey;
  registeredAt: number;
  entryFeePaid: boolean;
}

// Instrucciones para el programa de Solana
export interface GameInstruction {
  name: 
    | 'InitializeGame'
    | 'JoinGame'
    | 'StartGame'
    | 'EndGame'
    | 'CaptureFlag'
    | 'MintFlagNFT'
    | 'ClaimReward'
    | 'Stake'
    | 'Unstake'
    | 'CreateProposal'
    | 'Vote'
    | 'RegisterTournament'
    | 'JoinTournament';
  accounts: {
    [key: string]: PublicKey;
  };
  data?: any;
}

export interface ProgramError {
  code: number;
  name: string;
  msg: string;
}

// Constantes del programa
export const GAME_ERRORS = {
  GAME_FULL: { code: 6000, name: 'GameFull', msg: 'Game is full' },
  GAME_NOT_ACTIVE: { code: 6001, name: 'GameNotActive', msg: 'Game is not active' },
  INSUFFICIENT_FUNDS: { code: 6002, name: 'InsufficientFunds', msg: 'Insufficient funds' },
  UNAUTHORIZED: { code: 6003, name: 'Unauthorized', msg: 'Unauthorized access' },
  INVALID_TEAM: { code: 6004, name: 'InvalidTeam', msg: 'Invalid team selection' },
  FLAG_NOT_AVAILABLE: { code: 6005, name: 'FlagNotAvailable', msg: 'Flag not available for capture' },
} as const;

export const PROGRAM_SEEDS = {
  GAME: 'game',
  PLAYER: 'player',
  FLAG_NFT: 'flag_nft',
  STAKING_POOL: 'staking_pool',
  PROPOSAL: 'proposal',
  VOTE: 'vote',
  TOURNAMENT: 'tournament',
  TEAM: 'team',
} as const;

export type NetworkType = 'devnet' | 'testnet' | 'mainnet-beta'; 