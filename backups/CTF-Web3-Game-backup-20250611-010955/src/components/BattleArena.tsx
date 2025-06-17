import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, 
  Users, 
  Trophy, 
  Clock, 
  Zap,
  Search,
  Plus,
  Shield,
  Target
} from 'lucide-react';
import { Trainer, Battle, BattleState } from '../types/pokemon';
import { usePokemonProgram } from '../hooks/usePokemonProgram';
import { PublicKey } from '@solana/web3.js';
import LoadingSpinner from './LoadingSpinner';

interface BattleArenaProps {
  trainer: Trainer;
}

export default function BattleArena({ trainer }: BattleArenaProps) {
  const { battles, challengeTrainer, acceptBattle, loading } = usePokemonProgram();
  const [activeTab, setActiveTab] = useState<'lobby' | 'active' | 'history'>('lobby');
  const [opponentAddress, setOpponentAddress] = useState('');
  const [wager, setWager] = useState(100);
  const [showChallengeForm, setShowChallengeForm] = useState(false);

  const tabs = [
    { id: 'lobby', label: 'Battle Lobby', icon: Users },
    { id: 'active', label: 'Active Battles', icon: Sword },
    { id: 'history', label: 'Battle History', icon: Trophy },
  ];

  const handleChallenge = async () => {
    if (!opponentAddress.trim() || wager < 0) return;

    try {
      const opponentKey = new PublicKey(opponentAddress);
      await challengeTrainer(opponentKey, wager);
      setShowChallengeForm(false);
      setOpponentAddress('');
      setWager(100);
    } catch (error) {
      console.error('Failed to create challenge:', error);
    }
  };

  const mockOpponents = [
    {
      username: 'AshKetchum',
      level: 15,
      winRate: 75,
      pokemonCount: 6,
      badges: 3,
      address: 'ASH1kEtChUm1111111111111111111111111111111'
    },
    {
      username: 'TeamRocket',
      level: 8,
      winRate: 45,
      pokemonCount: 4,
      badges: 1,
      address: 'TEAM2oCkEt2222222222222222222222222222222'
    },
    {
      username: 'BrockTrainer',
      level: 20,
      winRate: 88,
      pokemonCount: 8,
      badges: 5,
      address: 'BROCK3aiNeR3333333333333333333333333333333'
    },
    {
      username: 'MistyWater',
      level: 18,
      winRate: 82,
      pokemonCount: 7,
      badges: 4,
      address: 'MISTY4ateR4444444444444444444444444444444'
    }
  ];

  const playerBattles = battles.filter(battle => 
    battle.challenger.equals(trainer.publicKey) || 
    battle.opponent.equals(trainer.publicKey)
  );

  const activeBattles = playerBattles.filter(battle => 
    battle.state === BattleState.Active || battle.state === BattleState.Challenged
  );

  const completedBattles = playerBattles.filter(battle => 
    battle.state === BattleState.Finished
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Battle Arena</h2>
          <p className="text-gray-300">Challenge trainers and prove your worth in battle</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChallengeForm(true)}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Challenge Trainer</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-300">Wins</p>
              <p className="text-2xl font-bold text-white">{trainer.battlesWon}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-sm text-gray-300">Losses</p>
              <p className="text-2xl font-bold text-white">{trainer.battlesLost}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-300">Win Rate</p>
              <p className="text-2xl font-bold text-white">
                {trainer.battlesWon + trainer.battlesLost > 0 
                  ? Math.round((trainer.battlesWon / (trainer.battlesWon + trainer.battlesLost)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <Sword className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-300">Active</p>
              <p className="text-2xl font-bold text-white">{activeBattles.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Available Trainers</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trainers..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockOpponents.map((opponent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">{opponent.username}</h4>
                      <p className="text-sm text-gray-300">Level {opponent.level} Trainer</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs bg-white/10 rounded-full px-2 py-1">
                      <Trophy className="w-3 h-3 text-yellow-400" />
                      <span className="text-white">{opponent.winRate}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Pokémon</p>
                      <p className="text-white font-medium">{opponent.pokemonCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Badges</p>
                      <p className="text-white font-medium">{opponent.badges}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOpponentAddress(opponent.address);
                      setShowChallengeForm(true);
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2 rounded-lg transition-all duration-200"
                  >
                    Challenge
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeBattles.length === 0 ? (
              <div className="text-center py-12">
                <Sword className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Active Battles</h3>
                <p className="text-gray-400 mb-6">Challenge other trainers to start battling</p>
                <button
                  onClick={() => setShowChallengeForm(true)}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl"
                >
                  Find Opponents
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBattles.map((battle, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">
                          Battle #{battle.id}
                        </h4>
                        <p className="text-gray-300">
                          {battle.state === BattleState.Challenged ? 'Challenge Pending' : 'In Progress'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Wager</p>
                        <p className="text-lg font-bold text-yellow-400">{battle.wager} PC</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {completedBattles.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Battle History</h3>
                <p className="text-gray-400">Your completed battles will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedBattles.map((battle, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">
                          Battle #{battle.id}
                        </h4>
                        <p className="text-gray-300">Completed Battle</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Result</p>
                        <p className="text-lg font-bold text-green-400">Victory</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Form Modal */}
      <AnimatePresence>
        {showChallengeForm && (
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
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Challenge Trainer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Opponent Address
                  </label>
                  <input
                    type="text"
                    value={opponentAddress}
                    onChange={(e) => setOpponentAddress(e.target.value)}
                    placeholder="Enter trainer's wallet address"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wager (PokéCoins)
                  </label>
                  <input
                    type="number"
                    value={wager}
                    onChange={(e) => setWager(parseInt(e.target.value) || 0)}
                    min="0"
                    max={trainer.pokeCoins}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Available: {trainer.pokeCoins.toLocaleString()} PC
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowChallengeForm(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChallenge}
                    disabled={!opponentAddress.trim() || wager < 0 || loading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Sword className="w-4 h-4" />
                        <span>Send Challenge</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}