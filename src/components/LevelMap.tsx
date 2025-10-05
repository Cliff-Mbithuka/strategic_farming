import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LEVELS, BADGES, getPlayerRank } from './LevelSystem';

interface LevelMapProps {
  playerProfile: any;
  onLevelSelect: (level: number) => void;
  onReset: () => void;
}



export function LevelMap({ playerProfile, onLevelSelect, onReset }: LevelMapProps) {
  const isLevelUnlocked = (levelId: number) => {
    return levelId <= playerProfile.level;
  };

  const rank = getPlayerRank(playerProfile.xp);
  const nextRankXP = rank.id === 'rookie' ? 200 : rank.id === 'local' ? 500 : rank.id === 'regional' ? 1000 : rank.id === 'smart' ? 2000 : 2000;
  const progressToNext = (playerProfile.xp / nextRankXP) * 100;

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-100 to-yellow-100 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-4 text-green-800"
          >
            🌾 {playerProfile.name}'s Farm Empire 🌾
          </motion.h1>
          
          {playerProfile.xp === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">👋</span>
                <h3 className="text-lg font-medium text-blue-800">Getting Started</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Click on <strong>"Soil Basics"</strong> below to start your first farming challenge! 
                You'll learn how to match crops with the right soil types. 🌱
              </p>
            </motion.div>
          )}
          
          <div className="flex justify-center items-center space-x-8 mb-6">
            <Card className="p-4 bg-white/90 backdrop-blur-sm">
              <div className="text-center">
                <div className={`text-2xl ${rank.color} mb-1`}>{rank.emoji}</div>
                <p className={`font-medium ${rank.color}`}>{rank.title}</p>
                <p className="text-sm text-gray-600">Level {playerProfile.level}</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/90 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl text-yellow-600 mb-1">⭐</div>
                <p className="font-medium text-yellow-600">{playerProfile.xp} XP</p>
                <div className="w-32 mt-2">
                  <Progress value={progressToNext} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {nextRankXP - playerProfile.xp} XP to next rank
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Badges */}
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {playerProfile.badges.map((badgeId: string) => {
              const badge = BADGES.find(b => b.id === badgeId);
              return badge ? (
                <motion.div
                  key={badgeId}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <Badge className="px-3 py-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                    {badge.emoji} {badge.name}
                  </Badge>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {badge.description}
                    </div>
                  </div>
                </motion.div>
              ) : null;
            })}
            {playerProfile.badges.length === 0 && (
              <p className="text-gray-500 text-sm">Complete levels to earn badges! 🏆</p>
            )}
          </div>
        </div>

        {/* Farm Village Map */}
        <div className="relative bg-gradient-to-b from-sky-300 to-green-300 rounded-3xl p-8 mb-6 min-h-96">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 left-10 w-16 h-10 bg-white rounded-full opacity-60"
            />
            <motion.div
              animate={{ x: [20, -20, 20] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 right-10 w-20 h-12 bg-white rounded-full opacity-50"
            />
          </div>

          {/* Levels Grid */}
          <div className="relative z-10 grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {LEVELS.slice(0, 10).map((level, index) => {
              const unlocked = isLevelUnlocked(level.id);
              const completed = playerProfile.level > level.id;
              const getBadgeVariant = () => {
                if (level.difficulty === 'Beginner') return 'default';
                if (level.difficulty === 'Intermediate') return 'secondary';
                if (level.difficulty === 'Advanced') return 'destructive';
                return 'outline';
              };
              
              return (
                <motion.div
                  key={level.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    ...(level.id === 1 && playerProfile.xp === 0 ? {
                      boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 15px rgba(34, 197, 94, 0)']
                    } : {})
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                  whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
                  className={`relative ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => unlocked && onLevelSelect(level.id)}
                >
                  <Card className={`p-6 text-center transition-all duration-300 ${
                    unlocked 
                      ? 'bg-white/95 hover:bg-white border-green-300 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-200/80 border-gray-300'
                  }`}>
                    <motion.div
                      animate={unlocked ? { 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`text-4xl mb-3 ${unlocked ? '' : 'grayscale'}`}
                    >
                      {level.icon}
                    </motion.div>
                    
                    <h3 className={`font-bold mb-2 ${unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                      {level.title}
                    </h3>
                    
                    <p className={`text-sm mb-3 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {level.description}
                    </p>
                    
                    <div className="space-y-2">
                      <Badge 
                        variant={getBadgeVariant()}
                        className="text-xs"
                      >
                        {level.difficulty}
                      </Badge>
                      
                      <div className={`text-xs ${unlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                        ⭐ {level.xpReward} XP
                      </div>
                    </div>

                    {completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                      >
                        ✓
                      </motion.div>
                    )}

                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <div className="text-2xl">🔒</div>
                      </div>
                    )}
                  </Card>

                  {/* Connection Lines */}
                  {index < LEVELS.slice(0, 10).length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-green-400 transform -translate-y-1/2" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Farm Village Elements */}
          <div className="absolute bottom-4 left-4">
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-3xl"
            >
              🏡
            </motion.div>
          </div>
          
          <div className="absolute bottom-4 right-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-2xl"
            >
              🌳
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onReset}
            variant="outline"
            className="bg-white/80 hover:bg-white"
          >
            Reset Progress
          </Button>
        </div>
      </div>
    </div>
  );
}