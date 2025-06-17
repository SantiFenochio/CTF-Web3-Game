import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { 
  WalletContextType, 
  GameTransaction, 
  PlayerAccount,
  NetworkType,
  TokenReward,
  FlagNFT 
} from '@/types/web3';

interface WalletStore {
  // Connection State
  connection: Connection | null;
  provider: AnchorProvider | null;
  program: Program | null;
  network: NetworkType;
  
  // Wallet State
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  balance: number;
  tokenBalance: number;
  
  // Player Account
  playerAccount: PlayerAccount | null;
  
  // Transactions
  transactions: GameTransaction[];
  pendingTransactions: GameTransaction[];
  
  // Rewards & NFTs
  totalRewards: number;
  tokenRewards: TokenReward[];
  ownedNFTs: FlagNFT[];
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setConnection: (connection: Connection) => void;
  setProvider: (provider: AnchorProvider) => void;
  setProgram: (program: Program) => void;
  setNetwork: (network: NetworkType) => void;
  
  // Account Management
  createPlayerAccount: (username: string) => Promise<void>;
  updatePlayerAccount: (updates: Partial<PlayerAccount>) => Promise<void>;
  loadPlayerAccount: () => Promise<void>;
  
  // Transactions
  sendTransaction: (transaction: Transaction) => Promise<string>;
  addTransaction: (transaction: GameTransaction) => void;
  updateTransactionStatus: (signature: string, status: GameTransaction['status']) => void;
  
  // Game Transactions
  joinGameTransaction: (gameId: PublicKey, entryFee: number) => Promise<string>;
  endGameTransaction: (gameId: PublicKey) => Promise<string>;
  captureRewardTransaction: (amount: number, reason: TokenReward['reason']) => Promise<string>;
  
  // NFT Management
  mintFlagNFT: (flagData: Partial<FlagNFT>) => Promise<string>;
  loadOwnedNFTs: () => Promise<void>;
  transferNFT: (mint: PublicKey, recipient: PublicKey) => Promise<string>;
  
  // Token Management
  refreshBalances: () => Promise<void>;
  claimRewards: () => Promise<void>;
  
  // Utils
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  connection: null,
  provider: null,
  program: null,
  network: 'devnet' as NetworkType,
  publicKey: null,
  connected: false,
  connecting: false,
  balance: 0,
  tokenBalance: 0,
  playerAccount: null,
  transactions: [],
  pendingTransactions: [],
  totalRewards: 0,
  tokenRewards: [],
  ownedNFTs: [],
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Connection Actions
        connectWallet: async () => {
          set({ connecting: true, error: null });
          try {
            // TODO: Implement actual wallet connection
            // This would use @solana/wallet-adapter
            console.log('Connecting wallet...');
            
            // Mock connection
            const mockPublicKey = new PublicKey('11111111111111111111111111111111');
            
            set({
              publicKey: mockPublicKey,
              connected: true,
              connecting: false,
              balance: 1.5, // Mock SOL balance
              tokenBalance: 1000, // Mock token balance
            });

            // Load player account after connection
            await get().loadPlayerAccount();
            
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to connect wallet',
              connecting: false,
            });
          }
        },

        disconnectWallet: () => {
          set({
            publicKey: null,
            connected: false,
            connecting: false,
            balance: 0,
            tokenBalance: 0,
            playerAccount: null,
            transactions: [],
            pendingTransactions: [],
            tokenRewards: [],
            ownedNFTs: [],
          });
        },

        setConnection: (connection) => set({ connection }),
        setProvider: (provider) => set({ provider }),
        setProgram: (program) => set({ program }),
        setNetwork: (network) => set({ network }),

        // Account Management
        createPlayerAccount: async (username: string) => {
          set({ isLoading: true, error: null });
          try {
            const state = get();
            if (!state.publicKey) {
              throw new Error('Wallet not connected');
            }

            // TODO: Call Solana program to create player account
            console.log(`Creating player account for ${username}`);

            const mockPlayerAccount: PlayerAccount = {
              publicKey: state.publicKey,
              username,
              gamesPlayed: 0,
              gamesWon: 0,
              totalScore: 0,
              tokensEarned: 0,
              flagsCaptured: 0,
              nftsOwned: [],
              createdAt: Date.now(),
              lastActive: Date.now(),
            };

            set({
              playerAccount: mockPlayerAccount,
              isLoading: false,
            });

          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to create player account',
              isLoading: false,
            });
          }
        },

        updatePlayerAccount: async (updates: Partial<PlayerAccount>) => {
          const state = get();
          if (!state.playerAccount) return;

          try {
            // TODO: Call Solana program to update account
            const updatedAccount = { ...state.playerAccount, ...updates };
            set({ playerAccount: updatedAccount });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update player account',
            });
          }
        },

        loadPlayerAccount: async () => {
          set({ isLoading: true });
          try {
            const state = get();
            if (!state.publicKey) {
              set({ isLoading: false });
              return;
            }

            // TODO: Load from Solana program
            // For now, we'll simulate loading an existing account
            console.log('Loading player account...');
            
            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load player account',
              isLoading: false,
            });
          }
        },

        // Transaction Management
        sendTransaction: async (transaction: Transaction) => {
          const state = get();
          if (!state.connection || !state.publicKey) {
            throw new Error('Wallet not connected');
          }

          try {
            // TODO: Implement actual transaction sending
            console.log('Sending transaction...');
            
            // Mock transaction signature
            const signature = `mock_signature_${Date.now()}`;
            
            return signature;
          } catch (error) {
            throw error;
          }
        },

        addTransaction: (transaction: GameTransaction) => {
          const state = get();
          set({
            transactions: [...state.transactions, transaction],
            pendingTransactions: transaction.status === 'pending' 
              ? [...state.pendingTransactions, transaction]
              : state.pendingTransactions,
          });
        },

        updateTransactionStatus: (signature: string, status: GameTransaction['status']) => {
          const state = get();
          const updatedTransactions = state.transactions.map(tx =>
            tx.signature === signature ? { ...tx, status } : tx
          );
          
          const updatedPending = state.pendingTransactions.filter(tx =>
            tx.signature !== signature || status === 'pending'
          );

          set({
            transactions: updatedTransactions,
            pendingTransactions: updatedPending,
          });
        },

        // Game Transactions
        joinGameTransaction: async (gameId: PublicKey, entryFee: number) => {
          try {
            // TODO: Create and send join game transaction
            console.log(`Joining game ${gameId.toString()} with fee ${entryFee}`);
            
            const transaction: GameTransaction = {
              signature: `join_${Date.now()}`,
              type: 'join_game',
              amount: entryFee,
              status: 'pending',
              timestamp: Date.now(),
              gameId,
            };

            get().addTransaction(transaction);
            
            // Mock transaction processing
            setTimeout(() => {
              get().updateTransactionStatus(transaction.signature, 'confirmed');
            }, 2000);

            return transaction.signature;
          } catch (error) {
            throw error;
          }
        },

        endGameTransaction: async (gameId: PublicKey) => {
          try {
            // TODO: Create and send end game transaction
            console.log(`Ending game ${gameId.toString()}`);
            
            const transaction: GameTransaction = {
              signature: `end_${Date.now()}`,
              type: 'end_game',
              status: 'pending',
              timestamp: Date.now(),
              gameId,
            };

            get().addTransaction(transaction);
            return transaction.signature;
          } catch (error) {
            throw error;
          }
        },

        captureRewardTransaction: async (amount: number, reason: TokenReward['reason']) => {
          try {
            console.log(`Claiming reward: ${amount} tokens for ${reason}`);
            
            const transaction: GameTransaction = {
              signature: `reward_${Date.now()}`,
              type: 'claim_reward',
              amount,
              status: 'pending',
              timestamp: Date.now(),
            };

            get().addTransaction(transaction);

            const reward: TokenReward = {
              amount,
              reason,
              transaction: transaction.signature,
              timestamp: Date.now(),
            };

            const state = get();
            set({
              tokenRewards: [...state.tokenRewards, reward],
              totalRewards: state.totalRewards + amount,
              tokenBalance: state.tokenBalance + amount,
            });

            return transaction.signature;
          } catch (error) {
            throw error;
          }
        },

        // NFT Management
        mintFlagNFT: async (flagData: Partial<FlagNFT>) => {
          try {
            console.log('Minting flag NFT...', flagData);
            
            const transaction: GameTransaction = {
              signature: `mint_${Date.now()}`,
              type: 'mint_flag',
              status: 'pending',
              timestamp: Date.now(),
            };

            get().addTransaction(transaction);

            // Mock NFT creation
            const mockNFT: FlagNFT = {
              mint: new PublicKey('11111111111111111111111111111111'),
              metadata: new PublicKey('22222222222222222222222222222222'),
              image: flagData.image || '',
              capturedBy: get().publicKey!,
              capturedAt: Date.now(),
              gameId: flagData.gameId || new PublicKey('33333333333333333333333333333333'),
              team: flagData.team || 0,
              attributes: {
                rarity: 'common',
                generationPrompt: 'AI generated flag',
                captureTime: new Date().toISOString(),
                winningGame: false,
              },
            };

            const state = get();
            set({
              ownedNFTs: [...state.ownedNFTs, mockNFT],
            });

            return transaction.signature;
          } catch (error) {
            throw error;
          }
        },

        loadOwnedNFTs: async () => {
          set({ isLoading: true });
          try {
            // TODO: Load NFTs from Solana
            console.log('Loading owned NFTs...');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load NFTs',
              isLoading: false,
            });
          }
        },

        transferNFT: async (mint: PublicKey, recipient: PublicKey) => {
          try {
            console.log(`Transferring NFT ${mint.toString()} to ${recipient.toString()}`);
            
            // TODO: Implement NFT transfer
            return `transfer_${Date.now()}`;
          } catch (error) {
            throw error;
          }
        },

        // Token Management
        refreshBalances: async () => {
          try {
            const state = get();
            if (!state.connection || !state.publicKey) return;

            // TODO: Fetch actual balances from Solana
            console.log('Refreshing balances...');
            
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to refresh balances',
            });
          }
        },

        claimRewards: async () => {
          try {
            // TODO: Claim pending rewards
            console.log('Claiming pending rewards...');
            
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to claim rewards',
            });
          }
        },

        // Utils
        setError: (error) => set({ error }),
        setLoading: (loading) => set({ isLoading: loading }),
        reset: () => set(initialState),
      }),
      {
        name: 'ctf-wallet-store',
        partialize: (state) => ({
          network: state.network,
          transactions: state.transactions,
          tokenRewards: state.tokenRewards,
        }),
      }
    ),
    {
      name: 'ctf-wallet-store',
    }
  )
); 