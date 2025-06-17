const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

// Crear servidor HTTP
const server = http.createServer();

// Inicializar Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Almacenamiento en memoria para las batallas activas
const activeBattles = new Map();
const waitingPlayers = new Map();
const playerSockets = new Map();

// Tipos de eventos de batalla
const BattleSocketEvent = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_BATTLE: 'join_battle',
  LEAVE_BATTLE: 'leave_battle',
  BATTLE_START: 'battle_start',
  BATTLE_END: 'battle_end',
  TURN_START: 'turn_start',
  USE_MOVE: 'use_move',
  SWITCH_POKEMON: 'switch_pokemon',
  BATTLE_UPDATE: 'battle_update',
  BATTLE_ERROR: 'battle_error',
  CHAT_MESSAGE: 'chat_message',
};

// Clase para manejar la lógica de batalla
class BattleManager {
  constructor(battleId, player1Socket, player2Socket, player1Team, player2Team) {
    this.battleId = battleId;
    this.player1Socket = player1Socket;
    this.player2Socket = player2Socket;
    this.player1Id = player1Socket.id;
    this.player2Id = player2Socket.id;
    
    // Inicializar equipos con HP actual
    this.player1Team = player1Team.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp
    }));
    
    this.player2Team = player2Team.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp
    }));
    
    this.turn = 1;
    this.currentPlayer = Math.random() < 0.5 ? this.player1Id : this.player2Id;
    this.battleLogs = [];
    this.isActive = true;
    
    // Unir sockets a la sala de batalla
    player1Socket.join(battleId);
    player2Socket.join(battleId);
    
    // Inicializar la batalla
    this.startBattle();
  }
  
  // Iniciar la batalla
  startBattle() {
    // Crear logs iniciales
    this.addBattleLog({
      type: 'move',
      message: `¡Batalla entre ${this.player1Team[0].name} y ${this.player2Team[0].name} comenzada!`,
      timestamp: Date.now()
    });
    
    // Enviar evento de inicio de batalla a ambos jugadores
    io.to(this.battleId).emit(BattleSocketEvent.BATTLE_START, {
      battleId: this.battleId,
      playerTeam: this.player1Team,
      opponentTeam: this.player2Team,
      logs: this.battleLogs,
      currentPlayer: this.currentPlayer
    });
    
    // Iniciar el primer turno
    this.startTurn();
  }
  
  // Iniciar un nuevo turno
  startTurn() {
    io.to(this.battleId).emit(BattleSocketEvent.TURN_START, {
      turn: this.turn,
      currentPlayer: this.currentPlayer
    });
    
    this.addBattleLog({
      type: 'move',
      message: `Turno ${this.turn}: ${this.currentPlayer === this.player1Id ? 'Jugador 1' : 'Jugador 2'} debe elegir una acción.`,
      timestamp: Date.now()
    });
    
    // Actualizar estado de la batalla
    this.updateBattleState();
  }
  
  // Usar un movimiento
  useMove(playerId, moveId, pokemonIndex) {
    // Verificar si es el turno del jugador
    if (playerId !== this.currentPlayer) {
      this.sendErrorToPlayer(playerId, 'No es tu turno');
      return;
    }
    
    // Obtener datos del atacante y defensor
    const isPlayer1 = playerId === this.player1Id;
    const attackerTeam = isPlayer1 ? this.player1Team : this.player2Team;
    const defenderTeam = isPlayer1 ? this.player2Team : this.player1Team;
    
    if (pokemonIndex >= attackerTeam.length) {
      this.sendErrorToPlayer(playerId, 'Índice de Pokémon inválido');
      return;
    }
    
    const attacker = attackerTeam[pokemonIndex];
    const defender = defenderTeam[0]; // Siempre atacamos al primero (activo)
    
    // Verificar si el movimiento existe
    if (!attacker.moves.includes(moveId)) {
      this.sendErrorToPlayer(playerId, 'Movimiento inválido');
      return;
    }
    
    // Calcular daño (simplificado)
    const damage = this.calculateDamage(attacker, defender, moveId);
    
    // Registrar el movimiento
    this.addBattleLog({
      type: 'move',
      message: `${attacker.name} usó ${moveId}!`,
      player: isPlayer1 ? 'player1' : 'player2',
      pokemon: attacker.name,
      timestamp: Date.now()
    });
    
    // Aplicar daño
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    
    this.addBattleLog({
      type: 'move',
      message: `${defender.name} perdió ${damage} HP!`,
      damage: damage,
      timestamp: Date.now() + 1
    });
    
    // Verificar si el Pokémon ha sido debilitado
    if (defender.currentHp <= 0) {
      this.addBattleLog({
        type: 'faint',
        message: `${defender.name} se debilitó!`,
        player: isPlayer1 ? 'player2' : 'player1',
        pokemon: defender.name,
        timestamp: Date.now() + 2
      });
      
      // Verificar si la batalla ha terminado
      const defenderRemainingPokemon = defenderTeam.filter(p => p.currentHp > 0).length;
      
      if (defenderRemainingPokemon === 0) {
        // Fin de la batalla
        this.endBattle(isPlayer1 ? 'player1' : 'player2');
        return;
      } else {
        // Cambiar al siguiente Pokémon
        this.switchToNextPokemon(!isPlayer1);
      }
    }
    
    // Cambiar de turno
    this.switchTurn();
    
    // Actualizar estado de la batalla
    this.updateBattleState();
  }
  
  // Cambiar de Pokémon
  switchPokemon(playerId, fromIndex, toIndex) {
    // Verificar si es el turno del jugador
    if (playerId !== this.currentPlayer) {
      this.sendErrorToPlayer(playerId, 'No es tu turno');
      return;
    }
    
    const isPlayer1 = playerId === this.player1Id;
    const team = isPlayer1 ? this.player1Team : this.player2Team;
    
    // Validar índices
    if (fromIndex >= team.length || toIndex >= team.length) {
      this.sendErrorToPlayer(playerId, 'Índice de Pokémon inválido');
      return;
    }
    
    // Verificar que el Pokémon destino tenga HP
    if (team[toIndex].currentHp <= 0) {
      this.sendErrorToPlayer(playerId, 'No puedes cambiar a un Pokémon debilitado');
      return;
    }
    
    // Intercambiar posiciones
    const temp = team[0];
    team[0] = team[toIndex];
    team[toIndex] = temp;
    
    // Registrar el cambio
    this.addBattleLog({
      type: 'switch',
      message: `${isPlayer1 ? 'Jugador 1' : 'Jugador 2'} cambió a ${team[0].name}!`,
      player: isPlayer1 ? 'player1' : 'player2',
      pokemon: team[0].name,
      timestamp: Date.now()
    });
    
    // Cambiar de turno
    this.switchTurn();
    
    // Actualizar estado de la batalla
    this.updateBattleState();
  }
  
  // Cambiar al siguiente Pokémon disponible
  switchToNextPokemon(isPlayer1) {
    const team = isPlayer1 ? this.player1Team : this.player2Team;
    
    // Buscar el primer Pokémon con HP > 0
    for (let i = 1; i < team.length; i++) {
      if (team[i].currentHp > 0) {
        // Intercambiar con el primero
        const temp = team[0];
        team[0] = team[i];
        team[i] = temp;
        
        this.addBattleLog({
          type: 'switch',
          message: `${isPlayer1 ? 'Jugador 1' : 'Jugador 2'} envió a ${team[0].name}!`,
          player: isPlayer1 ? 'player1' : 'player2',
          pokemon: team[0].name,
          timestamp: Date.now()
        });
        
        return true;
      }
    }
    
    return false; // No hay más Pokémon disponibles
  }
  
  // Calcular daño (simplificado)
  calculateDamage(attacker, defender, moveId) {
    // Implementación simplificada del cálculo de daño
    const baseDamage = 20 + Math.floor(Math.random() * 10);
    const attackStat = attacker.attack;
    const defenseStat = defender.defense;
    
    let damage = Math.floor((attacker.level * 2 / 5 + 2) * baseDamage * (attackStat / defenseStat) / 50) + 2;
    
    // Variación aleatoria (85-100%)
    damage = Math.floor(damage * (85 + Math.floor(Math.random() * 16)) / 100);
    
    return Math.max(1, damage);
  }
  
  // Cambiar de turno
  switchTurn() {
    this.currentPlayer = this.currentPlayer === this.player1Id ? this.player2Id : this.player1Id;
    
    if (this.currentPlayer === this.player1Id) {
      this.turn++; // Incrementar turno cuando vuelve al primer jugador
    }
  }
  
  // Finalizar la batalla
  endBattle(winner) {
    this.isActive = false;
    
    this.addBattleLog({
      type: 'win',
      message: `${winner === 'player1' ? 'Jugador 1' : 'Jugador 2'} ganó la batalla!`,
      player: winner,
      timestamp: Date.now()
    });
    
    // Enviar evento de fin de batalla a ambos jugadores
    io.to(this.battleId).emit(BattleSocketEvent.BATTLE_END, {
      battleId: this.battleId,
      winner: winner,
      logs: this.battleLogs
    });
    
    // Eliminar la batalla de las activas
    activeBattles.delete(this.battleId);
    
    // Hacer que los jugadores abandonen la sala
    this.player1Socket.leave(this.battleId);
    this.player2Socket.leave(this.battleId);
  }
  
  // Actualizar el estado de la batalla para ambos jugadores
  updateBattleState() {
    // Enviar actualización al jugador 1
    this.player1Socket.emit(BattleSocketEvent.BATTLE_UPDATE, {
      battleId: this.battleId,
      playerTeam: this.player1Team,
      opponentTeam: this.player2Team,
      logs: this.battleLogs,
      currentPlayer: this.currentPlayer,
      turn: this.turn
    });
    
    // Enviar actualización al jugador 2 (invertir equipos)
    this.player2Socket.emit(BattleSocketEvent.BATTLE_UPDATE, {
      battleId: this.battleId,
      playerTeam: this.player2Team,
      opponentTeam: this.player1Team,
      logs: this.battleLogs,
      currentPlayer: this.currentPlayer,
      turn: this.turn
    });
  }
  
  // Añadir un log de batalla
  addBattleLog(log) {
    const battleLog = {
      id: uuidv4(),
      ...log
    };
    
    this.battleLogs.push(battleLog);
    return battleLog;
  }
  
  // Enviar error a un jugador
  sendErrorToPlayer(playerId, message) {
    const socket = playerId === this.player1Id ? this.player1Socket : this.player2Socket;
    
    socket.emit(BattleSocketEvent.BATTLE_ERROR, {
      message: message
    });
  }
  
  // Manejar mensaje de chat
  handleChatMessage(playerId, message) {
    const isPlayer1 = playerId === this.player1Id;
    
    const chatLog = this.addBattleLog({
      type: 'chat',
      message: message,
      player: isPlayer1 ? 'player1' : 'player2',
      timestamp: Date.now()
    });
    
    // Enviar mensaje a ambos jugadores
    io.to(this.battleId).emit(BattleSocketEvent.CHAT_MESSAGE, chatLog);
  }
}

// Configurar eventos de Socket.IO
io.on('connection', (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  
  // Unirse a una batalla
  socket.on(BattleSocketEvent.JOIN_BATTLE, async (data) => {
    const { battleId, teamId, timestamp } = data;
    
    // Si se proporciona un ID de batalla, intentar unirse a esa batalla
    if (battleId && battleId !== 'random') {
      const battle = activeBattles.get(battleId);
      
      if (!battle) {
        socket.emit(BattleSocketEvent.BATTLE_ERROR, {
          message: 'Batalla no encontrada'
        });
        return;
      }
      
      // Lógica para unirse a una batalla existente
      // (No implementado en este ejemplo simplificado)
    } else {
      // Crear o unirse a una batalla aleatoria
      try {
        // Obtener equipo del jugador (simulado)
        const playerTeam = generateRandomTeam();
        
        // Guardar el socket del jugador
        playerSockets.set(socket.id, socket);
        
        // Si hay un jugador esperando, crear una batalla
        if (waitingPlayers.size > 0) {
          const [waitingPlayerId, waitingPlayerData] = Array.from(waitingPlayers.entries())[0];
          const waitingPlayerSocket = playerSockets.get(waitingPlayerId);
          
          if (waitingPlayerSocket) {
            // Crear un nuevo ID de batalla
            const newBattleId = uuidv4();
            
            // Crear una nueva batalla
            const battle = new BattleManager(
              newBattleId,
              waitingPlayerSocket,
              socket,
              waitingPlayerData.team,
              playerTeam
            );
            
            // Guardar la batalla
            activeBattles.set(newBattleId, battle);
            
            // Eliminar al jugador de la lista de espera
            waitingPlayers.delete(waitingPlayerId);
            
            console.log(`Batalla creada: ${newBattleId} entre ${waitingPlayerId} y ${socket.id}`);
          } else {
            // El socket del jugador en espera ya no está disponible
            waitingPlayers.delete(waitingPlayerId);
            
            // Poner al jugador actual en espera
            waitingPlayers.set(socket.id, { team: playerTeam });
            
            socket.emit(BattleSocketEvent.BATTLE_UPDATE, {
              message: 'Esperando oponente...'
            });
          }
        } else {
          // No hay jugadores esperando, poner a este jugador en espera
          waitingPlayers.set(socket.id, { team: playerTeam });
          
          socket.emit(BattleSocketEvent.BATTLE_UPDATE, {
            message: 'Esperando oponente...'
          });
        }
      } catch (error) {
        console.error('Error al unirse a la batalla:', error);
        socket.emit(BattleSocketEvent.BATTLE_ERROR, {
          message: 'Error al unirse a la batalla'
        });
      }
    }
  });
  
  // Abandonar una batalla
  socket.on(BattleSocketEvent.LEAVE_BATTLE, (data) => {
    const { battleId } = data;
    
    // Buscar la batalla
    const battle = activeBattles.get(battleId);
    
    if (battle) {
      // Determinar el ganador (el otro jugador)
      const winner = battle.player1Id === socket.id ? 'player2' : 'player1';
      
      // Finalizar la batalla
      battle.endBattle(winner);
    }
    
    // Eliminar al jugador de la lista de espera si está ahí
    waitingPlayers.delete(socket.id);
  });
  
  // Usar un movimiento
  socket.on(BattleSocketEvent.USE_MOVE, (data) => {
    const { battleId, moveId, pokemonIndex } = data;
    
    // Buscar la batalla
    const battle = activeBattles.get(battleId);
    
    if (battle && battle.isActive) {
      battle.useMove(socket.id, moveId, pokemonIndex);
    }
  });
  
  // Cambiar de Pokémon
  socket.on(BattleSocketEvent.SWITCH_POKEMON, (data) => {
    const { battleId, fromIndex, toIndex } = data;
    
    // Buscar la batalla
    const battle = activeBattles.get(battleId);
    
    if (battle && battle.isActive) {
      battle.switchPokemon(socket.id, fromIndex, toIndex);
    }
  });
  
  // Mensaje de chat
  socket.on(BattleSocketEvent.CHAT_MESSAGE, (data) => {
    const { battleId, message } = data;
    
    // Buscar la batalla
    const battle = activeBattles.get(battleId);
    
    if (battle) {
      battle.handleChatMessage(socket.id, message);
    }
  });
  
  // Desconexión
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    
    // Buscar si el jugador estaba en alguna batalla
    for (const [battleId, battle] of activeBattles.entries()) {
      if (battle.player1Id === socket.id || battle.player2Id === socket.id) {
        // Determinar el ganador (el otro jugador)
        const winner = battle.player1Id === socket.id ? 'player2' : 'player1';
        
        // Finalizar la batalla
        battle.endBattle(winner);
        break;
      }
    }
    
    // Eliminar al jugador de la lista de espera
    waitingPlayers.delete(socket.id);
    
    // Eliminar el socket del jugador
    playerSockets.delete(socket.id);
  });
});

// Función para generar un equipo aleatorio (simulado)
function generateRandomTeam() {
  return [
    {
      name: `Pokémon ${Math.floor(Math.random() * 100)}`,
      level: 50,
      hp: 100 + Math.floor(Math.random() * 50),
      attack: 50 + Math.floor(Math.random() * 50),
      defense: 50 + Math.floor(Math.random() * 50),
      spAttack: 50 + Math.floor(Math.random() * 50),
      spDefense: 50 + Math.floor(Math.random() * 50),
      speed: 50 + Math.floor(Math.random() * 50),
      types: [Math.floor(Math.random() * 18)],
      moves: [1, 2, 3, 4],
      currentHp: 100 + Math.floor(Math.random() * 50)
    },
    {
      name: `Pokémon ${Math.floor(Math.random() * 100)}`,
      level: 50,
      hp: 100 + Math.floor(Math.random() * 50),
      attack: 50 + Math.floor(Math.random() * 50),
      defense: 50 + Math.floor(Math.random() * 50),
      spAttack: 50 + Math.floor(Math.random() * 50),
      spDefense: 50 + Math.floor(Math.random() * 50),
      speed: 50 + Math.floor(Math.random() * 50),
      types: [Math.floor(Math.random() * 18)],
      moves: [5, 6, 7, 8],
      currentHp: 100 + Math.floor(Math.random() * 50)
    },
    {
      name: `Pokémon ${Math.floor(Math.random() * 100)}`,
      level: 50,
      hp: 100 + Math.floor(Math.random() * 50),
      attack: 50 + Math.floor(Math.random() * 50),
      defense: 50 + Math.floor(Math.random() * 50),
      spAttack: 50 + Math.floor(Math.random() * 50),
      spDefense: 50 + Math.floor(Math.random() * 50),
      speed: 50 + Math.floor(Math.random() * 50),
      types: [Math.floor(Math.random() * 18)],
      moves: [9, 10, 11, 12],
      currentHp: 100 + Math.floor(Math.random() * 50)
    }
  ];
}

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor de batallas en tiempo real iniciado en el puerto ${PORT}`);
});