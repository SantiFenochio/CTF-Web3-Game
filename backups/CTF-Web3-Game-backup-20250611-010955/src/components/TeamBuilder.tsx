'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  SaveIcon, 
  ShuffleIcon,
  StarIcon,
  ZapIcon,
  ShieldIcon,
  SwordIcon,
  HeartIcon
} from 'lucide-react'
import { PublicKey } from '@solana/web3.js'
import { Pokemon, PokemonType, Nature } from '../types/pokemon'
import { BASE_POKEMON, MOVES, POKEMON_TYPES, Move, BasePokemon } from '../data/pokemon'

interface TeamSlot {
  pokemon?: Pokemon | null
  position: number
}

interface TeamBuilderProps {
  onTeamSave: (team: Pokemon[]) => void
  initialTeam?: Pokemon[]
}

export default function TeamBuilder({ onTeamSave, initialTeam = [] }: TeamBuilderProps) {
  const [team, setTeam] = useState<TeamSlot[]>(
    Array.from({ length: 6 }, (_, i) => ({
      pokemon: initialTeam[i] || null,
      position: i
    }))
  )
  
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<BasePokemon | null>(null)
  const [customMoves, setCustomMoves] = useState<number[]>([])
  const [customLevel, setCustomLevel] = useState(50)
  const [customNature, setCustomNature] = useState<Nature>(Nature.Hardy)

  // Pokemon species list
  const pokemonSpecies = Object.values(BASE_POKEMON)

  // Available moves list
  const availableMoves = Object.values(MOVES)

  const createCustomPokemon = (): Pokemon => {
    if (!selectedSpecies) throw new Error('No species selected')

    const pokemon: Pokemon = {
      trainer: globalThis.window?.solana?.publicKey || new PublicKey('11111111111111111111111111111112'),
      speciesId: selectedSpecies.id,
      name: selectedSpecies.name,
      level: customLevel,
      experience: customLevel * 100,
      hp: selectedSpecies.baseStats.hp + 20 + customLevel,
      attack: selectedSpecies.baseStats.attack + 10 + Math.floor(customLevel / 2),
      defense: selectedSpecies.baseStats.defense + 10 + Math.floor(customLevel / 2),
      spAttack: selectedSpecies.baseStats.spAttack + 10 + Math.floor(customLevel / 2),
      spDefense: selectedSpecies.baseStats.spDefense + 10 + Math.floor(customLevel / 2),
      speed: selectedSpecies.baseStats.speed + 10 + Math.floor(customLevel / 2),
      types: selectedSpecies.types,
      moves: customMoves.length > 0 ? customMoves : selectedSpecies.moves,
      nature: customNature,
      isShiny: Math.random() < 0.1, // 10% shiny chance in team builder
      caughtAt: Date.now(),
      mint: PublicKey.unique(),
      bump: 0
    }

    return pokemon
  }

  const addPokemonToTeam = (pokemon: Pokemon) => {
    if (selectedSlot === null) return

    setTeam(prev => prev.map((slot, index) => 
      index === selectedSlot 
        ? { ...slot, pokemon }
        : slot
    ))

    setSelectedSlot(null)
    setIsBuilding(false)
    setSelectedSpecies(null)
    setCustomMoves([])
  }

  const removePokemonFromTeam = (position: number) => {
    setTeam(prev => prev.map((slot, index) => 
      index === position 
        ? { ...slot, pokemon: null }
        : slot
    ))
  }

  const handleMoveToggle = (moveId: number) => {
    setCustomMoves(prev => {
      if (prev.includes(moveId)) {
        return prev.filter(id => id !== moveId)
      } else if (prev.length < 4) {
        return [...prev, moveId]
      }
      return prev
    })
  }

  const saveTeam = () => {
    const validTeam = team
      .map(slot => slot.pokemon)
      .filter((pokemon): pokemon is Pokemon => pokemon !== null)
    
    if (validTeam.length === 0) {
      alert('Add at least one Pokémon to your team!')
      return
    }

    onTeamSave(validTeam)
  }

  const generateRandomTeam = () => {
    const newTeam = Array.from({ length: 6 }, (_, i) => {
      const randomSpecies = pokemonSpecies[Math.floor(Math.random() * pokemonSpecies.length)]
      const randomLevel = Math.floor(Math.random() * 50) + 50
      const randomNature = Math.floor(Math.random() * 25) as Nature

      const pokemon: Pokemon = {
        trainer: globalThis.window?.solana?.publicKey || new PublicKey('11111111111111111111111111111112'),
        speciesId: randomSpecies.id,
        name: randomSpecies.name,
        level: randomLevel,
        experience: randomLevel * 100,
        hp: randomSpecies.baseStats.hp + 20 + randomLevel,
        attack: randomSpecies.baseStats.attack + 10 + Math.floor(randomLevel / 2),
        defense: randomSpecies.baseStats.defense + 10 + Math.floor(randomLevel / 2),
        spAttack: randomSpecies.baseStats.spAttack + 10 + Math.floor(randomLevel / 2),
        spDefense: randomSpecies.baseStats.spDefense + 10 + Math.floor(randomLevel / 2),
        speed: randomSpecies.baseStats.speed + 10 + Math.floor(randomLevel / 2),
        types: randomSpecies.types,
        moves: randomSpecies.moves,
        nature: randomNature,
        isShiny: Math.random() < 0.05,
        caughtAt: Date.now(),
        mint: PublicKey.unique(),
        bump: 0
      }

      return { pokemon, position: i }
    })

    setTeam(newTeam)
  }

  const getTeamTypeDistribution = () => {
    const types: Record<PokemonType, number> = {} as any
    
    team.forEach(slot => {
      if (slot.pokemon) {
        slot.pokemon.types.forEach(type => {
          types[type] = (types[type] || 0) + 1
        })
      }
    })

    return types
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <StarIcon className="w-8 h-8 mr-3 text-yellow-400" />
          Team Builder
        </h2>
        <p className="text-gray-300">Build your perfect competitive team like in Pokémon Showdown</p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Team Slots */}
        <div className="lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Your Team (6 max)</h3>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateRandomTeam}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <ShuffleIcon className="w-4 h-4" />
                  <span>Random</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTeam}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>Save Team</span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {team.map((slot, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedSlot(index)
                    setIsBuilding(true)
                  }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-dashed border-gray-600 hover:border-yellow-400 cursor-pointer transition-all"
                >
                  {slot.pokemon ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                        {slot.pokemon.isShiny ? '✨' : '⚡'}
                      </div>
                      <div className="font-bold text-white text-sm mb-1">{slot.pokemon.name}</div>
                      <div className="text-xs text-gray-300 mb-2">Level {slot.pokemon.level}</div>
                      <div className="flex justify-center space-x-1 mb-2">
                        {slot.pokemon.types.map(type => (
                          <span
                            key={type}
                            className="px-2 py-1 text-xs rounded"
                            style={{ backgroundColor: POKEMON_TYPES[type].color + '40' }}
                          >
                            {POKEMON_TYPES[type].name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removePokemonFromTeam(index)
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PlusIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Add Pokémon</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Analysis */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Team Analysis</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Type Distribution</h4>
              <div className="space-y-1">
                {Object.entries(getTeamTypeDistribution()).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-xs">
                    <span style={{ color: POKEMON_TYPES[parseInt(type) as PokemonType].color }}>
                      {POKEMON_TYPES[parseInt(type) as PokemonType].name}
                    </span>
                    <span className="text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Team Stats</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Pokémon: {team.filter(slot => slot.pokemon).length}/6</div>
                <div>Avg Level: {Math.round(team.filter(slot => slot.pokemon).reduce((sum, slot) => sum + (slot.pokemon?.level || 0), 0) / Math.max(1, team.filter(slot => slot.pokemon).length))}</div>
                <div>Shiny: {team.filter(slot => slot.pokemon?.isShiny).length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Builder Modal */}
      <AnimatePresence>
        {isBuilding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Build Pokémon</h3>
                <button
                  onClick={() => {
                    setIsBuilding(false)
                    setSelectedSlot(null)
                    setSelectedSpecies(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {!selectedSpecies ? (
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Choose Pokémon Species</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pokemonSpecies.map(species => (
                      <motion.button
                        key={species.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSpecies(species)}
                        className="bg-white/10 rounded-lg p-4 border border-white/20 hover:border-yellow-400 transition-all"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
                            ⚡
                          </div>
                          <div className="font-bold text-white text-sm">{species.name}</div>
                          <div className="flex justify-center space-x-1 mt-1">
                            {species.types.map(type => (
                              <span
                                key={type}
                                className="px-1 py-0.5 text-xs rounded"
                                style={{ backgroundColor: POKEMON_TYPES[type].color + '40' }}
                              >
                                {POKEMON_TYPES[type].name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{selectedSpecies.name}</h4>
                      <div className="flex space-x-2">
                        {selectedSpecies.types.map(type => (
                          <span
                            key={type}
                            className="px-2 py-1 text-sm rounded"
                            style={{ backgroundColor: POKEMON_TYPES[type].color + '60' }}
                          >
                            {POKEMON_TYPES[type].name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customization Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={customLevel}
                        onChange={(e) => setCustomLevel(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-white font-bold">{customLevel}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nature</label>
                      <select
                        value={customNature}
                        onChange={(e) => setCustomNature(parseInt(e.target.value) as Nature)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        {Object.entries(Nature).filter(([key]) => isNaN(Number(key))).map(([name, value]) => (
                          <option key={value} value={value}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Move Selection */}
                  <div>
                    <h5 className="text-lg font-bold text-white mb-4">Select Moves (max 4)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableMoves.map(move => (
                        <motion.button
                          key={move.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMoveToggle(move.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            customMoves.includes(move.id)
                              ? 'border-yellow-400 bg-yellow-400/20'
                              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                          }`}
                        >
                          <div className="font-bold text-white">{move.name}</div>
                          <div className="text-sm text-gray-300">{POKEMON_TYPES[move.type].name} • {move.power} Power</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const pokemon = createCustomPokemon()
                        addPokemonToTeam(pokemon)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex-1"
                    >
                      Add to Team
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSpecies(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                    >
                      Back
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 