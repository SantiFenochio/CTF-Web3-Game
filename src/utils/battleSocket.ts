import { io, Socket } from 'socket.io-client';
import { Pokemon, BattleLog } from '../types/pokemon';

// Tipos de eventos de batalla
export enum BattleSocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_BATTLE = 'join_battle',
  LEAVE_BATTLE = 'leave_battle',
  BATTLE_START = 'battle_start',
  BATTLE_END = 'battle_end',
  TURN_START = 'turn_start',
  USE_MOVE = 'use_move',
  SWITCH_POKEMON = 'switch_pokemon',
  BATTLE_UPDATE = 'battle_update',
  BATTLE_ERROR = 'battle_error',
  CHAT_MESSAGE = 'chat_message',
}

// Tipos de mensajes
export interface BattleSocketMessage {
  type: BattleSocketEvent;
  battleId?: string;
  data?: any;
  timestamp: number;
}

// Estado de la conexión
export interface BattleSocketState {
  connected: boolean;
  battleId?: string;
  isInBattle: boolean;
  playerTeam?: Pokemon[];
  opponentTeam?: Pokemon[];
  battleLogs: BattleLog[];
  error?: string;
}

// Clase para manejar la conexión WebSocket
export class BattleSocketService {
  private socket: Socket | null = null;
  private state: BattleSocketState = {
    connected: false,
    isInBattle: false,
    battleLogs: [],
  };
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  // Inicializar la conexión
  connect() {
    if (this.socket) return;

    // Conectar al servidor WebSocket
    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Configurar listeners básicos
    this.socket.on(BattleSocketEvent.CONNECT, () => {
      this.state.connected = true;
      this.notifyListeners(BattleSocketEvent.CONNECT, null);
    });

    this.socket.on(BattleSocketEvent.DISCONNECT, () => {
      this.state.connected = false;
      this.notifyListeners(BattleSocketEvent.DISCONNECT, null);
    });

    // Configurar listeners de batalla
    this.socket.on(BattleSocketEvent.BATTLE_START, (data) => {
      this.state.isInBattle = true;
      this.state.battleId = data.battleId;
      this.state.playerTeam = data.playerTeam;
      this.state.opponentTeam = data.opponentTeam;
      this.state.battleLogs = data.logs || [];
      this.notifyListeners(BattleSocketEvent.BATTLE_START, data);
    });

    this.socket.on(BattleSocketEvent.BATTLE_END, (data) => {
      this.state.isInBattle = false;
      this.notifyListeners(BattleSocketEvent.BATTLE_END, data);
    });

    this.socket.on(BattleSocketEvent.BATTLE_UPDATE, (data) => {
      // Actualizar logs
      if (data.logs) {
        this.state.battleLogs = [...this.state.battleLogs, ...data.logs];
      }
      
      // Actualizar estado de Pokémon
      if (data.playerTeam) {
        this.state.playerTeam = data.playerTeam;
      }
      
      if (data.opponentTeam) {
        this.state.opponentTeam = data.opponentTeam;
      }
      
      this.notifyListeners(BattleSocketEvent.BATTLE_UPDATE, data);
    });

    this.socket.on(BattleSocketEvent.BATTLE_ERROR, (data) => {
      this.state.error = data.message;
      this.notifyListeners(BattleSocketEvent.BATTLE_ERROR, data);
    });

    this.socket.on(BattleSocketEvent.CHAT_MESSAGE, (data) => {
      this.notifyListeners(BattleSocketEvent.CHAT_MESSAGE, data);
    });
  }

  // Desconectar
  disconnect() {
    if (!this.socket) return;
    
    this.socket.disconnect();
    this.socket = null;
    this.state = {
      connected: false,
      isInBattle: false,
      battleLogs: [],
    };
  }

  // Unirse a una batalla
  joinBattle(battleId: string, teamId?: string) {
    if (!this.socket || !this.state.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit(BattleSocketEvent.JOIN_BATTLE, {
      battleId,
      teamId,
      timestamp: Date.now(),
    });
  }

  // Abandonar una batalla
  leaveBattle(battleId: string) {
    if (!this.socket || !this.state.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit(BattleSocketEvent.LEAVE_BATTLE, {
      battleId,
      timestamp: Date.now(),
    });
    
    this.state.isInBattle = false;
    this.state.battleId = undefined;
  }

  // Usar un movimiento
  useMove(moveId: number, pokemonIndex: number) {
    if (!this.socket || !this.state.connected || !this.state.isInBattle) {
      throw new Error('Not in a battle');
    }
    
    this.socket.emit(BattleSocketEvent.USE_MOVE, {
      battleId: this.state.battleId,
      moveId,
      pokemonIndex,
      timestamp: Date.now(),
    });
  }

  // Cambiar de Pokémon
  switchPokemon(fromIndex: number, toIndex: number) {
    if (!this.socket || !this.state.connected || !this.state.isInBattle) {
      throw new Error('Not in a battle');
    }
    
    this.socket.emit(BattleSocketEvent.SWITCH_POKEMON, {
      battleId: this.state.battleId,
      fromIndex,
      toIndex,
      timestamp: Date.now(),
    });
  }

  // Enviar mensaje de chat
  sendChatMessage(message: string) {
    if (!this.socket || !this.state.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit(BattleSocketEvent.CHAT_MESSAGE, {
      battleId: this.state.battleId,
      message,
      timestamp: Date.now(),
    });
  }

  // Suscribirse a eventos
  subscribe(event: BattleSocketEvent, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
  }

  // Cancelar suscripción
  unsubscribe(event: BattleSocketEvent, callback: (data: any) => void) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      this.listeners.set(event, callbacks);
    }
  }

  // Notificar a los suscriptores
  private notifyListeners(event: BattleSocketEvent, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Obtener el estado actual
  getState(): BattleSocketState {
    return { ...this.state };
  }
}

// Instancia singleton
export const battleSocket = new BattleSocketService();

export default battleSocket; 