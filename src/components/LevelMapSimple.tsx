import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface LevelMapProps {
  playerProfile: any;
  onLevelSelect: (level: number) => void;
  onReset: () => void;
}

const simpleLevels = [
  {
    id: 1,
    title: 'Soil Basics',
    description: 'Learn about different soil types',
    difficulty: 'Beginner',
    xpReward: 50,
    icon: '🌍'
  },
  {
    id: 2,
    title: 'Weather Patterns',
    description: 'Understand how weather affects crops',
    difficulty: 'Beginner',
    xpReward: 75,
    icon: '🌦️'
  },
  {
    id: 3,
    title: 'Smart Tools',
    description: 'Use modern farming equipment',
    difficulty: 'Intermediate',
    xpReward: 100,
    icon: '🚜'
  }
];

export function LevelMapSimple({ playerProfile, onLevelSelect, onReset }: LevelMapProps) {
  const isLevelUnlocked = (levelId: number) => {
    return levelId <= playerProfile.level;
  };

  const getPlayerRank = () => {
    if (playerProfile.xp < 100) return { title: 'Rookie Farmer', emoji: '🌱', color: 'text-green-600' };
    if (playerProfile.xp < 300) return { title: 'Local Farmer', emoji: '🚜', color: 'text-blue-600' };
    return { title: 'Smart Farmer', emoji: '🏆', color: 'text-yellow-600' };
  };

  const rank = getPlayerRank();
  const nextRankXP = playerProfile.xp < 100 ? 100 : playerProfile.xp < 300 ? 300 : 500;
  const progressToNext = (playerProfile.xp / nextRankXP) * 100;

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-100 to-yellow-100 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4 text-green-800">
            🌾 {playerProfile.name}'s Farm Empire 🌾
          </h1>
          
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
        </div>

        {/* Farm Village Map */}
        <div className="relative bg-gradient-to-b from-sky-300 to-green-300 rounded-3xl p-8 mb-6 min-h-96">
          {/* Levels Grid */}
          <div className="relative z-10 grid md:grid-cols-3 gap-6">
            {simpleLevels.map((level, index) => {
              const unlocked = isLevelUnlocked(level.id);
              const completed = playerProfile.level > level.id;
              
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
                        variant={level.difficulty === 'Beginner' ? 'default' : 'secondary'}
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
                </motion.div>
              );
            })}
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