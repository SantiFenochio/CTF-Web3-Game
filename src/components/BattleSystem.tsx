'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZapIcon, 
  HeartIcon, 
  ShieldIcon, 
  SwordIcon, 
  TimerIcon,
  TrophyIcon,
  FlameIcon
} from 'lucide-react'
import { Pokemon, PokemonType } from '../types/pokemon'
import { MOVES, getTypeEffectiveness, POKEMON_TYPES, Move } from '../data/pokemon'

interface BattleSystemProps {
  playerPokemon: Pokemon
  opponentPokemon: Pokemon
  onBattleEnd: (winner: 'player' | 'opponent') => void
}

interface BattleState {
  turn: 'player' | 'opponent'
  playerHp: number
  opponentHp: number
  playerStatus?: 'burn' | 'poison' | 'paralysis' | 'sleep' | 'freeze'
  opponentStatus?: 'burn' | 'poison' | 'paralysis' | 'sleep' | 'freeze'
  weather?: 'sun' | 'rain' | 'sandstorm' | 'hail'
  battleLog: string[]
  isAnimating: boolean
}

export default function BattleSystem({ playerPokemon, opponentPokemon, onBattleEnd }: BattleSystemProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    turn: 'player',
    playerHp: playerPokemon.hp,
    opponentHp: opponentPokemon.hp,
    battleLog: [`${playerPokemon.name} vs ${opponentPokemon.name}!`, 'Battle begins!'],
    isAnimating: false
  })

  const [selectedMove, setSelectedMove] = useState<number | null>(null)

  // Calculate damage with complex formula (like Pokemon Showdown)
  const calculateDamage = (attacker: Pokemon, defender: Pokemon, move: Move): number => {
    const attackStat = move.type === PokemonType.Psychic || move.type === PokemonType.Fire ? 
      attacker.spAttack : attacker.attack
    const defenseStat = move.type === PokemonType.Psychic || move.type === PokemonType.Fire ? 
      defender.spDefense : defender.defense
    
    // Base damage calculation
    let damage = Math.floor(
      (((2 * attacker.level + 10) / 250) * (attackStat / defenseStat) * move.power + 2)
    )
    
    // Type effectiveness
    const effectiveness = getTypeEffectiveness(move.type, defender.types)
    damage *= effectiveness
    
    // STAB (Same Type Attack Bonus)
    if (attacker.types.includes(move.type)) {
      damage *= 1.5
    }
    
    // Critical hit (10% chance)
    if (Math.random() < 0.1) {
      damage *= 1.5
      setBattleState(prev => ({
        ...prev,
        battleLog: [...prev.battleLog, 'Critical hit!']
      }))
    }
    
    // Random factor (85-100%)
    damage *= (Math.random() * 0.15 + 0.85)
    
    // Weather effects
    if (battleState.weather === 'rain' && move.type === PokemonType.Water) {
      damage *= 1.5
    } else if (battleState.weather === 'sun' && move.type === PokemonType.Fire) {
      damage *= 1.5
    }
    
    return Math.max(1, Math.floor(damage))
  }

  // AI opponent move selection
  const getAIMove = (): Move => {
    const moves = opponentPokemon.moves.map(id => MOVES[id])
    // Simple AI: prefer super effective moves
    const superEffectiveMoves = moves.filter(move => 
      getTypeEffectiveness(move.type, playerPokemon.types) > 1
    )
    
    if (superEffectiveMoves.length > 0) {
      return superEffectiveMoves[Math.floor(Math.random() * superEffectiveMoves.length)]
    }
    
    return moves[Math.floor(Math.random() * moves.length)]
  }

  // Execute move
  const executeMove = async (attacker: Pokemon, defender: Pokemon, move: Move, isPlayer: boolean) => {
    setBattleState(prev => ({ ...prev, isAnimating: true }))
    
    const damage = calculateDamage(attacker, defender, move)
    const effectiveness = getTypeEffectiveness(move.type, defender.types)
    
    let effectivenessText = ''
    if (effectiveness > 1) effectivenessText = "It's super effective!"
    else if (effectiveness < 1) effectivenessText = "It's not very effective..."
    
    // Update battle log
    setBattleState(prev => ({
      ...prev,
      battleLog: [
        ...prev.battleLog,
        `${attacker.name} used ${move.name}!`,
        ...(effectivenessText ? [effectivenessText] : [])
      ]
    }))
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Apply damage
    setBattleState(prev => ({
      ...prev,
      ...(isPlayer ? 
        { opponentHp: Math.max(0, prev.opponentHp - damage) } : 
        { playerHp: Math.max(0, prev.playerHp - damage) }
      ),
      isAnimating: false
    }))
    
    // Check for battle end
    setTimeout(() => {
      if (isPlayer && battleState.opponentHp - damage <= 0) {
        onBattleEnd('player')
      } else if (!isPlayer && battleState.playerHp - damage <= 0) {
        onBattleEnd('opponent')
      } else {
        // Switch turns
        setBattleState(prev => ({
          ...prev,
          turn: isPlayer ? 'opponent' : 'player'
        }))
      }
    }, 1000)
  }

  // Player move
  const handlePlayerMove = async (moveId: number) => {
    if (battleState.turn !== 'player' || battleState.isAnimating) return
    
    const move = MOVES[moveId]
    await executeMove(playerPokemon, opponentPokemon, move, true)
    setSelectedMove(null)
  }

  // AI turn
  useEffect(() => {
    if (battleState.turn === 'opponent' && !battleState.isAnimating) {
      const timer = setTimeout(async () => {
        const aiMove = getAIMove()
        await executeMove(opponentPokemon, playerPokemon, aiMove, false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [battleState.turn, battleState.isAnimating])

  const getHpPercentage = (current: number, max: number) => (current / max) * 100
  const getHpColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500'
    if (percentage > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Battle Arena */}
        <div className="relative bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 mb-6 overflow-hidden">
          {/* Weather Effects */}
          {battleState.weather && (
            <div className="absolute inset-0 pointer-events-none">
              {battleState.weather === 'rain' && (
                <div className="animate-pulse bg-blue-500/20 w-full h-full"></div>
              )}
              {battleState.weather === 'sun' && (
                <div className="animate-pulse bg-yellow-500/20 w-full h-full"></div>
              )}
            </div>
          )}
          
          {/* Opponent Pokemon */}
          <div className="flex justify-end mb-8">
            <motion.div
              animate={battleState.isAnimating && battleState.turn === 'opponent' ? 
                { x: [-20, 0], scale: [1.1, 1] } : {}
              }
              className="text-right"
            >
              <div className="text-white font-bold text-xl mb-2">{opponentPokemon.name}</div>
              <div className="bg-black/30 rounded-lg p-3 mb-2">
                <div className="text-white text-sm mb-1">HP: {battleState.opponentHp}/{opponentPokemon.hp}</div>
                <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getHpColor(getHpPercentage(battleState.opponentHp, opponentPokemon.hp))}`}
                    animate={{ width: `${getHpPercentage(battleState.opponentHp, opponentPokemon.hp)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <motion.div
                animate={battleState.isAnimating && battleState.turn === 'opponent' ? 
                  { scale: [1, 1.2, 1], rotate: [0, -10, 0] } : {}
                }
                className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl"
              >
                👾
              </motion.div>
            </motion.div>
          </div>
          
          {/* Player Pokemon */}
          <div className="flex justify-start">
            <motion.div
              animate={battleState.isAnimating && battleState.turn === 'player' ? 
                { x: [20, 0], scale: [1.1, 1] } : {}
              }
              className="text-left"
            >
              <motion.div
                animate={battleState.isAnimating && battleState.turn === 'player' ? 
                  { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}
                }
                className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-4xl mb-2"
              >
                ⚡
              </motion.div>
              <div className="bg-black/30 rounded-lg p-3 mb-2">
                <div className="text-white text-sm mb-1">HP: {battleState.playerHp}/{playerPokemon.hp}</div>
                <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getHpColor(getHpPercentage(battleState.playerHp, playerPokemon.hp))}`}
                    animate={{ width: `${getHpPercentage(battleState.playerHp, playerPokemon.hp)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-white font-bold text-xl">{playerPokemon.name}</div>
            </motion.div>
          </div>
        </div>

        {/* Battle Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Move Selection */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <SwordIcon className="w-6 h-6 mr-2 text-red-400" />
              Choose Move
            </h3>
            
            {battleState.turn === 'player' ? (
              <div className="grid grid-cols-2 gap-3">
                {playerPokemon.moves.map(moveId => {
                  const move = MOVES[moveId]
                  const typeInfo = POKEMON_TYPES[move.type]
                  
                  return (
                    <motion.button
                      key={move.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePlayerMove(move.id)}
                      disabled={battleState.isAnimating}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg p-4 text-left transition-all"
                      style={{ borderLeft: `4px solid ${typeInfo.color}` }}
                    >
                      <div className="font-bold text-lg">{move.name}</div>
                      <div className="text-sm opacity-80">{typeInfo.name} • {move.power} Power</div>
                      <div className="text-xs opacity-60 mt-1">{move.description}</div>
                    </motion.button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
                />
                <div className="text-white">Opponent is choosing a move...</div>
              </div>
            )}
          </div>
          
          {/* Battle Log */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TimerIcon className="w-6 h-6 mr-2 text-yellow-400" />
              Battle Log
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {battleState.battleLog.slice(-8).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-gray-300 bg-black/20 rounded p-2"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 