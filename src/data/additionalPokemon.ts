import { PokemonType } from '../types/pokemon';
import { BasePokemon } from './pokemon';

// Pokémon adicionales para agregar al juego
export const ADDITIONAL_POKEMON: Record<number, BasePokemon> = {
  6: {
    id: 6,
    name: 'Charizard',
    types: [PokemonType.Fire, PokemonType.Flying],
    baseStats: {
      hp: 78,
      attack: 84,
      defense: 78,
      spAttack: 109,
      spDefense: 85,
      speed: 100
    },
    moves: [1, 2, 6, 10],
    description: 'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
  },
  9: {
    id: 9,
    name: 'Blastoise',
    types: [PokemonType.Water],
    baseStats: {
      hp: 79,
      attack: 83,
      defense: 100,
      spAttack: 85,
      spDefense: 105,
      speed: 78
    },
    moves: [1, 3, 7, 10],
    description: 'A brutal Pokémon with pressurized water jets on its shell. They are used for high-speed tackles.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png'
  },
  94: {
    id: 94,
    name: 'Gengar',
    types: [PokemonType.Ghost, PokemonType.Poison],
    baseStats: {
      hp: 60,
      attack: 65,
      defense: 60,
      spAttack: 130,
      spDefense: 75,
      speed: 110
    },
    moves: [1, 11, 12, 10],
    description: "On the night of a full moon, if shadows move on their own and laugh, it must be Gengar's doing.",
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png'
  },
  143: {
    id: 143,
    name: 'Snorlax',
    types: [PokemonType.Normal],
    baseStats: {
      hp: 160,
      attack: 110,
      defense: 65,
      spAttack: 65,
      spDefense: 110,
      speed: 30
    },
    moves: [1, 10, 11, 12],
    description: 'Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png'
  },
  149: {
    id: 149,
    name: 'Dragonite',
    types: [PokemonType.Dragon, PokemonType.Flying],
    baseStats: {
      hp: 91,
      attack: 134,
      defense: 95,
      spAttack: 100,
      spDefense: 100,
      speed: 80
    },
    moves: [1, 10, 11, 12],
    description: 'It is said to make its home somewhere in the sea. It guides crews of shipwrecked ships safely to shore.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png'
  },
  151: {
    id: 151,
    name: 'Mew',
    types: [PokemonType.Psychic],
    baseStats: {
      hp: 100,
      attack: 100,
      defense: 100,
      spAttack: 100,
      spDefense: 100,
      speed: 100
    },
    moves: [1, 10, 11, 12],
    description: "When viewed through a microscope, this Pokémon's short, fine, delicate hair can be seen.",
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png'
  },
  196: {
    id: 196,
    name: 'Espeon',
    types: [PokemonType.Psychic],
    baseStats: {
      hp: 65,
      attack: 65,
      defense: 60,
      spAttack: 130,
      spDefense: 95,
      speed: 110
    },
    moves: [1, 10, 11, 12],
    description: 'Its fur is so sensitive, it can feel minute shifts in the air and predict the weather.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png'
  },
  197: {
    id: 197,
    name: 'Umbreon',
    types: [PokemonType.Dark],
    baseStats: {
      hp: 95,
      attack: 65,
      defense: 110,
      spAttack: 60,
      spDefense: 130,
      speed: 65
    },
    moves: [1, 10, 11, 12],
    description: 'When agitated, this Pokémon protects itself by spraying poisonous sweat from its pores.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png'
  },
  249: {
    id: 249,
    name: 'Lugia',
    types: [PokemonType.Psychic, PokemonType.Flying],
    baseStats: {
      hp: 106,
      attack: 90,
      defense: 130,
      spAttack: 90,
      spDefense: 154,
      speed: 110
    },
    moves: [1, 10, 11, 12],
    description: 'It is said that it quietly spends its time deep at the bottom of the sea because its powers are too strong.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png'
  },
  250: {
    id: 250,
    name: 'Ho-Oh',
    types: [PokemonType.Fire, PokemonType.Flying],
    baseStats: {
      hp: 106,
      attack: 130,
      defense: 90,
      spAttack: 110,
      spDefense: 154,
      speed: 90
    },
    moves: [1, 2, 6, 10],
    description: "Legends claim this Pokémon flies the world's skies continuously on its magnificent seven-colored wings.",
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png'
  }
}; 