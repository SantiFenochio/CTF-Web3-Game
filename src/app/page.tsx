'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlagIcon, SwordIcon, TrophyIcon, UsersIcon, ZapIcon } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey } from '@solana/web3.js'
import { useGameStore } from '@/store/gameStore'
import { pokemonData, generateRandomPokemon, POKEMON_TYPES, PokemonType } from '@/data/pokemon'
import { Pokemon } from '@/types/pokemon'
import WalletConnect from '@/components/ui/WalletConnect'
import BoosterPack from '@/components/BoosterPack'
import GameLobby from '@/components/game/GameLobby'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
// import PokemonCard from '../components/PokemonCard'
// import BattleArena from '../components/BattleArena'
import BattleSystem from '../components/BattleSystem'
import OnlineBattle from '../components/OnlineBattle'
import BattleSimulator from '../components/BattleSimulator'
import TeamBuilder from '../components/TeamBuilder'
import PokemonMarketplace from '../components/PokemonMarketplace'
// import TrainerProfile from '../components/TrainerProfile'
// Remove duplicate imports
// import { generateRandomPokemon, POKEMON_TYPES } from '../data/pokemon'
// import { Trainer, Pokemon, Battle } from '../types/pokemon'

// Define Trainer interface
interface Trainer {
  publicKey: PublicKey;
  username: string;
  level: number;
  experience: number;
  battlesWon: number;
  battlesLost: number;
  pokemonCaught: number;
  pokeCoins: number;
  badges: string[];
  pokemonTeam: PublicKey[];
  pokemonBox: PublicKey[];
  createdAt: number;
  bump: number;
}

// Define additional Pokemon interface for the mock program
interface ProgramPokemon {
  trainer: PublicKey;
  speciesId: number;
  name: string;
  level: number;
  experience: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  types: PokemonType[];
  moves: number[];
  nature: number;
  isShiny: boolean;
  caughtAt: number;
  mint: PublicKey;
  bump: number;
}

// Mock hook para desarrollo
const useMockPokemonProgram = () => {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [userPokemon, setUserPokemon] = useState<ProgramPokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate starter Pokémon
  const generateStarterPokemon = (): ProgramPokemon[] => {
    // Incluir algunos de los nuevos Pokémon
    const starterSpecies = [1, 4, 7, 25, 39, 6, 9, 94, 151] // Añadidos: Charizard, Blastoise, Gengar, Mew
    
    return starterSpecies.map(speciesId => {
      const basePokemon = generateRandomPokemon()
      return {
        trainer: new PublicKey('11111111111111111111111111111112'),
        speciesId,
        name: basePokemon.name,
        level: Math.floor(Math.random() * 10) + 5, // Level 5-15
        experience: 100,
        hp: basePokemon.stats.hp + 20,
        attack: basePokemon.stats.attack + 10,
        defense: basePokemon.stats.defense + 10,
        spAttack: 50, // Default values since they don't exist in current BasePokemon
        spDefense: 50,
        speed: basePokemon.stats.speed + 10,
        types: [PokemonType.Normal], // Default type
        moves: [1, 2, 3, 4], // Default moves
        nature: Math.floor(Math.random() * 25),
        isShiny: Math.random() < 0.05, // 5% shiny chance for starters
        caughtAt: Date.now(),
        mint: PublicKey.unique(),
        bump: 0
      }
    })
  }

  const registerTrainer = async (username: string) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate 5 starter Pokémon
    const starterPokemon = generateStarterPokemon()
    setUserPokemon(starterPokemon)
    
    const newTrainer: Trainer = {
      publicKey: new PublicKey('11111111111111111111111111111112'),
      username,
      level: 1,
      experience: 0,
      battlesWon: 0,
      battlesLost: 0,
      pokemonCaught: 5, // Start with 5 starter Pokémon
      pokeCoins: 1000,
      badges: [],
      pokemonTeam: starterPokemon.slice(0, 6).map(p => p.mint), // First 5 in team
      pokemonBox: [],
      createdAt: Date.now(),
      bump: 0
    }
    setTrainer(newTrainer)
    setLoading(false)
  }

  const catchPokemon = async (basePokemon: any) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newPokemon: ProgramPokemon = {
      trainer: new PublicKey('11111111111111111111111111111112'),
      speciesId: 1, // Default ID
      name: basePokemon.name,
      level: Math.floor(Math.random() * 20) + 5,
      experience: 100,
      hp: basePokemon.stats.hp + 20,
      attack: basePokemon.stats.attack + 10,
      defense: basePokemon.stats.defense + 10,
      spAttack: 50,
      spDefense: 50,
      speed: basePokemon.stats.speed + 10,
      types: [PokemonType.Normal],
      moves: [1, 2, 3, 4],
      nature: Math.floor(Math.random() * 25),
      isShiny: Math.random() < 0.02, // 2% shiny chance for wild
      caughtAt: Date.now(),
      mint: PublicKey.unique(),
      bump: 0
    }
    
    setUserPokemon(prev => [...prev, newPokemon])
    
    if (trainer) {
      setTrainer(prev => {
        if (prev) {
          return {
            ...prev,
            pokemonCaught: prev.pokemonCaught + 1,
            pokeCoins: prev.pokeCoins - 10
          }
        }
        return null
      })
    }
    setLoading(false)
  }

  const challengeTrainer = async (opponent: any, wager: number) => {
    console.log('Challenge trainer:', opponent, wager)
  }

  const openBoosterPack = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Generate 3 random Pokémon with higher rarity
    const packPokemon: ProgramPokemon[] = Array(3).fill(null).map(() => {
      const basePokemon = generateRandomPokemon()
      return {
        trainer: new PublicKey('11111111111111111111111111111112'),
        speciesId: 1, // Default ID
        name: basePokemon.name,
        level: Math.floor(Math.random() * 30) + 20, // Level 20-50
        experience: 500,
        hp: basePokemon.stats.hp + 30,
        attack: basePokemon.stats.attack + 20,
        defense: basePokemon.stats.defense + 20,
        spAttack: 70,
        spDefense: 70,
        speed: basePokemon.stats.speed + 20,
        types: [PokemonType.Normal],
        moves: [1, 2, 3, 4],
        nature: Math.floor(Math.random() * 25),
        isShiny: Math.random() < 0.10, // 10% shiny chance for booster packs
        caughtAt: Date.now(),
        mint: PublicKey.unique(),
        bump: 0
      }
    })
    
    setUserPokemon(prev => [...prev, ...packPokemon])
    
    if (trainer) {
      setTrainer(prev => {
        if (prev) {
          return {
            ...prev,
            pokemonCaught: prev.pokemonCaught + 3
          }
        }
        return null
      })
    }
    
    setLoading(false)
    return packPokemon
  }

  return {
    trainer,
    userPokemon,
    registerTrainer,
    catchPokemon,
    openBoosterPack,
    challengeTrainer,
    loading,
    error
  }
}

// Converter function to convert ProgramPokemon to Pokemon for UI components
const convertToPokemon = (programPokemon: ProgramPokemon): Pokemon => {
  return {
    id: programPokemon.mint.toString(),
    name: programPokemon.name,
    type: programPokemon.types.map(t => POKEMON_TYPES[t].name),
    rarity: programPokemon.isShiny ? 'rare' : programPokemon.level >= 80 ? 'legendary' : 'common',
    level: programPokemon.level,
    hp: programPokemon.hp,
    attack: programPokemon.attack,
    defense: programPokemon.defense,
    speed: programPokemon.speed,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${programPokemon.speciesId}.png`,
    abilities: ["Ability 1", "Ability 2"], // Default abilities
    isShiny: programPokemon.isShiny,
    isLegendary: programPokemon.level >= 80,
    owner: 'player'
  };
};

export default function HomePage() {
  const { connected, publicKey } = useWallet()
  const { isInGame, pokemon, addPokemon, updateStats } = useGameStore()
  const { 
    trainer, 
    userPokemon,
    registerTrainer, 
    catchPokemon, 
    openBoosterPack,
    challengeTrainer,
    loading,
    error 
  } = useMockPokemonProgram()

  const [activeTab, setActiveTab] = useState<'home' | 'collection' | 'battle' | 'profile' | 'teambuilder' | 'marketplace' | 'packs' | 'quickBattle' | 'rankedBattle'>('home')
  const [username, setUsername] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isOpeningPack, setIsOpeningPack] = useState(false)
  const [isCatching, setIsCatching] = useState(false)

  const tabs = [
    { id: 'home', label: 'Home', icon: FlagIcon },
    { id: 'collection', label: 'Collection', icon: UsersIcon },
    { id: 'battle', label: 'Battle', icon: SwordIcon },
    { id: 'teambuilder', label: 'Team Builder', icon: TrophyIcon },
    { id: 'marketplace', label: 'Marketplace', icon: ZapIcon },
    { id: 'packs', label: 'Booster Packs', icon: TrophyIcon },
    { id: 'profile', label: 'Profile', icon: UsersIcon },
  ]

  const generateRandomPokemon = (): { pokemon: Pokemon; isShiny: boolean; isLegendary: boolean } => {
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
  const handleRegisterTrainer = async () => {
    if (!username.trim()) return
    
    setIsRegistering(true)
    try {
      await registerTrainer(username)
    } catch (error) {
      console.error('Failed to register trainer:', error)
    }
    setIsRegistering(false)
  }

  const handleCatchPokemon = async () => {
    console.log('=== 🐛 DEBUGGING START ===');
    console.log('1. isCatching:', isCatching);
    console.log('2. pokemonData existe:', typeof pokemonData !== 'undefined');
    console.log('3. pokemonData length:', pokemonData?.length || 'undefined');
    console.log('4. addPokemon function exists:', typeof addPokemon === 'function');
    console.log('5. updateStats function exists:', typeof updateStats === 'function');
    
    if (isCatching) {
      console.log('❌ Ya está capturando, retornando...');
      return;
    }
    
    setIsCatching(true);
    console.log('6. ✅ setIsCatching(true) ejecutado');
    
    try {
      console.log('7. 🕐 Iniciando delay de 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('8. ✅ Delay completado');
      
      console.log('9. 🎲 Generando Pokémon aleatorio...');
      const result = generateRandomPokemon();
      console.log('10. ✅ Pokémon generado:', {
        name: result.pokemon.name,
        id: result.pokemon.id,
        isShiny: result.isShiny,
        isLegendary: result.isLegendary,
        rarity: result.pokemon.rarity
      });
      
      console.log('11. 🏪 Llamando addPokemon...');
      try {
        addPokemon(result.pokemon);
        console.log('12. ✅ addPokemon ejecutado sin errores');
      } catch (addError) {
        console.error('❌ ERROR en addPokemon:', addError);
      }
      
      console.log('13. 📊 Llamando updateStats...');
      try {
        updateStats({
          totalPokemon: 1,
          shinyCount: result.isShiny ? 1 : 0,
          legendaryCount: result.isLegendary ? 1 : 0
        });
        console.log('14. ✅ updateStats ejecutado sin errores');
      } catch (updateError) {
        console.error('❌ ERROR en updateStats:', updateError);
      }
      
      console.log('15. 🎉 ÉXITO: Pokémon capturado:', result.pokemon.name);
      
      // Verificar el estado del store después
      console.log('16. 🔍 Verificando estado del store...');
      // Esta línea podría fallar si el store no expone el estado correctamente
      
    } catch (error: unknown) {
      console.error('❌ ERROR GENERAL en handleCatchPokemon:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
    } finally {
      console.log('17. 🔄 Ejecutando setIsCatching(false)...');
      setIsCatching(false);
      console.log('18. ✅ setIsCatching(false) completado');
      console.log('=== 🐛 DEBUGGING END ===');
    }
  };
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center"
            >
              <ZapIcon className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-6xl font-bold text-white mb-4">
              Pokémon <span className="text-yellow-400">Solana</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The first fully on-chain Pokémon battle experience on Solana. 
              Catch, train, and battle with NFT Pokémon while earning PokéCoins.
            </p>
          </div>

          <div className="space-y-4">
            <WalletMultiButton className="!bg-gradient-to-r !from-yellow-400 !to-red-500 hover:!from-yellow-500 hover:!to-red-600 !rounded-xl !py-4 !px-8 !text-black !font-bold !text-lg" />
            <p className="text-sm text-gray-400">
              Connect your Solana wallet to start your Pokémon journey
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <ZapIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">NFT Pokémon</h3>
              <p className="text-gray-300">
                Each Pokémon is a unique NFT with individual stats, moves, and characteristics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <SwordIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">PvP Battles</h3>
              <p className="text-gray-300">
                Challenge other trainers to on-chain battles with real stakes and rewards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <TrophyIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-300">
                Win battles to earn PokéCoins and rare Pokémon NFTs.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FlagIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Become a Trainer
            </h2>
            <p className="text-gray-300">
              Register as a Pokémon trainer to start your journey
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Trainer Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your trainer name"
                className={`
                  w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                  text-white placeholder-gray-400 focus:outline-none 
                  focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                `}
                maxLength={32}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegisterTrainer}
              disabled={!username.trim() || isRegistering}
              className={`
                w-full bg-gradient-to-r from-yellow-400 to-red-500 
                hover:from-yellow-500 hover:to-red-600 disabled:opacity-50 
                disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl 
                transition-all duration-200 flex items-center justify-center space-x-2
              `}
            >
              {isRegistering ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span>Start Journey</span>
                  <FlagIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
              <ZapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Pokémon Solana</h1>
              <p className="text-sm text-gray-300">
                Welcome, {trainer.username}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 bg-white/10 rounded-lg px-3 py-1">
                <FlagIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{trainer.pokeCoins.toLocaleString()}</span>
              </div>
              <div className={`
                flex items-center space-x-1 bg-white/10 
                rounded-lg px-3 py-1
              `}>
                <TrophyIcon className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">
                  {trainer.battlesWon}W/{trainer.battlesLost}L
                </span>
              </div>
            </div>
            <WalletMultiButton className="!bg-white/10 !border-white/20" />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={handleCatchPokemon}
                  className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Catch Pokémon</h3>
                    <FlagIcon className="w-6 h-6 text-green-400 group-hover:rotate-90 transition-transform" />
                  </div>
                  <p className="text-gray-300 mb-4">
                    Discover and catch new Pokémon to add to your collection.
                  </p>
                  <div className="text-sm text-green-400 font-medium">
                    {isCatching ? 'Catching...' : 'Click to catch a random Pokémon'}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('packs')}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Booster Packs</h3>
                    <TrophyIcon className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-gray-300 mb-4">
                    Open premium packs for legendary Pokémon!
                  </p>
                  <div className="text-sm text-yellow-400 font-medium">
                    50 USDC per pack
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('battle')}
                  className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Battle Arena</h3>
                    <SwordIcon className="w-6 h-6 text-red-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <p className="text-gray-300 mb-4">
                    Challenge other trainers to epic Pokémon battles.
                  </p>
                  <div className="text-sm text-red-400 font-medium">
                    Enter the battle arena
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('profile')}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Trainer Profile</h3>
                    <UsersIcon className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-gray-300 mb-4">
                    View your stats, achievements, and progress.
                  </p>
                  <div className="text-sm text-purple-400 font-medium">
                    Level {trainer.level} Trainer
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300">Pokémon in collection</span>
                    <span className="text-white font-medium">{userPokemon.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300">Shiny Pokémon</span>
                    <span className="text-yellow-400 font-medium">{userPokemon.filter(p => p.isShiny).length} ✨</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300">Legendary Pokémon</span>
                    <span className="text-purple-400 font-medium">{userPokemon.filter(p => p.level >= 80).length} 🏆</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300">Win rate</span>
                    <span className="text-white font-medium">
                      {trainer.battlesWon + trainer.battlesLost > 0 
                        ? Math.round((trainer.battlesWon / (trainer.battlesWon + trainer.battlesLost)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Pokémon Collection</h2>
                <p className="text-gray-300">Manage your Pokémon team and view your collection ({userPokemon.length} total)</p>
              </div>
              
              {userPokemon.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FlagIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Pokémon Yet</h3>
                  <p className="text-gray-400 mb-6">Catch your first Pokémon to start building your collection</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCatchPokemon}
                    disabled={isCatching}
                    className={`font-bold py-3 px-6 rounded-xl text-white ${
                      isCatching 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                    }`}
                  >
                    {isCatching ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Catching...</span>
                      </div>
                    ) : (
                      'Catch First Pokémon'
                    )}
                    {/* Sección para ver Pokémon capturados */}
<div className="mt-8 p-6 bg-gray-800 rounded-xl">
  <h3 className="text-white text-xl font-bold mb-4">
    🎒 Pokémon Capturados: {pokemon.length}
  </h3>
  
  {pokemon.length === 0 ? (
    <p className="text-gray-400 text-center">
      No has capturado ningún Pokémon todavía. ¡Haz clic en el botón de arriba!
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pokemon.map((poke) => (
        <div key={poke.id} className="bg-gray-700 p-4 rounded-lg text-white border-2 border-gray-600">
          <img 
            src={poke.image} 
            alt={poke.name} 
            className="w-20 h-20 mx-auto mb-2" 
          />
          <p className="text-center font-bold text-lg">{poke.name}</p>
          <p className="text-center text-sm text-gray-300">
            Level {poke.level} | {poke.rarity}
            {poke.isShiny && " ✨ SHINY"}
            {poke.isLegendary && " 👑 LEGENDARY"}
          </p>
          <div className="text-xs text-center mt-2 text-gray-400">
            HP: {poke.hp} | ATK: {poke.attack} | DEF: {poke.defense} | SPD: {poke.speed}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Collection Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {userPokemon.map((pokemon, index) => (
                      <motion.div
                        key={pokemon.mint.toString()}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl ${
                            pokemon.isShiny ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            pokemon.level >= 80 ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                            pokemon.level >= 50 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-600'
                          }`}>
                            {pokemon.isShiny ? '✨' : '⚡'}
                          </div>
                          <div className="font-bold text-white mb-1">{pokemon.name}</div>
                          <div className="text-sm text-gray-300 mb-2">Level {pokemon.level}</div>
                          <div className="flex justify-center space-x-1 mb-2">
                            {pokemon.types.map(type => (
                              <span
                                key={type}
                                className="px-2 py-1 text-xs rounded"
                                style={{ backgroundColor: POKEMON_TYPES[type]?.color + '40' || '#64748b40' }}
                              >
                                {POKEMON_TYPES[type]?.name || 'Unknown'}
                              </span>
                            ))}
                          </div>
                          {pokemon.isShiny && (
                            <div className="text-xs text-yellow-400 font-bold">✨ SHINY ✨</div>
                          )}
                          {pokemon.level >= 80 && (
                            <div className="text-xs text-purple-400 font-bold">🏆 LEGENDARY 🏆</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Collection Stats */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4">Collection Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{userPokemon.length}</div>
                        <div className="text-sm text-gray-300">Total Pokémon</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {userPokemon.filter(p => p.isShiny).length}
                        </div>
                        <div className="text-sm text-gray-300">Shiny</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {userPokemon.filter(p => p.level >= 80).length}
                        </div>
                        <div className="text-sm text-gray-300">Legendary</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round(userPokemon.reduce((sum, p) => sum + p.level, 0) / userPokemon.length) || 0}
                        </div>
                        <div className="text-sm text-gray-300">Avg Level</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">⚔️ Battle Arena</h2>
                  <p className="text-gray-300">Challenge trainers and prove your skills!</p>
                </div>

                {/* Battle Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ⚔️
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Quick Battle</h3>
                      <p className="text-gray-300 mb-4">Fight against random trainers</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTab('quickBattle');
                        }}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-bold"
                      >
                        Start Battle
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        🏆
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Ranked Battle</h3>
                      <p className="text-gray-300 mb-4">Climb the competitive ladder</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTab('rankedBattle');
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold"
                      >
                        Find Match
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Battle History */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Battles</h3>
                  <div className="space-y-3">
                    {[
                      { opponent: 'PokeMaster', result: 'Won', wager: 100, time: '2h ago' },
                      { opponent: 'DragonSlayer', result: 'Lost', wager: 50, time: '5h ago' },
                      { opponent: 'EliteTrainer', result: 'Won', wager: 200, time: '1d ago' }
                    ].map((battle, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${battle.result === 'Won' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-white font-medium">vs {battle.opponent}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${battle.result === 'Won' ? 'text-green-400' : 'text-red-400'}`}>
                            {battle.result === 'Won' ? '+' : '-'}{battle.wager} PC
                          </div>
                          <div className="text-xs text-gray-400">{battle.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quickBattle' && (
            <motion.div
              key="quickBattle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Quick Battle</h2>
                <button 
                  onClick={() => setActiveTab('battle')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Back to Arena
                </button>
              </div>
              <BattleSimulator 
                playerTeam={userPokemon.slice(0, 3).map(convertToPokemon)}
                opponentTeam={
                  Array(3).fill(0).map(() => {
                    // Use our own BasePokemon instead of the function result
                    const randomIndex = Math.floor(Math.random() * pokemonData.length);
                    const basePokemon = pokemonData[randomIndex];
                    
                    const programPokemon: ProgramPokemon = {
                      trainer: new PublicKey('11111111111111111111111111111111'),
                      speciesId: 1,
                      name: basePokemon.name,
                      level: Math.floor(Math.random() * 20) + 40,
                      experience: 100,
                      hp: basePokemon.stats.hp + 20,
                      attack: basePokemon.stats.attack + 10,
                      defense: basePokemon.stats.defense + 10,
                      spAttack: 60,
                      spDefense: 60,
                      speed: basePokemon.stats.speed + 10,
                      types: [PokemonType.Normal],
                      moves: [1, 2, 3, 4],
                      nature: Math.floor(Math.random() * 25),
                      isShiny: Math.random() < 0.02,
                      caughtAt: Date.now(),
                      mint: PublicKey.unique(),
                      bump: 0
                    };
                    return convertToPokemon(programPokemon);
                  })
                }
                onBattleEnd={(winner) => {
                  console.log(`Battle ended! Winner: ${winner}`);
                  setTimeout(() => {
                    setActiveTab('battle');
                  }, 3000);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'rankedBattle' && (
            <motion.div
              key="rankedBattle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Ranked Battle</h2>
                <button 
                  onClick={() => setActiveTab('battle')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Back to Arena
                </button>
              </div>
              <OnlineBattle 
                battleId="random"
                teamId={userPokemon.slice(0, 6).map(p => p.mint.toString()).join(',')}
                onBattleEnd={(winner) => {
                  console.log(`Online battle ended! Winner: ${winner}`);
                  setTimeout(() => {
                    setActiveTab('battle');
                  }, 3000);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'teambuilder' && (
            <motion.div
              key="teambuilder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TeamBuilder 
                initialTeam={userPokemon.slice(0, 6).map(convertToPokemon)}
                onTeamSave={(team) => {
                  console.log('Team saved:', team)
                  alert(`Team saved with ${team.length} Pokémon!`)
                }}
              />
            </motion.div>
          )}

          {activeTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PokemonMarketplace
                userPublicKey={publicKey || undefined}
                userPokemon={userPokemon}
                onPurchase={(listing) => {
                  console.log('Purchasing:', listing)
                  alert(`Purchased ${listing.pokemon.name} for ${listing.price} PC!`)
                }}
                onSell={(pokemon, price, type) => {
                  console.log('Selling:', pokemon, price, type)
                  alert(`Listed ${pokemon.name} for ${price} PC!`)
                }}
              />
            </motion.div>
          )}

          {activeTab === 'packs' && (
            <motion.div
              key="packs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">📦 Booster Packs</h2>
                  <p className="text-gray-300">Open packs to get rare and legendary Pokémon!</p>
                </div>

                {/* Pack Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gold-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                      📦
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Premium Booster Pack</h3>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Contains:</span>
                        <span className="text-white font-bold">3-5 Pokémon</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Legendary Chance:</span>
                        <span className="text-purple-400 font-bold">5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Rare Chance:</span>
                        <span className="text-blue-400 font-bold">15%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Shiny Boost:</span>
                        <span className="text-yellow-400 font-bold">+10%</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-6">50 USDC</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpeningPack(true)}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg"
                    >
                      {loading ? '🎲 Opening Pack...' : '💳 Buy Pack (50 USDC)'}
                    </motion.button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                      🎁
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Starter Pack</h3>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Contains:</span>
                        <span className="text-white font-bold">5 Pokémon</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Level Range:</span>
                        <span className="text-blue-400 font-bold">5-15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Shiny Chance:</span>
                        <span className="text-yellow-400 font-bold">5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">One-time only:</span>
                        <span className="text-green-400 font-bold">✓ FREE</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-6">FREE</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={true}
                      className="w-full bg-gray-600 text-white font-bold py-4 rounded-xl text-lg opacity-50 cursor-not-allowed"
                    >
                      ✅ Already Claimed
                    </motion.button>
                  </motion.div>
                </div>

                {/* Pack Opening History */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">📊 Recent Pack Openings</h3>
                  <div className="space-y-3">
                    {[
                      { user: 'You', result: 'Legendary Mewtwo ✨', time: '2h ago', type: 'legendary' },
                      { user: 'PokeMaster99', result: 'Shiny Charizard', time: '3h ago', type: 'shiny' },
                      { user: 'TrainerAce', result: '3 Rare Pokémon', time: '5h ago', type: 'rare' },
                      { user: 'You', result: '4 Common Pokémon', time: '1d ago', type: 'common' }
                    ].map((opening, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {opening.type === 'legendary' && '🏆'}
                            {opening.type === 'shiny' && '✨'}
                            {opening.type === 'rare' && '💎'}
                            {opening.type === 'common' && '📦'}
                          </div>
                          <div>
                            <div className="text-white font-medium">{opening.user}: {opening.result}</div>
                            <div className="text-xs text-gray-400">{opening.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">👤 Trainer Profile</h2>
                  <p className="text-gray-300">Your journey as a Pokémon trainer</p>
                </div>

                {/* Profile Header */}
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center text-4xl">
                      👨‍🎓
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{trainer?.username}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="bg-white/10 rounded-lg px-3 py-1">
                          <span className="text-gray-300">Level </span>
                          <span className="text-yellow-400 font-bold">{trainer?.level}</span>
                        </div>
                        <div className="bg-white/10 rounded-lg px-3 py-1">
                          <span className="text-gray-300">Rank </span>
                          <span className="text-purple-400 font-bold">Elite</span>
                        </div>
                        <div className="bg-white/10 rounded-lg px-3 py-1">
                          <span className="text-gray-300">Joined </span>
                          <span className="text-blue-400 font-bold">{new Date(trainer?.createdAt || 0).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                    <div className="text-2xl font-bold text-green-400">{trainer?.pokemonCaught}</div>
                    <div className="text-sm text-gray-300">Pokémon Caught</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                    <div className="text-2xl font-bold text-blue-400">{trainer?.battlesWon}</div>
                    <div className="text-sm text-gray-300">Battles Won</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{trainer?.pokeCoins}</div>
                    <div className="text-sm text-gray-300">PokéCoins</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {trainer ? Math.round((trainer.battlesWon / Math.max(trainer.battlesWon + trainer.battlesLost, 1)) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-300">Win Rate</div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">🏆 Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'First Steps', desc: 'Caught your first Pokémon', icon: '🎯', unlocked: true },
                      { name: 'Collector', desc: 'Caught 10 Pokémon', icon: '📦', unlocked: trainer ? trainer.pokemonCaught >= 10 : false },
                      { name: 'Battler', desc: 'Won 5 battles', icon: '⚔️', unlocked: trainer ? trainer.battlesWon >= 5 : false },
                      { name: 'Rich Trainer', desc: 'Earned 1000 PokéCoins', icon: '💰', unlocked: trainer ? trainer.pokeCoins >= 1000 : false }
                    ].map((achievement, index) => (
                      <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                        achievement.unlocked ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-500/20 border border-gray-500/30'
                      }`}>
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className={`font-bold ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                            {achievement.name}
                          </div>
                          <div className="text-sm text-gray-300">{achievement.desc}</div>
                        </div>
                        {achievement.unlocked && <div className="text-green-400">✓</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">📈 Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Caught Pikachu', time: '10 minutes ago', type: 'catch' },
                      { action: 'Won battle vs DragonMaster', time: '2 hours ago', type: 'battle' },
                      { action: 'Opened booster pack', time: '1 day ago', type: 'pack' },
                      { action: 'Registered as trainer', time: '3 days ago', type: 'register' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                        <div className="text-lg">
                          {activity.type === 'catch' && '🎯'}
                          {activity.type === 'battle' && '⚔️'}
                          {activity.type === 'pack' && '📦'}
                          {activity.type === 'register' && '🎉'}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <LoadingSpinner size="large" />
            <p className="text-white text-center mt-4">Processing transaction...</p>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color, 
  delay 
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="game-card p-6 hover:scale-105 transition-transform duration-300"
    >
      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2">
        {number}
      </div>
      <div className="text-gray-400 text-sm lg:text-base">{label}</div>
    </motion.div>
  )
} 