import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Level } from './LevelSystem';
import { EnvironmentData } from '../App';

interface CultivationSimulationProps {
  level: Level;
  environmentData: EnvironmentData;
  onComplete: () => void;
}

const growthStages = [
  { id: 'seed', name: 'Seed', emoji: '🌰', description: 'Planting seeds in prepared soil' },
  { id: 'sprout', name: 'Sprout', emoji: '🌱', description: 'First shoots emerging from soil' },
  { id: 'growth', name: 'Growth', emoji: '🌿', description: 'Plants developing leaves and stems' },
  { id: 'mature', name: 'Mature', emoji: '🌾', description: 'Full grown plants ready for harvest' },
  { id: 'harvest', name: 'Harvest', emoji: '🎉', description: 'Successful crop harvest!' }
];

export function CultivationSimulation({ level, environmentData, onComplete }: CultivationSimulationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [weatherEffect, setWeatherEffect] = useState<string>('');

  useEffect(() => {
    // Add weather effects based on environment data
    const effects = {
      dry: '☀️ Dry conditions - crops growing slowly but steadily',
      rainy: '🌧️ Rainy season - rapid growth with good moisture',
      temperate: '⛅ Perfect conditions - optimal growth rate'
    };
    setWeatherEffect(effects[environmentData.weather]);

    // Progress through growth stages
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < growthStages.length - 1) {
          return prev + 1;
        } else {
          setShowCelebration(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [environmentData.weather]);

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-green-200 to-blue-100 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0 text-center">
          <h2 className="text-3xl mb-6 text-green-800">
            🌱 Cultivation Simulation
          </h2>
          
          <p className="text-lg text-gray-700 mb-8">
            Watch your crops grow using the smart farming techniques you've chosen!
          </p>

          {/* Weather Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Current Conditions</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center">
                <span className="mr-2">🌍</span>
                <span>{environmentData.soilType} soil</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🌡️</span>
                <span>{environmentData.climate} climate</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🌦️</span>
                <span>{environmentData.weather} weather</span>
              </div>
            </div>
            <p className="text-blue-700 mt-3">{weatherEffect}</p>
          </div>

          {/* Growth Progress */}
          <div className="mb-8">
            <Progress value={(currentStage / (growthStages.length - 1)) * 100} className="h-4 mb-4" />
            
            <div className="flex justify-center space-x-4 mb-6">
              {growthStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: index <= currentStage ? 1 : 0.7,
                    opacity: index <= currentStage ? 1 : 0.5
                  }}
                  transition={{ delay: index * 0.2 }}
                  className={`text-center ${index === currentStage ? 'transform scale-110' : ''}`}
                >
                  <motion.div
                    animate={index === currentStage ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl mb-2"
                  >
                    {stage.emoji}
                  </motion.div>
                  <h4 className="font-medium text-gray-800">{stage.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Farm Simulation Visual */}
          <div className="bg-gradient-to-b from-sky-300 to-green-400 rounded-xl p-8 mb-8 relative overflow-hidden">
            <div className="grid grid-cols-5 gap-4">
              {[...Array(15)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: (index * 0.1) + (currentStage * 0.5) }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      y: [-2, 2, -2],
                      scale: currentStage >= 2 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: index * 0.1
                    }}
                    className="text-2xl"
                  >
                    {growthStages[Math.min(currentStage, growthStages.length - 2)].emoji}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Weather Effects */}
            {environmentData.weather === 'rainy' && (
              <motion.div
                animate={{ y: [0, 400] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-blue-400 text-lg"
                    style={{ left: `${Math.random() * 100}%`, top: '-20px' }}
                  >
                    💧
                  </div>
                ))}
              </motion.div>
            )}
            
            {environmentData.weather === 'dry' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 text-4xl"
              >
                ☀️
              </motion.div>
            )}
          </div>

          {/* Celebration */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-8xl"
                >
                  🎉
                </motion.div>
                
                <h3 className="text-3xl text-green-800 mb-4">
                  Harvest Success!
                </h3>
                
                <p className="text-lg text-gray-700 mb-6">
                  Your smart farming techniques led to a bountiful harvest! 
                  You've learned valuable lessons about sustainable agriculture.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌾</div>
                    <h4 className="font-medium text-green-800">Crop Yield</h4>
                    <p className="text-sm text-gray-600">Excellent harvest quality</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌍</div>
                    <h4 className="font-medium text-blue-800">Soil Health</h4>
                    <p className="text-sm text-gray-600">Improved soil fertility</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl mb-2">💰</div>
                    <h4 className="font-medium text-yellow-800">Economic Impact</h4>
                    <p className="text-sm text-gray-600">Profitable farming</p>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-xl"
                  >
                    Celebrate Success! 🎊
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 360]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 text-3xl"
        >
          🦋
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [-5, 5, -5],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-2xl"
        >
          🐝
        </motion.div>
      </motion.div>
    </div>
  );
}