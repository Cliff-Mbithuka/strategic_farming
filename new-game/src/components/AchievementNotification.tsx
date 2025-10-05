import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  { id: 'perfect-streak', name: 'Perfect Streak!', description: 'Got 5 perfect scores in a row', icon: '🏆', rarity: 'epic' },
  { id: 'speed-farmer', name: 'Speed Farmer', description: 'Completed a level in 2 moves or less', icon: '⚡', rarity: 'rare' },
  { id: 'first-steps', name: 'First Steps', description: 'Completed your first farming lesson', icon: '🌱', rarity: 'common' },
  { id: 'dedicated-learner', name: 'Dedicated Learner', description: 'Played 10 games', icon: '🎓', rarity: 'rare' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Got 5 perfect scores', icon: '💫', rarity: 'epic' },
  { id: 'streak-master', name: 'Streak Master', description: 'Achieved a 15-game streak', icon: '🔥', rarity: 'legendary' },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return { bg: 'bg-green-500', text: 'text-green-100', border: 'border-green-400' };
    case 'rare': return { bg: 'bg-blue-500', text: 'text-blue-100', border: 'border-blue-400' };
    case 'epic': return { bg: 'bg-purple-500', text: 'text-purple-100', border: 'border-purple-400' };
    case 'legendary': return { bg: 'bg-yellow-500', text: 'text-yellow-100', border: 'border-yellow-400' };
    default: return { bg: 'bg-gray-500', text: 'text-gray-100', border: 'border-gray-400' };
  }
};

interface AchievementNotificationProps {
  achievements: string[];
  onClose: () => void;
}

export function AchievementNotification({ achievements: newAchievements, onClose }: AchievementNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(true);

  const currentAchievement = achievements.find(a => a.id === newAchievements[currentIndex]);

  useEffect(() => {
    if (newAchievements.length === 0) return;

    const timer = setTimeout(() => {
      if (currentIndex < newAchievements.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setTimeout(() => setShowNotification(false), 2000);
        setTimeout(onClose, 4000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, newAchievements.length, onClose]);

  if (!currentAchievement || !showNotification) return null;

  const colors = getRarityColor(currentAchievement.rarity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className={`bg-white/95 backdrop-blur-sm border-2 ${colors.border} rounded-xl shadow-2xl p-6 max-w-sm relative overflow-hidden`}
        >
          {/* Background sparkle effect */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Achievement Header */}
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mb-4"
            >
              <div className="text-6xl mb-2">{currentAchievement.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Achievement Unlocked!</h3>
            </motion.div>

            {/* Achievement Details */}
            <div className={`px-4 py-3 rounded-lg ${colors.bg} ${colors.text} text-center mb-4`}>
              <h4 className="text-lg font-bold mb-1">{currentAchievement.name}</h4>
              <p className="text-sm opacity-90">{currentAchievement.description}</p>
            </div>

            {/* Rarity Badge */}
            <div className="flex justify-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-black/20 text-white capitalize border ${colors.border}`}>
                {currentAchievement.rarity}
              </span>
            </div>

            {/* Progress indicator */}
            {newAchievements.length > 1 && (
              <div className="flex justify-center space-x-2">
                {newAchievements.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? colors.bg : 'bg-gray-300'
                    }`}
                    animate={{ scale: index === currentIndex ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Particle explosion effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + Math.cos(i * 30 * Math.PI / 180) * 150}%`,
                  y: `${50 + Math.sin(i * 30 * Math.PI / 180) * 150}%`,
                  scale: 1,
                  opacity: 0
                }}
                transition={{ duration: 1 }}
                className={`absolute w-1 h-1 rounded-full ${colors.bg}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
