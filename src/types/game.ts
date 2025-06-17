import { PublicKey } from '@solana/web3.js';

export enum Team {
  RED = 'red',
  BLUE = 'blue',
  SPECTATOR = 'spectator'
}

export enum GameState {
  WAITING = 'waiting',
  PREPARING = 'preparing',
  ACTIVE = 'active',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

export enum WeaponType {
  SWORD = 'sword',
  BOW = 'bow',
  GUN = 'gun',
  GRENADE = 'grenade',
  KNIFE = 'knife'
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  HEALTH = 'health',
  AMMO = 'ammo',
  FLAG = 'flag',
  TREASURE = 'treasure'
}

export interface Player {
  id: string;
  publicKey: PublicKey;
  username: string;
  team: Team;
  position: Vector3D;
  health: number;
  maxHealth: number;
  score: number;
  kills: number;
  deaths: number;
  flagCaptures: number;
  isAlive: boolean;
  inventory: Item[];
  currentWeapon?: Weapon;
  wallet?: string;
  avatar?: string;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface GameMap {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  bounds: {
    min: Vector3D;
    max: Vector3D;
  };
  redBase: Vector3D;
  blueBase: Vector3D;
  redFlag: Vector3D;
  blueFlag: Vector3D;
  spawnPoints: {
    red: Vector3D[];
    blue: Vector3D[];
  };
  treasureChests: TreasureChest[];
  barriers: Barrier[];
  obstacles: Obstacle[];
}

export interface GameSession {
  id: string;
  mapId: string;
  state: GameState;
  maxPlayers: number;
  currentPlayers: number;
  players: Player[];
  redScore: number;
  blueScore: number;
  maxScore: number;
  timeLimit: number; // en segundos
  timeRemaining: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  winner?: Team;
  entry_fee: number; // en SOL
  prize_pool: number; // en SOL
}

export interface Flag {
  team: Team;
  position: Vector3D;
  isAtBase: boolean;
  carriedBy?: string; // player ID
  image?: string; // AI generated image URL
  generatedPrompt?: string; // AI prompt used to generate the flag
}

export interface Weapon {
  id: string;
  type: WeaponType;
  name: string;
  damage: number;
  range: number;
  fireRate: number; // shots per second
  ammoCapacity: number;
  currentAmmo: number;
  reloadTime: number; // en milisegundos
  accuracy: number; // 0-1
  icon: string;
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  value: number;
  icon: string;
  stackable: boolean;
  maxStack: number;
  quantity: number;
}

export interface TreasureChest {
  id: string;
  position: Vector3D;
  isOpen: boolean;
  contents: Item[];
  respawnTime: number; // en segundos
  lastOpenedAt?: Date;
}

export interface Barrier {
  id: string;
  position: Vector3D;
  size: Vector3D;
  team?: Team; // null = neutral barrier
  health: number;
  maxHealth: number;
}

export interface Obstacle {
  id: string;
  position: Vector3D;
  size: Vector3D;
  type: 'wall' | 'rock' | 'tree' | 'building' | 'water';
  blocking: boolean;
}

export interface GameAction {
  type: 
    | 'PLAYER_MOVE'
    | 'PLAYER_ATTACK'
    | 'PLAYER_RELOAD'
    | 'PLAYER_USE_ITEM'
    | 'PLAYER_PICKUP_ITEM'
    | 'PLAYER_DROP_ITEM'
    | 'FLAG_CAPTURE'
    | 'FLAG_DROP'
    | 'FLAG_RETURN'
    | 'PLAYER_RESPAWN'
    | 'PLAYER_DEATH'
    | 'CHEST_OPEN'
    | 'TEAM_MARKER_PLACE'
    | 'CHAT_MESSAGE';
  playerId: string;
  timestamp: number;
  data: any;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  team: Team;
  message: string;
  timestamp: Date;
  isTeamOnly: boolean;
}

export interface Leaderboard {
  season: number;
  players: {
    playerId: string;
    username: string;
    wins: number;
    losses: number;
    flagCaptures: number;
    kills: number;
    deaths: number;
    score: number;
    tokensEarned: number;
    rank: number;
  }[];
}

export interface AIFlagGeneration {
  prompt: string;
  style: 'realistic' | 'cartoon' | 'pixel' | 'abstract';
  colors: string[];
  team: Team;
  imageUrl?: string;
  isGenerating: boolean;
  error?: string;
}

export interface GameStats {
  playerId: string;
  gamesPlayed: number;
  gamesWon: number;
  flagsCaptured: number;
  totalKills: number;
  totalDeaths: number;
  totalScore: number;
  averageScore: number;
  winRate: number;
  favoriteWeapon: WeaponType;
  favoriteMap: string;
  tokensEarned: number;
  nftsOwned: number;
} 