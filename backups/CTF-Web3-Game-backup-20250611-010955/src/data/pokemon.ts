import { PokemonType, Nature } from '../types/pokemon';

export interface BasePokemon {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  moves: number[];
  description: string;
  imageUrl: string;
}

export interface Move {
  id: number;
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  description: string;
}

export const POKEMON_TYPES: Record<PokemonType, { name: string; color: string }> = {
  [PokemonType.Normal]: { name: 'Normal', color: '#A8A878' },
  [PokemonType.Fire]: { name: 'Fire', color: '#F08030' },
  [PokemonType.Water]: { name: 'Water', color: '#6890F0' },
  [PokemonType.Electric]: { name: 'Electric', color: '#F8D030' },
  [PokemonType.Grass]: { name: 'Grass', color: '#78C850' },
  [PokemonType.Ice]: { name: 'Ice', color: '#98D8D8' },
  [PokemonType.Fighting]: { name: 'Fighting', color: '#C03028' },
  [PokemonType.Poison]: { name: 'Poison', color: '#A040A0' },
  [PokemonType.Ground]: { name: 'Ground', color: '#E0C068' },
  [PokemonType.Flying]: { name: 'Flying', color: '#A890F0' },
  [PokemonType.Psychic]: { name: 'Psychic', color: '#F85888' },
  [PokemonType.Bug]: { name: 'Bug', color: '#A8B820' },
  [PokemonType.Rock]: { name: 'Rock', color: '#B8A038' },
  [PokemonType.Ghost]: { name: 'Ghost', color: '#705898' },
  [PokemonType.Dragon]: { name: 'Dragon', color: '#7038F8' },
  [PokemonType.Dark]: { name: 'Dark', color: '#705848' },
  [PokemonType.Steel]: { name: 'Steel', color: '#B8B8D0' },
  [PokemonType.Fairy]: { name: 'Fairy', color: '#EE99AC' },
};

export const MOVES: Record<number, Move> = {
  1: {
    id: 1,
    name: 'Tackle',
    type: PokemonType.Normal,
    power: 40,
    accuracy: 100,
    pp: 35,
    description: 'A physical attack in which the user charges and slams into the target.'
  },
  2: {
    id: 2,
    name: 'Ember',
    type: PokemonType.Fire,
    power: 40,
    accuracy: 100,
    pp: 25,
    description: 'The target is attacked with small flames.'
  },
  3: {
    id: 3,
    name: 'Water Gun',
    type: PokemonType.Water,
    power: 40,
    accuracy: 100,
    pp: 25,
    description: 'The target is blasted with a forceful shot of water.'
  },
  4: {
    id: 4,
    name: 'Thunder Shock',
    type: PokemonType.Electric,
    power: 40,
    accuracy: 100,
    pp: 30,
    description: 'A jolt of electricity crashes down on the target.'
  },
  5: {
    id: 5,
    name: 'Vine Whip',
    type: PokemonType.Grass,
    power: 45,
    accuracy: 100,
    pp: 25,
    description: 'The target is struck with slender whips generated from the user\'s arms.'
  },
  6: {
    id: 6,
    name: 'Flamethrower',
    type: PokemonType.Fire,
    power: 90,
    accuracy: 100,
    pp: 15,
    description: 'The target is scorched with an intense blast of fire.'
  },
  7: {
    id: 7,
    name: 'Hydro Pump',
    type: PokemonType.Water,
    power: 110,
    accuracy: 80,
    pp: 5,
    description: 'The target is blasted by a huge volume of water launched under great pressure.'
  },
  8: {
    id: 8,
    name: 'Thunderbolt',
    type: PokemonType.Electric,
    power: 90,
    accuracy: 100,
    pp: 15,
    description: 'A strong electric blast crashes down on the target.'
  },
  9: {
    id: 9,
    name: 'Solar Beam',
    type: PokemonType.Grass,
    power: 120,
    accuracy: 100,
    pp: 10,
    description: 'A two-turn attack. The user gathers light, then blasts a bundled beam on the next turn.'
  },
  10: {
    id: 10,
    name: 'Quick Attack',
    type: PokemonType.Normal,
    power: 40,
    accuracy: 100,
    pp: 30,
    description: 'The user lunges at the target at a speed that makes it almost invisible.'
  },
  11: {
    id: 11,
    name: 'Psychic',
    type: PokemonType.Psychic,
    power: 90,
    accuracy: 100,
    pp: 10,
    description: 'The target is hit by a strong telekinetic force.'
  },
  12: {
    id: 12,
    name: 'Shadow Ball',
    type: PokemonType.Ghost,
    power: 80,
    accuracy: 100,
    pp: 15,
    description: 'The user hurls a shadowy blob at the target.'
  }
};

export const BASE_POKEMON: Record<number, BasePokemon> = {
  1: {
    id: 1,
    name: 'Bulbasaur',
    types: [PokemonType.Grass, PokemonType.Poison],
    baseStats: {
      hp: 45,
      attack: 49,
      defense: 49,
      spAttack: 65,
      spDefense: 65,
      speed: 45
    },
    moves: [1, 5, 9, 12],
    description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
  },
  4: {
    id: 4,
    name: 'Charmander',
    types: [PokemonType.Fire],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      spAttack: 60,
      spDefense: 50,
      speed: 65
    },
    moves: [1, 2, 6, 10],
    description: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
  },
  7: {
    id: 7,
    name: 'Squirtle',
    types: [PokemonType.Water],
    baseStats: {
      hp: 44,
      attack: 48,
      defense: 65,
      spAttack: 50,
      spDefense: 64,
      speed: 43
    },
    moves: [1, 3, 7, 10],
    description: 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'
  },
  25: {
    id: 25,
    name: 'Pikachu',
    types: [PokemonType.Electric],
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      spAttack: 50,
      spDefense: 50,
      speed: 90
    },
    moves: [1, 4, 8, 10],
    description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  },
  39: {
    id: 39,
    name: 'Jigglypuff',
    types: [PokemonType.Normal, PokemonType.Fairy],
    baseStats: {
      hp: 115,
      attack: 45,
      defense: 20,
      spAttack: 45,
      spDefense: 25,
      speed: 20
    },
    moves: [1, 10, 11, 12],
    description: 'When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png'
  },
  150: {
    id: 150,
    name: 'Mewtwo',
    types: [PokemonType.Psychic],
    baseStats: {
      hp: 106,
      attack: 110,
      defense: 90,
      spAttack: 154,
      spDefense: 90,
      speed: 130
    },
    moves: [1, 10, 11, 12],
    description: 'It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png'
  },
  144: {
    id: 144,
    name: 'Articuno',
    types: [PokemonType.Ice, PokemonType.Flying],
    baseStats: {
      hp: 90,
      attack: 85,
      defense: 100,
      spAttack: 95,
      spDefense: 125,
      speed: 85
    },
    moves: [1, 10, 11, 12],
    description: 'A legendary bird Pokémon that is said to appear to doomed people who are lost in icy mountains.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png'
  },
  145: {
    id: 145,
    name: 'Zapdos',
    types: [PokemonType.Electric, PokemonType.Flying],
    baseStats: {
      hp: 90,
      attack: 90,
      defense: 85,
      spAttack: 125,
      spDefense: 90,
      speed: 100
    },
    moves: [4, 8, 10, 11],
    description: 'A legendary bird Pokémon that is said to appear from clouds while dropping enormous lightning bolts.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png'
  },
  146: {
    id: 146,
    name: 'Moltres',
    types: [PokemonType.Fire, PokemonType.Flying],
    baseStats: {
      hp: 90,
      attack: 100,
      defense: 90,
      spAttack: 125,
      spDefense: 85,
      speed: 90
    },
    moves: [2, 6, 10, 11],
    description: 'Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png'
  }
};

// Type effectiveness chart
export const TYPE_EFFECTIVENESS: Record<PokemonType, Record<PokemonType, number>> = {
  [PokemonType.Normal]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 0.5,
    [PokemonType.Ghost]: 0,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Fire]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 0.5,
    [PokemonType.Water]: 0.5,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 2,
    [PokemonType.Ice]: 2,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 2,
    [PokemonType.Rock]: 0.5,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 0.5,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 2,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Water]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 2,
    [PokemonType.Water]: 0.5,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 0.5,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 2,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 2,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 0.5,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 1,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Electric]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 2,
    [PokemonType.Electric]: 0.5,
    [PokemonType.Grass]: 0.5,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 0,
    [PokemonType.Flying]: 2,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 0.5,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 1,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Grass]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 0.5,
    [PokemonType.Water]: 2,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 0.5,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 0.5,
    [PokemonType.Ground]: 2,
    [PokemonType.Flying]: 0.5,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 0.5,
    [PokemonType.Rock]: 2,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 0.5,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Ice]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 0.5,
    [PokemonType.Water]: 0.5,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 2,
    [PokemonType.Ice]: 0.5,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 2,
    [PokemonType.Flying]: 2,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 2,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Fighting]: {
    [PokemonType.Normal]: 2,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 2,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 0.5,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 0.5,
    [PokemonType.Psychic]: 0.5,
    [PokemonType.Bug]: 0.5,
    [PokemonType.Rock]: 2,
    [PokemonType.Ghost]: 0,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 2,
    [PokemonType.Steel]: 2,
    [PokemonType.Fairy]: 0.5,
  },
  [PokemonType.Poison]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 2,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 0.5,
    [PokemonType.Ground]: 0.5,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 0.5,
    [PokemonType.Ghost]: 0.5,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0,
    [PokemonType.Fairy]: 2,
  },
  [PokemonType.Ground]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 2,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 2,
    [PokemonType.Grass]: 0.5,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 2,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 0,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 0.5,
    [PokemonType.Rock]: 2,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 2,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Flying]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 0.5,
    [PokemonType.Grass]: 2,
    [PokemonType.Ice]: 0.5,
    [PokemonType.Fighting]: 2,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 2,
    [PokemonType.Rock]: 0.5,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Psychic]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 2,
    [PokemonType.Poison]: 2,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 0.5,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 0,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Bug]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 0.5,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 2,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 0.5,
    [PokemonType.Poison]: 0.5,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 0.5,
    [PokemonType.Psychic]: 2,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 0.5,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 2,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 0.5,
  },
  [PokemonType.Rock]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 2,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 2,
    [PokemonType.Fighting]: 0.5,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 0.5,
    [PokemonType.Flying]: 2,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 2,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Ghost]: {
    [PokemonType.Normal]: 0,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 2,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 2,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 0.5,
    [PokemonType.Steel]: 1,
    [PokemonType.Fairy]: 1,
  },
  [PokemonType.Dragon]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 2,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 0,
  },
  [PokemonType.Dark]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 1,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 0.5,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 2,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 2,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 0.5,
    [PokemonType.Steel]: 1,
    [PokemonType.Fairy]: 0.5,
  },
  [PokemonType.Steel]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 0.5,
    [PokemonType.Water]: 0.5,
    [PokemonType.Electric]: 0.5,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 2,
    [PokemonType.Fighting]: 1,
    [PokemonType.Poison]: 1,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 2,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 1,
    [PokemonType.Dark]: 1,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 2,
  },
  [PokemonType.Fairy]: {
    [PokemonType.Normal]: 1,
    [PokemonType.Fire]: 0.5,
    [PokemonType.Water]: 1,
    [PokemonType.Electric]: 1,
    [PokemonType.Grass]: 1,
    [PokemonType.Ice]: 1,
    [PokemonType.Fighting]: 2,
    [PokemonType.Poison]: 0.5,
    [PokemonType.Ground]: 1,
    [PokemonType.Flying]: 1,
    [PokemonType.Psychic]: 1,
    [PokemonType.Bug]: 1,
    [PokemonType.Rock]: 1,
    [PokemonType.Ghost]: 1,
    [PokemonType.Dragon]: 2,
    [PokemonType.Dark]: 2,
    [PokemonType.Steel]: 0.5,
    [PokemonType.Fairy]: 1,
  },
};

// Helper functions
export function getTypeEffectiveness(attackType: PokemonType, defenseTypes: PokemonType[]): number {
  let effectiveness = 1;
  
  for (const defenseType of defenseTypes) {
    const typeChart = TYPE_EFFECTIVENESS[attackType];
    if (typeChart && typeChart[defenseType] !== undefined) {
      effectiveness *= typeChart[defenseType];
    }
  }
  
  return effectiveness;
}

export function calculateStat(baseStat: number, level: number, iv: number = 31): number {
  return Math.floor(((2 * baseStat + iv) * level) / 100) + 5;
}

export function calculateHp(baseStat: number, level: number, iv: number = 31): number {
  return Math.floor(((2 * baseStat + iv) * level) / 100) + level + 10;
}

export function generateRandomPokemon(): BasePokemon {
  const pokemonIds = Object.keys(BASE_POKEMON).map(Number);
  const randomId = pokemonIds[Math.floor(Math.random() * pokemonIds.length)];
  return BASE_POKEMON[randomId];
} 