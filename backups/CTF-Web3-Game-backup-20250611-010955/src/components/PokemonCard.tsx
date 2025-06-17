import { motion } from 'framer-motion';
import { Zap, Heart, Shield, Swords } from 'lucide-react';
import { PokemonCard as PokemonCardType } from '../types/pokemon';
import { POKEMON_TYPES, MOVES } from '../data/pokemon';

interface PokemonCardProps {
  pokemon: PokemonCardType;
  onClick?: () => void;
  selected?: boolean;
  showStats?: boolean;
  className?: string;
}

export default function PokemonCard({ 
  pokemon, 
  onClick, 
  selected = false, 
  showStats = true,
  className = '' 
}: PokemonCardProps) {
  const healthPercentage = (pokemon.hp / pokemon.maxHp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg 
        rounded-xl border border-white/20 p-4 cursor-pointer transition-all duration-300
        ${selected ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20' : ''}
        ${pokemon.isShiny ? 'shadow-lg shadow-purple-500/30 border-purple-300/50' : ''}
        ${className}
      `}
    >
      {/* Shiny indicator */}
      {pokemon.isShiny && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
      )}

      {/* Pokemon Image */}
      <div className="relative mb-3">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
          {pokemon.imageUrl ? (
            <img 
              src={pokemon.imageUrl} 
              alt={pokemon.name}
              className="w-20 h-20 object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        {/* Level badge */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          Lv.{pokemon.level}
        </div>
      </div>

      {/* Pokemon Name */}
      <h3 className="text-lg font-bold text-white text-center mb-2">
        {pokemon.name}
      </h3>

      {/* Types */}
      <div className="flex justify-center gap-2 mb-3">
        {pokemon.types.map((type, index) => {
          const typeInfo = POKEMON_TYPES[type];
          return (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: typeInfo.color }}
            >
              {typeInfo.name}
            </span>
          );
        })}
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-400" />
            HP
          </span>
          <span>{pokemon.hp}/{pokemon.maxHp}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              healthPercentage > 50 
                ? 'bg-green-500' 
                : healthPercentage > 25 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <Swords className="w-3 h-3 text-red-400" />
            <span>ATK: {pokemon.attack}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>DEF: {pokemon.defense}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>SpA: {pokemon.spAttack}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-400" />
            <span>SpD: {pokemon.spDefense}</span>
          </div>
        </div>
      )}

      {/* Moves */}
      <div className="space-y-1">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Moves:</h4>
        <div className="grid grid-cols-2 gap-1">
          {pokemon.moves.slice(0, 4).map((moveId, index) => {
            const move = MOVES[moveId];
            if (!move) return null;
            
            const moveTypeInfo = POKEMON_TYPES[move.type];
            
            return (
              <div
                key={index}
                className="text-xs px-2 py-1 rounded bg-white/10 text-white truncate"
                title={`${move.name} - ${move.description}`}
              >
                <span 
                  className="inline-block w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: moveTypeInfo.color }}
                />
                {move.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience bar (if not max level) */}
      {pokemon.level < 100 && (
        <div className="mt-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>EXP</span>
            <span>{pokemon.experience} / {pokemon.level * 100}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((pokemon.experience / (pokemon.level * 100)) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
} 