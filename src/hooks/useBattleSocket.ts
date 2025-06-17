import { useState, useEffect, useCallback } from 'react';
import { battleSocket, BattleSocketEvent, BattleSocketState } from '../utils/battleSocket';
import { Pokemon, BattleLog } from '../types/pokemon';

interface UseBattleSocketProps {
  autoConnect?: boolean;
}

interface UseBattleSocketReturn {
  connected: boolean;
  isInBattle: boolean;
  battleId?: string;
  playerTeam?: Pokemon[];
  opponentTeam?: Pokemon[];
  battleLogs: BattleLog[];
  error?: string;
  connect: () => void;
  disconnect: () => void;
  joinBattle: (battleId: string, teamId?: string) => void;
  leaveBattle: (battleId: string) => void;
  useMove: (moveId: number, pokemonIndex: number) => void;
  switchPokemon: (fromIndex: number, toIndex: number) => void;
  sendChatMessage: (message: string) => void;
}

export function useBattleSocket({ autoConnect = true }: UseBattleSocketProps = {}): UseBattleSocketReturn {
  const [state, setState] = useState<BattleSocketState>(battleSocket.getState());

  // Conectar al WebSocket
  const connect = useCallback(() => {
    battleSocket.connect();
  }, []);

  // Desconectar del WebSocket
  const disconnect = useCallback(() => {
    battleSocket.disconnect();
  }, []);

  // Unirse a una batalla
  const joinBattle = useCallback((battleId: string, teamId?: string) => {
    try {
      battleSocket.joinBattle(battleId, teamId);
    } catch (error) {
      console.error('Error joining battle:', error);
    }
  }, []);

  // Abandonar una batalla
  const leaveBattle = useCallback((battleId: string) => {
    try {
      battleSocket.leaveBattle(battleId);
    } catch (error) {
      console.error('Error leaving battle:', error);
    }
  }, []);

  // Usar un movimiento
  const useMove = useCallback((moveId: number, pokemonIndex: number) => {
    try {
      battleSocket.useMove(moveId, pokemonIndex);
    } catch (error) {
      console.error('Error using move:', error);
    }
  }, []);

  // Cambiar de Pokémon
  const switchPokemon = useCallback((fromIndex: number, toIndex: number) => {
    try {
      battleSocket.switchPokemon(fromIndex, toIndex);
    } catch (error) {
      console.error('Error switching Pokemon:', error);
    }
  }, []);

  // Enviar mensaje de chat
  const sendChatMessage = useCallback((message: string) => {
    try {
      battleSocket.sendChatMessage(message);
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  }, []);

  // Actualizar el estado cuando cambia el estado del socket
  useEffect(() => {
    const handleStateChange = () => {
      setState(battleSocket.getState());
    };

    // Suscribirse a todos los eventos relevantes
    battleSocket.subscribe(BattleSocketEvent.CONNECT, handleStateChange);
    battleSocket.subscribe(BattleSocketEvent.DISCONNECT, handleStateChange);
    battleSocket.subscribe(BattleSocketEvent.BATTLE_START, handleStateChange);
    battleSocket.subscribe(BattleSocketEvent.BATTLE_END, handleStateChange);
    battleSocket.subscribe(BattleSocketEvent.BATTLE_UPDATE, handleStateChange);
    battleSocket.subscribe(BattleSocketEvent.BATTLE_ERROR, handleStateChange);

    // Conectar automáticamente si es necesario
    if (autoConnect) {
      connect();
    }

    // Limpiar suscripciones al desmontar
    return () => {
      battleSocket.unsubscribe(BattleSocketEvent.CONNECT, handleStateChange);
      battleSocket.unsubscribe(BattleSocketEvent.DISCONNECT, handleStateChange);
      battleSocket.unsubscribe(BattleSocketEvent.BATTLE_START, handleStateChange);
      battleSocket.unsubscribe(BattleSocketEvent.BATTLE_END, handleStateChange);
      battleSocket.unsubscribe(BattleSocketEvent.BATTLE_UPDATE, handleStateChange);
      battleSocket.unsubscribe(BattleSocketEvent.BATTLE_ERROR, handleStateChange);
    };
  }, [autoConnect, connect]);

  return {
    ...state,
    connect,
    disconnect,
    joinBattle,
    leaveBattle,
    useMove,
    switchPokemon,
    sendChatMessage,
  };
} 