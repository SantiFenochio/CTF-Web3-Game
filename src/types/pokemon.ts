export interface Pokemon {
  id: string;
  name: string;
  type: string[];
  rarity: 'common' | 'rare' | 'legendary';
  level: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  image: string;
  abilities: string[];
  isShiny: boolean;
  isLegendary: boolean;
  owner: string;
}

export interface GameStats {
  totalPokemon: number;
  shinyCount: number;
  legendaryCount: number;
  battlesWon: number;
  battlesLost: number;
}

export interface GameState {
  isInGame: boolean;
  pokemon: Pokemon[];
  stats: GameStats;
  // Actions
  addPokemon: (pokemon: Pokemon) => void;
  updateStats: (newStats: Partial<GameStats>) => void;
  setInGame: (inGame: boolean) => void;
}