import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AchievementNotification } from './AchievementNotification';

interface ResultsScreenProps {
  gameData: any;
  playerProfile: any;
  gameStats?: any;
  newAchievements?: string[];
  onNext: () => void;
  onRetry: () => void;
}

const didYouKnowFacts = [
  {
    icon: '🌍',
    title: 'Soil Fact',
    fact: 'It takes 500-1000 years to form just 1 inch of soil naturally!'
  },
  {
    icon: '🌧️',
    title: 'Water Wisdom',
    fact: 'Rainwater harvesting can provide 70% of a family\'s water needs in rural Africa!'
  },
  {
    icon: '🌽',
    title: 'Crop Science',
    fact: 'Maize originated in Mexico but is now Africa\'s most important cereal crop!'
  },
  {
    icon: '🚜',
    title: 'Smart Farming',
    fact: 'Solar-powered irrigation systems can increase crop yields by 40%!'
  }
];

export function ResultsScreen({ gameData, playerProfile, gameStats, newAchievements = [], onNext, onRetry }: ResultsScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFactCard, setShowFactCard] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [showAchievementNotification, setShowAchievementNotification] = useState(newAchievements.length > 0);
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  useEffect(() => {
    if (gameData.completedCorrectly) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowFactCard(true);
      }, 1500);
    }
  }, [gameData.completedCorrectly]);

  const getPerformanceMessage = () => {
    if (gameData.score >= 90) return { message: 'Outstanding farmer!', emoji: '🏆', color: 'text-yellow-600' };
    if (gameData.score >= 70) return { message: 'Great job!', emoji: '🌟', color: 'text-blue-600' };
    if (gameData.score >= 50) return { message: 'Good effort!', emoji: '👍', color: 'text-green-600' };
    return { message: 'Keep learning!', emoji: '💪', color: 'text-purple-600' };
  };

  const performance = getPerformanceMessage();
  const randomFact = didYouKnowFacts[Math.floor(Math.random() * didYouKnowFacts.length)];

  return (
    <div className="w-full h-full bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Achievement Notification */}
      {showAchievementNotification && (
        <AchievementNotification
          achievements={newAchievements}
          onClose={() => setShowAchievementNotification(false)}
        />
      )}
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -100, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: 360,
                opacity: 0
              }}
              transition={{ 
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className="absolute text-2xl"
            >
              {['🎉', '🌟', '🎊', '🏆', '🌾'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0 text-center">
          {/* Main Result */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            {gameData.completedCorrectly ? '🎉' : '🌱'}
          </motion.div>

          <h1 className="text-4xl mb-4 text-green-800">
            {gameData.completedCorrectly ? 'Level Complete!' : 'Almost There!'}
          </h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className={`text-2xl mb-2 ${performance.color}`}>
              {performance.emoji} {performance.message}
            </div>

            {/* Basic Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-2xl text-blue-600 mb-1">⭐</div>
                <div className="text-xl font-bold text-blue-800">{gameData.score}</div>
                <div className="text-sm text-blue-600">Score</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-2xl text-purple-600 mb-1">🎯</div>
                <div className="text-xl font-bold text-purple-800">{gameData.moves}</div>
                <div className="text-sm text-purple-600">Moves</div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-2xl text-green-600 mb-1">🏆</div>
                <div className="text-xl font-bold text-green-800">{playerProfile.xp}</div>
                <div className="text-sm text-green-600">Total XP</div>
              </div>
            </div>

            {/* Streak & Progress Info */}
            {gameStats && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl mb-4 border border-orange-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg text-orange-800 flex items-center">
                    🔥 Current Streak: <span className="font-bold ml-1">{gameStats.currentStreak}</span>
                  </span>
                  <span className="text-sm text-orange-600">
                    Best: {gameStats.bestStreak}
                  </span>
                </div>
                <Progress
                  value={(gameStats.currentStreak / Math.max(15, gameStats.bestStreak + 5)) * 100}
                  className="h-3 mb-2"
                />
                <div className="text-xs text-orange-600">
                  Keep playing perfectly to extend your streak!
                </div>
              </div>
            )}

            {/* Detailed Stats Toggle */}
            <div className="text-center mb-4">
              <motion.button
                onClick={() => setShowDetailedStats(!showDetailedStats)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                {showDetailedStats ? 'Hide' : 'Show'} Detailed Stats 📊
              </motion.button>
            </div>

            {/* Detailed Stats */}
            <AnimatePresence>
              {showDetailedStats && gameStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <Card className="p-4 bg-gray-50 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      📊 Your Farming Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Games Played</div>
                        <div className="text-xl font-bold text-blue-600">{gameStats.totalGamesPlayed}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Perfect Scores</div>
                        <div className="text-xl font-bold text-yellow-600">{gameStats.perfectScoreGames}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Average Score</div>
                        <div className="text-xl font-bold text-purple-600">{Math.round(gameStats.averageScore)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Success Rate</div>
                        <div className="text-xl font-bold text-green-600">
                          {gameStats.totalGamesPlayed > 0 ? Math.round((playerProfile.level / (gameStats.totalGamesPlayed + 1)) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* New Achievements */}
            {newAchievements.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', damping: 10 }}
                className="mb-6"
              >
                <div className="text-lg mb-3 text-gray-700 flex items-center">
                  🎉 <span className="ml-2">Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {newAchievements.slice(0, 3).map((achievement, index) => (
                    <motion.div
                      key={achievement}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, type: 'spring', damping: 15 }}
                    >
                      <Badge className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 text-sm font-medium">
                        🏆 {achievement.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </motion.div>
                  ))}
                  {newAchievements.length > 3 && (
                    <Badge variant="outline" className="px-3 py-2 border-gray-400 text-gray-600">
                      +{newAchievements.length - 3} more
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Did You Know Card */}
          <AnimatePresence>
            {showFactCard && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="mb-8"
              >
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-3xl mr-3">{randomFact.icon}</div>
                    <h3 className="text-xl font-bold text-blue-800">Did You Know?</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {randomFact.fact}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="space-y-4">
            {gameData.completedCorrectly ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onNext}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl rounded-xl"
                >
                  Continue Farming Journey! 🚜
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onRetry}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-xl rounded-xl"
                  >
                    Try Again 🌱
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onNext}
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 py-4 text-lg rounded-xl"
                  >
                    Back to Farm Map 🗺️
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </Card>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            x: [-5, 5, -5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 text-3xl"
        >
          🌻
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-2xl"
        >
          🦋
        </motion.div>
      </motion.div>
    </div>
  );
}
