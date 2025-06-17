'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBattleSocket } from '../hooks/useBattleSocket'
import { MOVES, POKEMON_TYPES } from '../data/pokemon'
import { PokemonType } from '../types/pokemon'

interface OnlineBattleProps {
  battleId: string
  teamId?: string
  onBattleEnd?: (winner: 'player' | 'opponent') => void
}

export default function OnlineBattle({ battleId, teamId, onBattleEnd }: OnlineBattleProps) {
  const {
    connected,
    isInBattle,
    playerTeam,
    opponentTeam,
    battleLogs,
    error,
    joinBattle,
    leaveBattle,
    useMove,
    switchPokemon,
    sendChatMessage
  } = useBattleSocket()
  
  const [chatMessage, setChatMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  
  // Unirse a la batalla cuando el componente se monta
  useEffect(() => {
    if (connected && !isInBattle && battleId) {
      joinBattle(battleId, teamId)
    }
    
    return () => {
      if (isInBattle && battleId) {
        leaveBattle(battleId)
      }
    }
  }, [connected, isInBattle, battleId, teamId, joinBattle, leaveBattle])
  
  // Manejar fin de la batalla
  useEffect(() => {
    if (!isInBattle && playerTeam && opponentTeam && onBattleEnd) {
      // Determinar el ganador basado en el último log de batalla
      const lastLog = battleLogs[battleLogs.length - 1]
      if (lastLog && lastLog.type === 'win') {
        onBattleEnd(lastLog.player === 'player' ? 'player' : 'opponent')
      }
    }
  }, [isInBattle, playerTeam, opponentTeam, battleLogs, onBattleEnd])
  
  // Manejar envío de mensaje de chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      sendChatMessage(chatMessage)
      setChatMessage('')
    }
  }
  
  // Calcular porcentaje de HP
  const getHpPercentage = (current: number, max: number) => (current / max) * 100
  
  // Obtener color basado en porcentaje de HP
  const getHpColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500'
    if (percentage > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  // Si no está conectado, mostrar pantalla de carga
  if (!connected) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Conectando al servidor de batalla...</p>
        </div>
      </div>
    )
  }
  
  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-xl mb-2">Error de conexión</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }
  
  // Si no está en batalla, mostrar pantalla de carga
  if (!isInBattle || !playerTeam || !opponentTeam) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Esperando oponente...</p>
        </div>
      </div>
    )
  }
  
  // Obtener Pokémon activos
  const playerActivePokemon = playerTeam[0] // Asumimos que el primero es el activo
  const opponentActivePokemon = opponentTeam[0] // Asumimos que el primero es el activo
  
  return (
    <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="p-4">
        {/* Información de batalla */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Batalla en línea</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowChat(!showChat)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              {showChat ? 'Ocultar chat' : 'Mostrar chat'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo de batalla (2/3 del ancho) */}
          <div className="md:col-span-2">
            {/* Arena de batalla */}
            <div className="relative bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 mb-4">
              {/* Pokémon del oponente */}
              <div className="flex justify-end mb-8">
                <div className="text-right">
                  <div className="text-white font-bold text-xl mb-2">{opponentActivePokemon.name} Lv.{opponentActivePokemon.level}</div>
                  <div className="bg-black/30 rounded-lg p-3 mb-2">
                    <div className="text-white text-sm mb-1">
                      HP: {opponentActivePokemon.currentHp}/{opponentActivePokemon.hp}
                    </div>
                    <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getHpColor(getHpPercentage(opponentActivePokemon.currentHp, opponentActivePokemon.hp))}`}
                        animate={{ width: `${getHpPercentage(opponentActivePokemon.currentHp, opponentActivePokemon.hp)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }}
                    className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl"
                  >
                    {/* Reemplazar con sprite real */}
                    <span role="img" aria-label="pokemon">🦊</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Pokémon del jugador */}
              <div className="flex justify-start">
                <div className="text-left">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }}
                    className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-4xl mb-2"
                  >
                    {/* Reemplazar con sprite real */}
                    <span role="img" aria-label="pokemon">⚡</span>
                  </motion.div>
                  <div className="bg-black/30 rounded-lg p-3 mb-2">
                    <div className="text-white text-sm mb-1">
                      HP: {playerActivePokemon.currentHp}/{playerActivePokemon.hp}
                    </div>
                    <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getHpColor(getHpPercentage(playerActivePokemon.currentHp, playerActivePokemon.hp))}`}
                        animate={{ width: `${getHpPercentage(playerActivePokemon.currentHp, playerActivePokemon.hp)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <div className="text-white font-bold text-xl">{playerActivePokemon.name} Lv.{playerActivePokemon.level}</div>
                </div>
              </div>
            </div>
            
            {/* Controles de batalla */}
            <div className="grid grid-cols-2 gap-4">
              {/* Selección de movimientos */}
              <div className="bg-gray-800/80 rounded-lg p-4">
                <h3 className="text-white text-lg font-bold mb-2">Movimientos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {playerActivePokemon.moves.map((moveId) => {
                    const move = MOVES[moveId]
                    return (
                      <button
                        key={moveId}
                        onClick={() => useMove(moveId, 0)} // 0 es el índice del Pokémon activo
                        className={`p-2 rounded-md text-white text-left ${
                          POKEMON_TYPES[move.type].color.toLowerCase()
                        } hover:opacity-90 transition-opacity`}
                      >
                        <div className="font-medium">{move.name}</div>
                        <div className="text-xs">Poder: {move.power}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Equipo del jugador */}
              <div className="bg-gray-800/80 rounded-lg p-4">
                <h3 className="text-white text-lg font-bold mb-2">Equipo</h3>
                <div className="flex flex-wrap gap-2">
                  {playerTeam.map((pokemon, index) => (
                    <button
                      key={index}
                      onClick={() => switchPokemon(0, index)} // Cambiar desde el Pokémon activo (0) al seleccionado
                      disabled={index === 0 || pokemon.currentHp <= 0}
                      className={`p-2 rounded-md ${
                        index === 0 ? 'bg-blue-600' :
                        pokemon.currentHp <= 0 ? 'bg-gray-600' : 'bg-blue-500'
                      } text-white text-sm hover:opacity-90 transition-opacity`}
                    >
                      <div>{pokemon.name}</div>
                      <div className="text-xs">{pokemon.currentHp}/{pokemon.hp} HP</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel lateral (1/3 del ancho) */}
          <div>
            {/* Registro de batalla */}
            <div className="bg-gray-800/80 rounded-lg p-4 mb-4">
              <h3 className="text-white text-lg font-bold mb-2">Registro de batalla</h3>
              <div className="h-60 overflow-y-auto bg-gray-900/50 rounded p-2 text-white text-sm">
                {battleLogs.slice().reverse().map((log) => (
                  <div key={log.id} className="mb-1">
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat (opcional, mostrar/ocultar) */}
            {showChat && (
              <div className="bg-gray-800/80 rounded-lg p-4">
                <h3 className="text-white text-lg font-bold mb-2">Chat</h3>
                <div className="h-40 overflow-y-auto bg-gray-900/50 rounded p-2 text-white text-sm mb-2">
                  {/* Mensajes de chat filtrados de los logs */}
                  {battleLogs
                    .filter(log => log.type === 'chat')
                    .slice()
                    .reverse()
                    .map((log) => (
                      <div key={log.id} className="mb-1">
                        <span className={`font-bold ${log.player === 'player' ? 'text-blue-400' : 'text-red-400'}`}>
                          {log.player === 'player' ? 'Tú: ' : 'Oponente: '}
                        </span>
                        {log.message}
                      </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-gray-700 text-white rounded-l px-3 py-1 text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-r px-3 py-1 text-sm"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 