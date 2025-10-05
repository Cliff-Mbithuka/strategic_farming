import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface AchievementNotificationProps {
  achievements: string[];
  onClose: () => void;
}

export function AchievementNotification({ achievements, onClose }: AchievementNotificationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          exit={{ y: 50 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-orange-800 flex items-center">
                  🎉 Achievement Unlocked!
                </h2>
                <p className="text-orange-700 mt-1">You've earned something special!</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-orange-600 hover:text-orange-800 hover:bg-orange-200"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 p-3 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏆</span>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {achievement.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-600">New Achievement!</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                Awesome! 🎉
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
