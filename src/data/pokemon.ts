export interface BasePokemon {
  name: string;
  type: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  image: string;
  abilities: string[];
}

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

export const pokemonData: BasePokemon[] = [
  {
    name: "Pikachu",
    type: ["Electric"],
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    abilities: ["Static", "Lightning Rod"]
  },
  {
    name: "Charizard",
    type: ["Fire", "Flying"],
    stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    abilities: ["Blaze", "Solar Power"]
  },
  {
    name: "Blastoise",
    type: ["Water"],
    stats: { hp: 79, attack: 83, defense: 100, speed: 78 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    abilities: ["Torrent", "Rain Dish"]
  },
  {
    name: "Venusaur",
    type: ["Grass", "Poison"],
    stats: { hp: 80, attack: 82, defense: 83, speed: 80 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    abilities: ["Overgrow", "Chlorophyll"]
  },
  {
    name: "Alakazam",
    type: ["Psychic"],
    stats: { hp: 55, attack: 50, defense: 45, speed: 120 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png",
    abilities: ["Synchronize", "Inner Focus"]
  },
  {
    name: "Machamp",
    type: ["Fighting"],
    stats: { hp: 90, attack: 130, defense: 80, speed: 55 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png",
    abilities: ["Guts", "No Guard"]
  },
  {
    name: "Gengar",
    type: ["Ghost", "Poison"],
    stats: { hp: 60, attack: 65, defense: 60, speed: 110 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    abilities: ["Cursed Body", "Levitate"]
  },
  {
    name: "Dragonite",
    type: ["Dragon", "Flying"],
    stats: { hp: 91, attack: 134, defense: 95, speed: 80 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
    abilities: ["Inner Focus", "Multiscale"]
  },
  {
    name: "Mewtwo",
    type: ["Psychic"],
    stats: { hp: 106, attack: 110, defense: 90, speed: 130 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    abilities: ["Pressure", "Unnerve"]
  },
  {
    name: "Mew",
    type: ["Psychic"],
    stats: { hp: 100, attack: 100, defense: 100, speed: 100 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    abilities: ["Synchronize", "Adaptability"]
  },
  {
    name: "Gyarados",
    type: ["Water", "Flying"],
    stats: { hp: 95, attack: 125, defense: 79, speed: 81 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    abilities: ["Intimidate", "Moxie"]
  },
  {
    name: "Lapras",
    type: ["Water", "Ice"],
    stats: { hp: 130, attack: 85, defense: 80, speed: 60 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    abilities: ["Water Absorb", "Shell Armor"]
  },
  {
    name: "Eevee",
    type: ["Normal"],
    stats: { hp: 55, attack: 55, defense: 50, speed: 55 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    abilities: ["Run Away", "Adaptability"]
  },
  {
    name: "Snorlax",
    type: ["Normal"],
    stats: { hp: 160, attack: 110, defense: 65, speed: 30 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    abilities: ["Immunity", "Thick Fat"]
  },
  {
    name: "Articuno",
    type: ["Ice", "Flying"],
    stats: { hp: 90, attack: 85, defense: 100, speed: 85 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png",
    abilities: ["Pressure", "Snow Cloak"]
  }
];

export function generateRandomPokemon(): BasePokemon {
  const randomIndex = Math.floor(Math.random() * pokemonData.length);
  return pokemonData[randomIndex];
}