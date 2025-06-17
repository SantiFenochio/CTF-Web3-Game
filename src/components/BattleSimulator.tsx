'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Pokemon, PokemonType, BattleLog } from '../types/pokemon'
import { MOVES, POKEMON_TYPES, getTypeEffectiveness } from '../data/pokemon'
import { v4 as uuidv4 } from 'uuid'
import PokemonSprite from './PokemonSprite'

interface BattleSimulatorProps {
  playerTeam: Pokemon[]
  opponentTeam: Pokemon[]
  onBattleEnd?: (winner: 'player' | 'opponent') => void
}

interface BattlePokemon extends Pokemon {
  currentHp: number
  statBoosts: {
    attack: number
    defense: number
    spAttack: number
    spDefense: number
    speed: number
    accuracy: number
    evasion: number
  }
  volatileStatus: {
    confused?: boolean
    flinch?: boolean
    bound?: boolean
    leechSeed?: boolean
  }
}

interface BattleState {
  turn: number
  playerActivePokemon: number
  opponentActivePokemon: number
  playerTeam: BattlePokemon[]
  opponentTeam: BattlePokemon[]
  isPlayerTurn: boolean
  battleLogs: BattleLog[]
  weather: 'none' | 'sun' | 'rain' | 'sandstorm' | 'hail'
  weatherTurns: number
  isAnimating: boolean
  battleEnded: boolean
  winner?: 'player' | 'opponent'
}

// Define el tipo de retorno de calculateDamage
interface DamageResult {
  damage: number;
  missed: boolean;
  critical: boolean;
  effectiveness: number;
}

export default function BattleSimulator({ playerTeam, opponentTeam, onBattleEnd }: BattleSimulatorProps) {
  // Initialize battle state
  const [battleState, setBattleState] = useState<BattleState>(() => {
    // Convert Pokemon to BattlePokemon
    const initPlayerTeam: BattlePokemon[] = playerTeam.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      statBoosts: {
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0,
        accuracy: 0,
        evasion: 0
      },
      volatileStatus: {}
    }))

    const initOpponentTeam: BattlePokemon[] = opponentTeam.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      statBoosts: {
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0,
        accuracy: 0,
        evasion: 0
      },
      volatileStatus: {}
    }))

    return {
      turn: 1,
      playerActivePokemon: 0,
      opponentActivePokemon: 0,
      playerTeam: initPlayerTeam,
      opponentTeam: initOpponentTeam,
      isPlayerTurn: Math.random() > 0.5, // Random first turn
      battleLogs: [
        {
          id: uuidv4(),
          type: 'move',
          message: `Battle between ${playerTeam[0].name} and ${opponentTeam[0].name} started!`,
          timestamp: Date.now()
        }
      ],
      weather: 'none',
      weatherTurns: 0,
      isAnimating: false,
      battleEnded: false
    }
  })

  // Calculate effective stats considering stat boosts
  const calculateEffectiveStat = useCallback((pokemon: BattlePokemon, stat: keyof typeof pokemon.statBoosts) => {
    const baseStat = stat === 'attack' ? pokemon.attack :
                    stat === 'defense' ? pokemon.defense :
                    stat === 'spAttack' ? pokemon.spAttack :
                    stat === 'spDefense' ? pokemon.spDefense :
                    stat === 'speed' ? pokemon.speed : 0
    
    const boost = pokemon.statBoosts[stat]
    const multiplier = boost >= 0 ? (2 + boost) / 2 : 2 / (2 - boost)
    
    return Math.floor(baseStat * multiplier)
  }, [])

  // Calculate damage with Pokemon Showdown formula
  const calculateDamage = useCallback((attacker: BattlePokemon, defender: BattlePokemon, moveId: number): DamageResult => {
    const move = MOVES[moveId]
    if (!move) return { damage: 0, missed: false, critical: false, effectiveness: 1 }
    
    // Check if move hits
    if (Math.random() * 100 > move.accuracy) {
      return { damage: 0, missed: true, critical: false, effectiveness: 1 }
    }
    
    // Get effective stats
    const attackStat = move.type === PokemonType.Psychic || 
                      move.type === PokemonType.Fire || 
                      move.type === PokemonType.Water || 
                      move.type === PokemonType.Grass || 
                      move.type === PokemonType.Ice || 
                      move.type === PokemonType.Electric || 
                      move.type === PokemonType.Dragon || 
                      move.type === PokemonType.Dark || 
                      move.type === PokemonType.Fairy ? 
                      calculateEffectiveStat(attacker, 'spAttack') : 
                      calculateEffectiveStat(attacker, 'attack')
    
    const defenseStat = move.type === PokemonType.Psychic || 
                        move.type === PokemonType.Fire || 
                        move.type === PokemonType.Water || 
                        move.type === PokemonType.Grass || 
                        move.type === PokemonType.Ice || 
                        move.type === PokemonType.Electric || 
                        move.type === PokemonType.Dragon || 
                        move.type === PokemonType.Dark || 
                        move.type === PokemonType.Fairy ? 
                        calculateEffectiveStat(defender, 'spDefense') : 
                        calculateEffectiveStat(defender, 'defense')
    
    // Base damage formula
    let damage = Math.floor(
      ((2 * attacker.level + 10) / 250) * (attackStat / defenseStat) * move.power + 2
    )
    
    // Type effectiveness
    const effectiveness = getTypeEffectiveness(move.type, defender.types)
    damage = Math.floor(damage * effectiveness)
    
    // STAB (Same Type Attack Bonus)
    if (attacker.types.includes(move.type)) {
      damage = Math.floor(damage * 1.5)
    }
    
    // Critical hit (6.25% chance like in modern games)
    const isCritical = Math.random() < 0.0625
    if (isCritical) {
      damage = Math.floor(damage * 1.5)
    }
    
    // Random factor (85-100%)
    damage = Math.floor(damage * (0.85 + Math.random() * 0.15))
    
    // Weather effects
    if ((battleState.weather === 'rain' && move.type === PokemonType.Water) ||
        (battleState.weather === 'sun' && move.type === PokemonType.Fire)) {
      damage = Math.floor(damage * 1.5)
    } else if ((battleState.weather === 'rain' && move.type === PokemonType.Fire) ||
               (battleState.weather === 'sun' && move.type === PokemonType.Water)) {
      damage = Math.floor(damage * 0.5)
    }
    
    return { 
      damage: Math.max(1, damage), 
      missed: false, 
      critical: isCritical, 
      effectiveness 
    }
  }, [battleState.weather, calculateEffectiveStat])

  // Execute a move
  const executeMove = useCallback(async (moveId: number) => {
    if (battleState.isAnimating || battleState.battleEnded) return

    setBattleState(prev => ({ ...prev, isAnimating: true }))
    
    const isPlayerTurn = battleState.isPlayerTurn
    const attacker = isPlayerTurn ? 
      battleState.playerTeam[battleState.playerActivePokemon] : 
      battleState.opponentTeam[battleState.opponentActivePokemon]
    
    const defender = isPlayerTurn ? 
      battleState.opponentTeam[battleState.opponentActivePokemon] : 
      battleState.playerTeam[battleState.playerActivePokemon]
    
    const { damage, missed, critical, effectiveness } = calculateDamage(attacker, defender, moveId)
    
    // Create battle logs
    const newLogs: BattleLog[] = [
      {
        id: uuidv4(),
        type: 'move',
        message: `${attacker.name} used ${MOVES[moveId].name}!`,
        timestamp: Date.now(),
        player: isPlayerTurn ? 'player' : 'opponent',
        pokemon: attacker.name
      }
    ]
    
    if (missed) {
      newLogs.push({
        id: uuidv4(),
        type: 'move',
        message: `${attacker.name}'s attack missed!`,
        timestamp: Date.now() + 1,
        player: isPlayerTurn ? 'player' : 'opponent',
        pokemon: attacker.name
      })
    } else {
      if (effectiveness > 1) {
        newLogs.push({
          id: uuidv4(),
          type: 'move',
          message: "It's super effective!",
          timestamp: Date.now() + 1
        })
      } else if (effectiveness < 1 && effectiveness > 0) {
        newLogs.push({
          id: uuidv4(),
          type: 'move',
          message: "It's not very effective...",
          timestamp: Date.now() + 1
        })
      } else if (effectiveness === 0) {
        newLogs.push({
          id: uuidv4(),
          type: 'move',
          message: "It doesn't affect the opposing Pokémon...",
          timestamp: Date.now() + 1
        })
      }
      
      if (critical) {
        newLogs.push({
          id: uuidv4(),
          type: 'move',
          message: "A critical hit!",
          timestamp: Date.now() + 2
        })
      }
      
      if (damage > 0) {
        newLogs.push({
          id: uuidv4(),
          type: 'move',
          message: `${defender.name} lost ${damage} HP!`,
          timestamp: Date.now() + 3,
          damage: damage
        })
      }
    }
    
    // Update state with damage
    setBattleState(prev => {
      const newState = { ...prev }
      
      // Add logs
      newState.battleLogs = [...prev.battleLogs, ...newLogs]
      
      if (!missed && damage > 0) {
        // Apply damage
        if (isPlayerTurn) {
          const newOpponentTeam = [...prev.opponentTeam]
          newOpponentTeam[prev.opponentActivePokemon] = {
            ...newOpponentTeam[prev.opponentActivePokemon],
            currentHp: Math.max(0, newOpponentTeam[prev.opponentActivePokemon].currentHp - damage)
          }
          newState.opponentTeam = newOpponentTeam
        } else {
          const newPlayerTeam = [...prev.playerTeam]
          newPlayerTeam[prev.playerActivePokemon] = {
            ...newPlayerTeam[prev.playerActivePokemon],
            currentHp: Math.max(0, newPlayerTeam[prev.playerActivePokemon].currentHp - damage)
          }
          newState.playerTeam = newPlayerTeam
        }
      }
      
      return newState
    })
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check for fainted Pokémon
    const updatedDefenderHp = isPlayerTurn ? 
      battleState.opponentTeam[battleState.opponentActivePokemon].currentHp - (missed ? 0 : damage) : 
      battleState.playerTeam[battleState.playerActivePokemon].currentHp - (missed ? 0 : damage)
    
    if (updatedDefenderHp <= 0) {
      // Pokémon fainted
      const faintedLog: BattleLog = {
        id: uuidv4(),
        type: 'faint',
        message: `${defender.name} fainted!`,
        timestamp: Date.now() + 4,
        player: isPlayerTurn ? 'opponent' : 'player',
        pokemon: defender.name
      }
      
      setBattleState(prev => ({
        ...prev,
        battleLogs: [...prev.battleLogs, faintedLog]
      }))
      
      // Wait for faint animation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if battle ended
      const allFainted = isPlayerTurn ? 
        battleState.opponentTeam.every(p => p.currentHp <= 0) : 
        battleState.playerTeam.every(p => p.currentHp <= 0)
      
      if (allFainted) {
        // Battle ended
        const winner = isPlayerTurn ? 'player' : 'opponent'
        const winLog: BattleLog = {
          id: uuidv4(),
          type: 'win',
          message: `${winner === 'player' ? 'You' : 'Opponent'} won the battle!`,
          timestamp: Date.now() + 5
        }
        
        setBattleState(prev => ({
          ...prev,
          battleLogs: [...prev.battleLogs, winLog],
          battleEnded: true,
          winner,
          isAnimating: false
        }))
        
        if (onBattleEnd) {
          onBattleEnd(winner)
        }
        
        return
      }
      
      // Switch to next Pokémon
      const nextPokemonIndex = findNextPokemon(isPlayerTurn ? 'opponent' : 'player')
      
      if (nextPokemonIndex !== -1) {
        if (isPlayerTurn) {
          setBattleState(prev => ({
            ...prev,
            opponentActivePokemon: nextPokemonIndex,
            battleLogs: [...prev.battleLogs, {
              id: uuidv4(),
              type: 'switch',
              message: `Opponent sent out ${battleState.opponentTeam[nextPokemonIndex].name}!`,
              timestamp: Date.now() + 6,
              player: 'opponent',
              pokemon: battleState.opponentTeam[nextPokemonIndex].name
            }],
            isAnimating: false,
            isPlayerTurn: !prev.isPlayerTurn
          }))
        } else {
          setBattleState(prev => ({
            ...prev,
            playerActivePokemon: nextPokemonIndex,
            battleLogs: [...prev.battleLogs, {
              id: uuidv4(),
              type: 'switch',
              message: `Go, ${battleState.playerTeam[nextPokemonIndex].name}!`,
              timestamp: Date.now() + 6,
              player: 'player',
              pokemon: battleState.playerTeam[nextPokemonIndex].name
            }],
            isAnimating: false,
            isPlayerTurn: !prev.isPlayerTurn
          }))
        }
      }
    } else {
      // Switch turns
      setBattleState(prev => ({
        ...prev,
        isAnimating: false,
        isPlayerTurn: !prev.isPlayerTurn,
        turn: prev.isPlayerTurn ? prev.turn + 1 : prev.turn // Increment turn counter after both players have moved
      }))
    }
  }, [battleState, calculateDamage, onBattleEnd])

  // Find next available Pokémon
  const findNextPokemon = useCallback((side: 'player' | 'opponent'): number => {
    const team = side === 'player' ? battleState.playerTeam : battleState.opponentTeam
    const currentIndex = side === 'player' ? battleState.playerActivePokemon : battleState.opponentActivePokemon
    
    // Look for the next Pokémon with HP > 0
    for (let i = 0; i < team.length; i++) {
      if (i !== currentIndex && team[i].currentHp > 0) {
        return i
      }
    }
    
    return -1 // No available Pokémon
  }, [battleState])

  // Switch Pokémon
  const switchPokemon = useCallback((newIndex: number) => {
    if (battleState.isAnimating || battleState.battleEnded) return
    if (newIndex === battleState.playerActivePokemon) return
    if (battleState.playerTeam[newIndex].currentHp <= 0) return
    
    setBattleState(prev => ({
      ...prev,
      isAnimating: true
    }))
    
    const switchLog: BattleLog = {
      id: uuidv4(),
      type: 'switch',
      message: `${battleState.playerTeam[battleState.playerActivePokemon].name}, come back! Go, ${battleState.playerTeam[newIndex].name}!`,
      timestamp: Date.now(),
      player: 'player',
      pokemon: battleState.playerTeam[newIndex].name
    }
    
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        playerActivePokemon: newIndex,
        battleLogs: [...prev.battleLogs, switchLog],
        isAnimating: false,
        isPlayerTurn: false // Switching uses a turn
      }))
    }, 1500)
  }, [battleState])

  // AI opponent logic
  useEffect(() => {
    if (!battleState.isPlayerTurn && !battleState.isAnimating && !battleState.battleEnded) {
      const timer = setTimeout(() => {
        const activePokemon = battleState.opponentTeam[battleState.opponentActivePokemon]
        
        // If current Pokémon has low HP, consider switching
        if (activePokemon.currentHp < activePokemon.hp * 0.25) {
          const nextPokemonIndex = findNextPokemon('opponent')
          if (nextPokemonIndex !== -1 && Math.random() > 0.5) {
            // Switch to another Pokémon
            const switchLog: BattleLog = {
              id: uuidv4(),
              type: 'switch',
              message: `Opponent withdrew ${activePokemon.name}! Opponent sent out ${battleState.opponentTeam[nextPokemonIndex].name}!`,
              timestamp: Date.now(),
              player: 'opponent',
              pokemon: battleState.opponentTeam[nextPokemonIndex].name
            }
            
            setBattleState(prev => ({
              ...prev,
              isAnimating: true
            }))
            
            setTimeout(() => {
              setBattleState(prev => ({
                ...prev,
                opponentActivePokemon: nextPokemonIndex,
                battleLogs: [...prev.battleLogs, switchLog],
                isAnimating: false,
                isPlayerTurn: true
              }))
            }, 1500)
            
            return
          }
        }
        
        // Choose a move
        const availableMoves = activePokemon.moves
        
        // Prioritize super effective moves
        const playerPokemon = battleState.playerTeam[battleState.playerActivePokemon]
        const moveEffectiveness = availableMoves.map(moveId => {
          const move = MOVES[moveId]
          return {
            moveId,
            effectiveness: getTypeEffectiveness(move.type, playerPokemon.types)
          }
        })
        
        // Sort by effectiveness
        moveEffectiveness.sort((a, b) => b.effectiveness - a.effectiveness)
        
        // 70% chance to use the most effective move, 30% chance to use a random move
        const selectedMove = Math.random() < 0.7 ? 
          moveEffectiveness[0].moveId : 
          availableMoves[Math.floor(Math.random() * availableMoves.length)]
        
        executeMove(selectedMove)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [battleState, executeMove, findNextPokemon])

  // Calculate HP percentage for display
  const getHpPercentage = (current: number, max: number) => (current / max) * 100
  
  // Get color based on HP percentage
  const getHpColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500'
    if (percentage > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const playerPokemon = battleState.playerTeam[battleState.playerActivePokemon]
  const opponentPokemon = battleState.opponentTeam[battleState.opponentActivePokemon]

  return (
    <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      {/* Battle arena */}
      <div className="relative bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 mb-4">
        {/* Weather effects */}
        {battleState.weather !== 'none' && (
          <div className="absolute inset-0 pointer-events-none">
            {battleState.weather === 'rain' && (
              <div className="animate-rain bg-blue-500/20 w-full h-full"></div>
            )}
            {battleState.weather === 'sun' && (
              <div className="animate-sun bg-yellow-500/20 w-full h-full"></div>
            )}
            {battleState.weather === 'sandstorm' && (
              <div className="animate-sandstorm bg-yellow-700/20 w-full h-full"></div>
            )}
            {battleState.weather === 'hail' && (
              <div className="animate-hail bg-blue-200/20 w-full h-full"></div>
            )}
          </div>
        )}
        
        {/* Opponent's Pokémon */}
        <div className="flex justify-end mb-8">
          <div className="text-right">
            <div className="text-white font-bold text-xl mb-2">{opponentPokemon.name} Lv.{opponentPokemon.level}</div>
            <div className="bg-black/30 rounded-lg p-3 mb-2">
              <div className="text-white text-sm mb-1">
                HP: {opponentPokemon.currentHp}/{opponentPokemon.hp}
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getHpColor(getHpPercentage(opponentPokemon.currentHp, opponentPokemon.hp))}`}
                  animate={{ width: `${getHpPercentage(opponentPokemon.currentHp, opponentPokemon.hp)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <motion.div
              animate={battleState.isAnimating && !battleState.isPlayerTurn ? 
                { scale: [1, 1.2, 1], rotate: [0, -5, 0] } : {}
              }
              className="w-40 h-40 flex items-center justify-center"
            >
              <PokemonSprite 
                speciesId={opponentPokemon.speciesId} 
                isShiny={opponentPokemon.isShiny}
                size={160}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Player's Pokémon */}
        <div className="flex justify-start">
          <div className="text-left">
            <motion.div
              animate={battleState.isAnimating && battleState.isPlayerTurn ? 
                { scale: [1, 1.2, 1], rotate: [0, 5, 0] } : {}
              }
              className="w-40 h-40 flex items-center justify-center mb-2"
            >
              <PokemonSprite 
                speciesId={playerPokemon.speciesId}
                isShiny={playerPokemon.isShiny}
                isBackView={true}
                size={160}
              />
            </motion.div>
            <div className="bg-black/30 rounded-lg p-3 mb-2">
              <div className="text-white text-sm mb-1">
                HP: {playerPokemon.currentHp}/{playerPokemon.hp}
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getHpColor(getHpPercentage(playerPokemon.currentHp, playerPokemon.hp))}`}
                  animate={{ width: `${getHpPercentage(playerPokemon.currentHp, playerPokemon.hp)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="text-white font-bold text-xl">{playerPokemon.name} Lv.{playerPokemon.level}</div>
          </div>
        </div>
      </div>
      
      {/* Battle controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Move selection */}
        <div className="bg-gray-800/80 rounded-lg p-4">
          <h3 className="text-white text-lg font-bold mb-2">Moves</h3>
          <div className="grid grid-cols-2 gap-2">
            {playerPokemon.moves.map((moveId) => {
              const move = MOVES[moveId]
              return (
                <button
                  key={moveId}
                  onClick={() => battleState.isPlayerTurn && !battleState.isAnimating ? executeMove(moveId) : null}
                  disabled={!battleState.isPlayerTurn || battleState.isAnimating || battleState.battleEnded}
                  className={`p-2 rounded-md text-white text-left ${
                    !battleState.isPlayerTurn || battleState.isAnimating ? 'bg-gray-600' : 
                    POKEMON_TYPES[move.type].color.toLowerCase()
                  } hover:opacity-90 transition-opacity`}
                >
                  <div className="font-medium">{move.name}</div>
                  <div className="text-xs">Power: {move.power}</div>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Team and battle log */}
        <div className="bg-gray-800/80 rounded-lg p-4">
          <div className="mb-4">
            <h3 className="text-white text-lg font-bold mb-2">Team</h3>
            <div className="flex flex-wrap gap-2">
              {battleState.playerTeam.map((pokemon, index) => (
                <button
                  key={index}
                  onClick={() => battleState.isPlayerTurn && !battleState.isAnimating ? switchPokemon(index) : null}
                  disabled={!battleState.isPlayerTurn || battleState.isAnimating || index === battleState.playerActivePokemon || pokemon.currentHp <= 0}
                  className={`p-2 rounded-md ${
                    index === battleState.playerActivePokemon ? 'bg-blue-600' :
                    pokemon.currentHp <= 0 ? 'bg-gray-600' : 'bg-blue-500'
                  } text-white text-sm hover:opacity-90 transition-opacity flex items-center gap-2`}
                >
                  <div className="w-8 h-8">
                    <PokemonSprite 
                      speciesId={pokemon.speciesId}
                      isShiny={pokemon.isShiny}
                      size={32}
                    />
                  </div>
                  <div>
                    <div>{pokemon.name}</div>
                    <div className="text-xs">{pokemon.currentHp}/{pokemon.hp} HP</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Battle log */}
          <div>
            <h3 className="text-white text-lg font-bold mb-2">Battle Log</h3>
            <div className="h-32 overflow-y-auto bg-gray-900/50 rounded p-2 text-white text-sm">
              {battleState.battleLogs.slice().reverse().map((log) => (
                <div key={log.id} className="mb-1">
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 