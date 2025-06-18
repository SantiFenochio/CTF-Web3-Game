'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { pokemonData } from '@/data/pokemon';
import { Pokemon } from '@/types/pokemon';

interface CatchResult {
  pokemon: Pokemon;
  isShiny: boolean;
  isLegendary: boolean;
}

const BoosterPack = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [catchResult, setCatchResult] = useState<CatchResult | null>(null);
  const { addPokemon, updateStats } = useGameStore();

  const generateRandomPokemon = (): CatchResult => {
    // Seleccionar un Pokémon aleatorio
    const randomIndex = Math.floor(Math.random() * pokemonData.length);
    const basePokemon = pokemonData[randomIndex];
    
    // Probabilidades
    const isShiny = Math.random() < 0.05; // 5% chance
    const isLegendary = Math.random() < 0.10; // 10% chance
    
    // Generar stats aleatorios
    const generateStat = (base: number) => {
      const variation = Math.floor(Math.random() * 31); // 0-30 IV
      return base + variation;
    };
    
    const pokemon: Pokemon = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: basePokemon.name,
      type: basePokemon.type,
      rarity: isLegendary ? 'legendary' : isShiny ? 'rare' : 'common',
      level: Math.floor(Math.random() * 50) + 1,
      hp: generateStat(basePokemon.stats.hp),
      attack: generateStat(basePokemon.stats.attack),
      defense: generateStat(basePokemon.stats.defense),
      speed: generateStat(basePokemon.stats.speed),
      image: basePokemon.image,
      abilities: basePokemon.abilities,
      isShiny,
      isLegendary,
      owner: 'player'
    };
    
    return { pokemon, isShiny, isLegendary };
  };

  const handleCatchPokemon = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setCatchResult(null);
    
    try {
      // Simular delay de transacción
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = generateRandomPokemon();
      
      // Agregar al store
      addPokemon(result.pokemon);
      
      // Actualizar estadísticas
      updateStats({
        totalPokemon: 1,
        shinyCount: result.isShiny ? 1 : 0,
        legendaryCount: result.isLegendary ? 1 : 0
      });
      
      setCatchResult(result);
      
    } catch (error) {
      console.error('Error catching Pokemon:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeResult = () => {
    setCatchResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Botón de captura */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          🎯 Catch Wild Pokémon
        </h3>
        <p className="text-gray-300 text-center mb-6">
          Click to catch a random Pokémon from the wild!
        </p>
        
        <button
          onClick={handleCatchPokemon}
          disabled={isProcessing}
          className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all ${
            isProcessing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing transaction...</span>
            </div>
          ) : (
            'Click to catch a random Pokémon!'
          )}
        </button>
      </div>

      {/* Resultado de captura */}
      {catchResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-xl border border-purple-500/30 max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎉 Pokémon Caught!
              </h2>
              
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <div className="text-6xl mb-4">
                  {catchResult.pokemon.image}
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  catchResult.isLegendary ? 'text-yellow-400' : 
                  catchResult.isShiny ? 'text-purple-400' : 'text-white'
                }`}>
                  {catchResult.pokemon.name}
                  {catchResult.isShiny && ' ✨'}
                  {catchResult.isLegendary && ' 👑'}
                </h3>
                
                <p className="text-gray-300 mb-4">
                  Level {catchResult.pokemon.level} • {catchResult.pokemon.type}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>HP: {catchResult.pokemon.hp}</div>
                  <div>Attack: {catchResult.pokemon.attack}</div>
                  <div>Defense: {catchResult.pokemon.defense}</div>
                  <div>Speed: {catchResult.pokemon.speed}</div>
                </div>
                
                {catchResult.isShiny && (
                  <div className="mt-4 text-purple-300 font-semibold">
                    ✨ SHINY POKÉMON! ✨
                  </div>
                )}
                
                {catchResult.isLegendary && (
                  <div className="mt-4 text-yellow-300 font-semibold">
                    👑 LEGENDARY POKÉMON! 👑
                  </div>
                )}
              </div>
              
              <button
                onClick={closeResult}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold text-white transition-all"
              >
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoosterPack;