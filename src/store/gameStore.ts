import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pokemon, GameStats, GameState } from '@/types/pokemon';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      isInGame: false,
      pokemon: [],
      stats: {
        totalPokemon: 0,
        shinyCount: 0,
        legendaryCount: 0,
        battlesWon: 0,
        battlesLost: 0,
      },

      // Actions
      addPokemon: (pokemon: Pokemon) => {
        console.log('🏪 Store: addPokemon called with:', pokemon.name);
        set((state) => {
          const newPokemon = [...state.pokemon, pokemon];
          console.log('🏪 Store: Pokemon added, total count:', newPokemon.length);
          return {
            pokemon: newPokemon,
          };
        });
      },

      updateStats: (newStats: Partial<GameStats>) => {
        console.log('📊 Store: updateStats called with:', newStats);
        set((state) => {
          const updatedStats = {
            totalPokemon: state.stats.totalPokemon + (newStats.totalPokemon || 0),
            shinyCount: state.stats.shinyCount + (newStats.shinyCount || 0),
            legendaryCount: state.stats.legendaryCount + (newStats.legendaryCount || 0),
            battlesWon: state.stats.battlesWon + (newStats.battlesWon || 0),
            battlesLost: state.stats.battlesLost + (newStats.battlesLost || 0),
          };
          console.log('📊 Store: Stats updated:', updatedStats);
          return {
            stats: updatedStats,
          };
        });
      },

      setInGame: (inGame: boolean) => {
        console.log('🎮 Store: setInGame called with:', inGame);
        set({ isInGame: inGame });
      },
    }),
    {
      name: 'pokemon-game-storage',
      // Solo persistir pokemon y stats, no isInGame
      partialize: (state) => ({
        pokemon: state.pokemon,
        stats: state.stats,
      }),
    }
  )
);