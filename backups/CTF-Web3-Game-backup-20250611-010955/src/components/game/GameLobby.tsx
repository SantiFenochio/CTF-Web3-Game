'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FlagIcon, UsersIcon, ClockIcon, CrownIcon } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { useWalletStore } from '@/store/walletStore'
import { Team, GameSession, GameState } from '@/types/game'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function GameLobby() {
  const { connected, publicKey } = useWalletStore()
  const { 
    currentGame, 
    isLoading, 
    joinGame, 
    loadAvailableMaps 
  } = useGameStore()
  
  const [activeGames, setActiveGames] = useState<GameSession[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team>(Team.RED)
  const [showCreateGame, setShowCreateGame] = useState(false)

  useEffect(() => {
    if (connected) {
      loadAvailableMaps()
      loadActiveGames()
    }
  }, [connected, loadAvailableMaps])

  const loadActiveGames = async () => {
    // TODO: Load actual games from blockchain
    const mockGames: GameSession[] = [
      {
        id: 'game_1',
        mapId: 'classic_desert',
        state: GameState.WAITING,
        maxPlayers: 10,
        currentPlayers: 6,
        players: [],
        redScore: 0,
        blueScore: 0,
        maxScore: 3,
        timeLimit: 600,
        timeRemaining: 600,
        createdAt: new Date(),
        entry_fee: 0.1,
        prize_pool: 0.6,
      },
      {
        id: 'game_2',
        mapId: 'urban_warfare',
        state: GameState.ACTIVE,
        maxPlayers: 20,
        currentPlayers: 18,
        players: [],
        redScore: 1,
        blueScore: 2,
        maxScore: 5,
        timeLimit: 900,
        timeRemaining: 245,
        createdAt: new Date(),
        entry_fee: 0.05,
        prize_pool: 0.9,
      }
    ]
    setActiveGames(mockGames)
  }

  const handleJoinGame = async (gameId: string) => {
    try {
      await joinGame(gameId, selectedTeam)
    } catch (error) {
      console.error('Failed to join game:', error)
    }
  }

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">🎮 Game Lobby</h2>
        <p className="text-gray-400">Conecta tu wallet para ver las partidas disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-glow">🎮 Game Lobby</h2>
        <p className="text-gray-400">Únete a una partida existente o crea una nueva</p>
      </div>

      {/* Team Selection */}
      <div className="flex justify-center">
        <div className="game-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Selecciona tu equipo</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTeam(Team.RED)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all
                ${selectedTeam === Team.RED 
                  ? 'border-game-red bg-game-red bg-opacity-20 text-game-red' 
                  : 'border-gray-600 hover:border-game-red'
                }
              `}
            >
              <FlagIcon className="w-5 h-5" />
              <span>Equipo Rojo</span>
            </button>
            <button
              onClick={() => setSelectedTeam(Team.BLUE)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all
                ${selectedTeam === Team.BLUE 
                  ? 'border-game-blue bg-game-blue bg-opacity-20 text-game-blue' 
                  : 'border-gray-600 hover:border-game-blue'
                }
              `}
            >
              <FlagIcon className="w-5 h-5" />
              <span>Equipo Azul</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Game Button */}
      <div className="text-center">
        <button
          onClick={() => setShowCreateGame(!showCreateGame)}
          className="game-button-primary px-8 py-3 text-lg"
        >
          ➕ Crear Nueva Partida
        </button>
      </div>

      {/* Active Games */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">Partidas Activas</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <LoadingSpinner size="large" />
          </div>
        ) : activeGames.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay partidas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                onJoin={() => handleJoinGame(game.id)}
                selectedTeam={selectedTeam}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      {showCreateGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCreateGame(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="game-card p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Crear Nueva Partida</h3>
            
            <div className="space-y-4">
              <div>
                <label className="game-label">Nombre de la partida</label>
                <input 
                  type="text" 
                  className="game-input" 
                  placeholder="Mi partida épica"
                />
              </div>
              
              <div>
                <label className="game-label">Cuota de entrada (SOL)</label>
                <input 
                  type="number" 
                  className="game-input" 
                  placeholder="0.1"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="game-label">Máximo de jugadores</label>
                <select className="game-select">
                  <option value="10">10 jugadores</option>
                  <option value="20">20 jugadores</option>
                  <option value="30">30 jugadores</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  className="game-button-primary flex-1"
                  onClick={() => {
                    // TODO: Implement game creation
                    setShowCreateGame(false)
                  }}
                >
                  Crear Partida
                </button>
                <button 
                  className="game-button-secondary flex-1"
                  onClick={() => setShowCreateGame(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

interface GameCardProps {
  game: GameSession
  onJoin: () => void
  selectedTeam: Team
  delay: number
}

function GameCard({ game, onJoin, selectedTeam, delay }: GameCardProps) {
  const getStateColor = (state: GameState) => {
    switch (state) {
      case GameState.WAITING:
        return 'text-yellow-400'
      case GameState.ACTIVE:
        return 'text-green-400'
      case GameState.FINISHED:
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStateText = (state: GameState) => {
    switch (state) {
      case GameState.WAITING:
        return 'Esperando'
      case GameState.ACTIVE:
        return 'En Juego'
      case GameState.FINISHED:
        return 'Finalizado'
      default:
        return 'Desconocido'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="game-card p-6 hover:scale-105 transition-transform duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-semibold">Partida #{game.id.slice(-4)}</h4>
          <p className={`text-sm ${getStateColor(game.state)}`}>
            {getStateText(game.state)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-primary-400 font-bold">
            {game.entry_fee} SOL
          </div>
          <div className="text-sm text-gray-400">
            Premio: {game.prize_pool} SOL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-4 h-4 text-gray-400" />
          <span>{game.currentPlayers}/{game.maxPlayers}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span>{formatTime(game.timeRemaining)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-game-red">🚩</span>
          <span>{game.redScore}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-game-blue">🚩</span>
          <span>{game.blueScore}</span>
        </div>
      </div>

      <button
        onClick={onJoin}
        disabled={game.state !== GameState.WAITING || game.currentPlayers >= game.maxPlayers}
        className={`
          w-full py-2 rounded-lg font-medium transition-all
          ${game.state === GameState.WAITING && game.currentPlayers < game.maxPlayers
            ? `${selectedTeam === Team.RED ? 'bg-game-red hover:bg-red-700' : 'bg-game-blue hover:bg-blue-700'} text-white`
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {game.state !== GameState.WAITING 
          ? 'En Juego' 
          : game.currentPlayers >= game.maxPlayers 
            ? 'Llena' 
            : `Unirse como ${selectedTeam === Team.RED ? 'Rojo' : 'Azul'}`
        }
      </button>
    </motion.div>
  )
} 