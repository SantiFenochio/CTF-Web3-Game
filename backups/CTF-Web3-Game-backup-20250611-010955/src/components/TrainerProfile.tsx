import { motion } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Star, 
  Zap, 
  Calendar,
  Medal,
  Target,
  TrendingUp,
  Award,
  Crown
} from 'lucide-react';
import { Trainer } from '../types/pokemon';

interface TrainerProfileProps {
  trainer: Trainer;
}

export default function TrainerProfile({ trainer }: TrainerProfileProps) {
  const totalBattles = trainer.battlesWon + trainer.battlesLost;
  const winRate = totalBattles > 0 ? Math.round((trainer.battlesWon / totalBattles) * 100) : 0;
  const expToNextLevel = (trainer.level + 1) * 1000;
  const currentLevelExp = trainer.level * 1000;
  const progressPercent = totalBattles > 0 ? ((trainer.experience - currentLevelExp) / (expToNextLevel - currentLevelExp)) * 100 : 0;

  const achievements = [
    {
      id: 1,
      name: 'First Catch',
      description: 'Caught your first Pokémon',
      icon: Star,
      unlocked: trainer.pokemonCaught > 0,
      rarity: 'common'
    },
    {
      id: 2,
      name: 'First Victory',
      description: 'Won your first battle',
      icon: Trophy,
      unlocked: trainer.battlesWon > 0,
      rarity: 'common'
    },
    {
      id: 3,
      name: 'Team Builder',
      description: 'Have 6 Pokémon in your team',
      icon: Target,
      unlocked: trainer.pokemonTeam.length >= 6,
      rarity: 'uncommon'
    },
    {
      id: 4,
      name: 'Collector',
      description: 'Catch 10 Pokémon',
      icon: Medal,
      unlocked: trainer.pokemonCaught >= 10,
      rarity: 'uncommon'
    },
    {
      id: 5,
      name: 'Rising Star',
      description: 'Reach Level 10',
      icon: TrendingUp,
      unlocked: trainer.level >= 10,
      rarity: 'rare'
    },
    {
      id: 6,
      name: 'Champion',
      description: 'Win 50 battles',
      icon: Crown,
      unlocked: trainer.battlesWon >= 50,
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const badges = [
    { name: 'Boulder Badge', type: 'Rock', unlocked: trainer.badges.includes(1) },
    { name: 'Cascade Badge', type: 'Water', unlocked: trainer.badges.includes(2) },
    { name: 'Thunder Badge', type: 'Electric', unlocked: trainer.badges.includes(3) },
    { name: 'Rainbow Badge', type: 'Grass', unlocked: trainer.badges.includes(4) },
    { name: 'Soul Badge', type: 'Poison', unlocked: trainer.badges.includes(5) },
    { name: 'Marsh Badge', type: 'Psychic', unlocked: trainer.badges.includes(6) },
    { name: 'Volcano Badge', type: 'Fire', unlocked: trainer.badges.includes(7) },
    { name: 'Earth Badge', type: 'Ground', unlocked: trainer.badges.includes(8) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{trainer.username}</h2>
            <p className="text-gray-300 mb-1">Level {trainer.level} Trainer</p>
            <p className="text-sm text-gray-400">
              Member since {new Date(trainer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-300 mb-1">PokéCoins</p>
            <p className="text-2xl font-bold text-yellow-400">{trainer.pokeCoins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Level Progress</h3>
          </div>
          <span className="text-sm text-gray-400">
            {trainer.experience.toLocaleString()} / {expToNextLevel.toLocaleString()} EXP
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Level {trainer.level}</span>
          <span>Level {trainer.level + 1}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-300">Battles Won</p>
              <p className="text-2xl font-bold text-white">{trainer.battlesWon}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-300">Win Rate</p>
              <p className="text-2xl font-bold text-white">{winRate}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-300">Pokémon Caught</p>
              <p className="text-2xl font-bold text-white">{trainer.pokemonCaught}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Medal className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-300">Badges</p>
              <p className="text-2xl font-bold text-white">{trainer.badges.length}/8</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <Medal className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Gym Badges</h3>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
                badge.unlocked 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400 shadow-lg shadow-yellow-400/30' 
                  : 'bg-gray-700 border-gray-600'
              }`}
              title={badge.name}
            >
              {badge.unlocked ? (
                <Award className="w-6 h-6 text-white" />
              ) : (
                <div className="w-6 h-6 bg-gray-500 rounded-full" />
              )}
              
              {badge.unlocked && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Achievements</h3>
          <span className="text-sm text-gray-400">
            ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked 
                    ? `bg-white/10 ${getRarityColor(achievement.rarity)} shadow-lg` 
                    : 'bg-gray-900/50 border-gray-600 grayscale'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-6 h-6 mt-1 ${achievement.unlocked ? '' : 'text-gray-500'}`} />
                  <div>
                    <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                      {achievement.unlocked && (
                        <span className="text-xs text-green-400">✓ Unlocked</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Team Overview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Team Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-1">{trainer.pokemonTeam.length}</p>
            <p className="text-sm text-gray-400">Team Pokémon</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-1">{trainer.pokemonBox.length}</p>
            <p className="text-sm text-gray-400">Stored Pokémon</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-1">{trainer.pokemonCaught}</p>
            <p className="text-sm text-gray-400">Total Caught</p>
          </div>
        </div>

        {trainer.pokemonTeam.length === 0 && (
          <div className="mt-6 text-center py-8 border-2 border-dashed border-gray-600 rounded-xl">
            <Zap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No Pokémon in team</p>
            <p className="text-sm text-gray-500 mt-1">Catch some Pokémon to build your team!</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
        </div>
        
        <div className="space-y-3">
          {trainer.pokemonCaught === 0 && trainer.battlesWon === 0 ? (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
          ) : (
            <>
              {trainer.pokemonCaught > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white">Caught {trainer.pokemonCaught} Pokémon</p>
                    <p className="text-sm text-gray-400">Building your collection</p>
                  </div>
                </div>
              )}
              {trainer.battlesWon > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white">Won {trainer.battlesWon} battles</p>
                    <p className="text-sm text-gray-400">Proving your strength</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 