import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  GameSession, 
  Player, 
  Team, 
  GameState, 
  GameMap, 
  Flag, 
  ChatMessage,
  Vector3D,
  GameAction,
  AIFlagGeneration
} from '@/types/game';
import { PublicKey } from '@solana/web3.js';

interface GameStore {
  // Game Session State
  currentGame: GameSession | null;
  currentPlayer: Player | null;
  isInGame: boolean;
  isLoading: boolean;
  error: string | null;

  // Real-time Game State
  gameState: GameState;
  players: Player[];
  redFlag: Flag;
  blueFlag: Flag;
  chatMessages: ChatMessage[];
  
  // Player State
  playerPosition: Vector3D;
  playerHealth: number;
  playerScore: number;
  playerTeam: Team;
  
  // UI State
  showChat: boolean;
  showLeaderboard: boolean;
  showInventory: boolean;
  showSettings: boolean;
  
  // AI Flag Generation
  flagGeneration: AIFlagGeneration | null;
  
  // Map State
  currentMap: GameMap | null;
  availableMaps: GameMap[];
  
  // Actions
  setCurrentGame: (game: GameSession | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setGameState: (state: GameState) => void;
  setPlayerPosition: (position: Vector3D) => void;
  setPlayerTeam: (team: Team) => void;
  
  // Game Actions
  joinGame: (gameId: string, team: Team) => Promise<void>;
  leaveGame: () => void;
  updatePlayerState: (updates: Partial<Player>) => void;
  
  // Flag Actions
  captureFlag: (flagTeam: Team) => void;
  dropFlag: (flagTeam: Team) => void;
  returnFlag: (flagTeam: Team) => void;
  
  // Chat Actions
  sendMessage: (message: string, isTeamOnly: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  // UI Actions
  toggleChat: () => void;
  toggleLeaderboard: () => void;
  toggleInventory: () => void;
  toggleSettings: () => void;
  
  // Error Handling
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // AI Flag Generation
  generateFlag: (prompt: string, team: Team, style: string) => Promise<void>;
  setFlagGeneration: (generation: AIFlagGeneration | null) => void;
  
  // Map Actions
  setCurrentMap: (map: GameMap | null) => void;
  loadAvailableMaps: () => Promise<void>;
  
  // Game Events
  handleGameAction: (action: GameAction) => void;
  resetGameState: () => void;
}

const initialState = {
  currentGame: null,
  currentPlayer: null,
  isInGame: false,
  isLoading: false,
  error: null,
  gameState: GameState.WAITING,
  players: [],
  redFlag: {
    team: Team.RED,
    position: { x: 0, y: 0, z: 0 },
    isAtBase: true,
  },
  blueFlag: {
    team: Team.BLUE,
    position: { x: 0, y: 0, z: 0 },
    isAtBase: true,
  },
  chatMessages: [],
  playerPosition: { x: 0, y: 0, z: 0 },
  playerHealth: 100,
  playerScore: 0,
  playerTeam: Team.SPECTATOR,
  showChat: false,
  showLeaderboard: false,
  showInventory: false,
  showSettings: false,
  flagGeneration: null,
  currentMap: null,
  availableMaps: [],
};

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Setters
        setCurrentGame: (game) => set({ currentGame: game }),
        setCurrentPlayer: (player) => set({ currentPlayer: player }),
        setGameState: (state) => set({ gameState: state }),
        setPlayerPosition: (position) => set({ playerPosition: position }),
        setPlayerTeam: (team) => set({ playerTeam: team }),

        // Game Actions
        joinGame: async (gameId: string, team: Team) => {
          set({ isLoading: true, error: null });
          try {
            // TODO: Implement actual game joining logic
            // This would involve calling the Solana program
            console.log(`Joining game ${gameId} as ${team}`);
            
            // Mock implementation
            const mockPlayer: Player = {
              id: `player_${Date.now()}`,
              publicKey: new PublicKey('11111111111111111111111111111111'),
              username: 'Player',
              team,
              position: { x: 0, y: 0, z: 0 },
              health: 100,
              maxHealth: 100,
              score: 0,
              kills: 0,
              deaths: 0,
              flagCaptures: 0,
              isAlive: true,
              inventory: [],
            };
            
            set({ 
              currentPlayer: mockPlayer,
              playerTeam: team,
              isInGame: true,
              isLoading: false 
            });
            
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to join game',
              isLoading: false 
            });
          }
        },

        leaveGame: () => {
          set({
            currentGame: null,
            currentPlayer: null,
            isInGame: false,
            gameState: GameState.WAITING,
            players: [],
            chatMessages: [],
            playerTeam: Team.SPECTATOR,
          });
        },

        updatePlayerState: (updates) => {
          const currentPlayer = get().currentPlayer;
          if (currentPlayer) {
            set({
              currentPlayer: { ...currentPlayer, ...updates }
            });
          }
        },

        // Flag Actions
        captureFlag: (flagTeam: Team) => {
          const state = get();
          if (flagTeam === Team.RED) {
            set({
              redFlag: {
                ...state.redFlag,
                isAtBase: false,
                carriedBy: state.currentPlayer?.id,
              }
            });
          } else {
            set({
              blueFlag: {
                ...state.blueFlag,
                isAtBase: false,
                carriedBy: state.currentPlayer?.id,
              }
            });
          }
        },

        dropFlag: (flagTeam: Team) => {
          const state = get();
          if (flagTeam === Team.RED) {
            set({
              redFlag: {
                ...state.redFlag,
                carriedBy: undefined,
                position: state.playerPosition,
              }
            });
          } else {
            set({
              blueFlag: {
                ...state.blueFlag,
                carriedBy: undefined,
                position: state.playerPosition,
              }
            });
          }
        },

        returnFlag: (flagTeam: Team) => {
          const state = get();
          if (flagTeam === Team.RED) {
            set({
              redFlag: {
                ...state.redFlag,
                isAtBase: true,
                carriedBy: undefined,
                position: state.currentMap?.redFlag || { x: 0, y: 0, z: 0 },
              }
            });
          } else {
            set({
              blueFlag: {
                ...state.blueFlag,
                isAtBase: true,
                carriedBy: undefined,
                position: state.currentMap?.blueFlag || { x: 0, y: 0, z: 0 },
              }
            });
          }
        },

        // Chat Actions
        sendMessage: (message: string, isTeamOnly: boolean) => {
          const state = get();
          if (!state.currentPlayer) return;

          const chatMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            playerId: state.currentPlayer.id,
            playerName: state.currentPlayer.username,
            team: state.currentPlayer.team,
            message,
            timestamp: new Date(),
            isTeamOnly,
          };

          set({
            chatMessages: [...state.chatMessages, chatMessage]
          });
        },

        addChatMessage: (message: ChatMessage) => {
          const state = get();
          set({
            chatMessages: [...state.chatMessages, message]
          });
        },

        clearChat: () => set({ chatMessages: [] }),

        // UI Actions
        toggleChat: () => set((state) => ({ showChat: !state.showChat })),
        toggleLeaderboard: () => set((state) => ({ showLeaderboard: !state.showLeaderboard })),
        toggleInventory: () => set((state) => ({ showInventory: !state.showInventory })),
        toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),

        // Error Handling
        setError: (error) => set({ error }),
        setLoading: (loading) => set({ isLoading: loading }),

        // AI Flag Generation
        generateFlag: async (prompt: string, team: Team, style: string) => {
          set({
            flagGeneration: {
              prompt,
              team,
              style: style as any,
              colors: team === Team.RED ? ['#dc2626', '#ffffff'] : ['#2563eb', '#ffffff'],
              isGenerating: true,
              error: undefined,
            }
          });

          try {
            // TODO: Implement actual OpenAI API call
            const response = await fetch('/api/generate-flag', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt, team, style }),
            });

            if (!response.ok) {
              throw new Error('Failed to generate flag');
            }

            const data = await response.json();
            
            set({
              flagGeneration: {
                ...get().flagGeneration!,
                imageUrl: data.imageUrl,
                isGenerating: false,
              }
            });

          } catch (error) {
            set({
              flagGeneration: {
                ...get().flagGeneration!,
                isGenerating: false,
                error: error instanceof Error ? error.message : 'Failed to generate flag',
              }
            });
          }
        },

        setFlagGeneration: (generation) => set({ flagGeneration: generation }),

        // Map Actions
        setCurrentMap: (map) => set({ currentMap: map }),

        loadAvailableMaps: async () => {
          set({ isLoading: true });
          try {
            // TODO: Load maps from server/IPFS
            const mockMaps: GameMap[] = [
              {
                id: 'classic_desert',
                name: 'Classic Desert',
                description: 'A classic desert map with two bases',
                thumbnail: '/images/maps/classic_desert.jpg',
                bounds: {
                  min: { x: -100, y: 0, z: -100 },
                  max: { x: 100, y: 50, z: 100 }
                },
                redBase: { x: -80, y: 5, z: 0 },
                blueBase: { x: 80, y: 5, z: 0 },
                redFlag: { x: -80, y: 5, z: 0 },
                blueFlag: { x: 80, y: 5, z: 0 },
                spawnPoints: {
                  red: [
                    { x: -70, y: 5, z: -10 },
                    { x: -70, y: 5, z: 10 },
                  ],
                  blue: [
                    { x: 70, y: 5, z: -10 },
                    { x: 70, y: 5, z: 10 },
                  ]
                },
                treasureChests: [],
                barriers: [],
                obstacles: [],
              }
            ];
            
            set({ availableMaps: mockMaps, isLoading: false });
          } catch (error) {
            set({ 
              error: 'Failed to load maps',
              isLoading: false 
            });
          }
        },

        // Game Events
        handleGameAction: (action: GameAction) => {
          console.log('Handling game action:', action);
          // TODO: Implement action handling based on action type
        },

        resetGameState: () => set(initialState),
      }),
      {
        name: 'ctf-game-store',
        partialize: (state) => ({
          playerTeam: state.playerTeam,
          showChat: state.showChat,
          showLeaderboard: state.showLeaderboard,
          showInventory: state.showInventory,
          showSettings: state.showSettings,
        }),
      }
    ),
    {
      name: 'ctf-game-store',
    }
  )
); 