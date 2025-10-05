import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { FarmPersona } from './FarmPersona';
import { getLevelById, Level, GameStage } from './LevelSystem';
import { EnvironmentData } from '../App';
import { CultivationSimulation } from './CultivationSimulation';

interface GameBoardProps {
  level: number;
  playerProfile: any;
  environmentData: EnvironmentData;
  onComplete: (results: any) => void;
  onBackToMap: () => void;
}

export function GameBoard({ level, playerProfile, environmentData, onComplete, onBackToMap }: GameBoardProps) {
  const [gamePhase, setGamePhase] = useState<'instruction' | 'playing' | 'simulation' | 'feedback'>('instruction');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [droppedItems, setDroppedItems] = useState<{[key: string]: string}>({});
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [animatingCrop, setAnimatingCrop] = useState<string | null>(null);
  const [stageResults, setStageResults] = useState<boolean[]>([]);

  const currentLevel = getLevelById(level);
  const currentStage = currentLevel?.stages[currentStageIndex];

  if (!currentLevel || !currentStage) {
    return <div>Level not found</div>;
  }

  const handlePersonaNext = () => {
    setGamePhase('playing');
  };

  const handleCropClick = (cropId: string, soilId: string) => {
    // Remove from previous position if it was dropped somewhere
    const newDroppedItems = { ...droppedItems };
    Object.keys(newDroppedItems).forEach(key => {
      if (newDroppedItems[key] === cropId) {
        delete newDroppedItems[key];
      }
    });

    // Add to new position
    newDroppedItems[soilId] = cropId;
    setDroppedItems(newDroppedItems);

    // Animate the crop
    setAnimatingCrop(cropId);
    setTimeout(() => setAnimatingCrop(null), 500);

    setAttempts(prev => prev + 1);
  };

  const checkSolution = () => {
    if (!currentStage.correctCombinations) return;
    
    const correct = Object.entries(currentStage.correctCombinations).every(([plotId, expectedCrop]) => 
      droppedItems[plotId] === expectedCrop
    );

    if (correct) {
      const newResults = [...stageResults];
      newResults[currentStageIndex] = true;
      setStageResults(newResults);

      // Check if this is the last stage
      if (currentStageIndex === currentLevel.stages.length - 1) {
        // Start cultivation simulation
        setGamePhase('simulation');
      } else {
        // Move to next stage
        setCurrentStageIndex(prev => prev + 1);
        setDroppedItems({});
        setGamePhase('instruction');
        setAttempts(0);
      }
    } else {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const handleSimulationComplete = () => {
    setGamePhase('feedback');
    setTimeout(() => {
      onComplete({
        score: Math.max(100 - attempts * 10, 50),
        moves: attempts,
        completedCorrectly: true
      });
    }, 2000);
  };

  const getAvailableItems = () => {
    const usedItems = Object.values(droppedItems);
    const items = currentStage.type === 'plant' ? currentStage.crops || [] : currentStage.tools || [];
    return items.filter(item => !usedItems.includes(item.id));
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-200 to-green-100 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBackToMap} variant="outline" className="bg-white/80">
            ← Back to Map
          </Button>
          <div className="text-center">
            <h1 className="text-2xl text-green-800">Level {level}: {currentLevel.title}</h1>
            <p className="text-sm text-gray-600">
              Stage {currentStageIndex + 1} of {currentLevel.stages.length}: {currentStage.name}
            </p>
            <p className="text-xs text-gray-500">Attempts: {attempts}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">XP: {playerProfile.xp}</p>
            <p className="text-xs text-gray-600">Level {playerProfile.level}</p>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-2">
            {currentLevel.stages.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStageIndex
                    ? 'bg-green-500 text-white'
                    : index === currentStageIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStageIndex ? '✓' : index + 1}
              </div>
            ))}
          </div>
          <Progress 
            value={
              gamePhase === 'instruction' 
                ? 25 
                : gamePhase === 'playing' 
                ? 50 
                : gamePhase === 'simulation'
                ? 75
                : 100
            } 
            className="h-3"
          />
        </div>

        {gamePhase === 'instruction' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <FarmPersona
              persona={currentLevel.persona}
              message={currentStage.instruction}
              onNext={handlePersonaNext}
              showHint={showHint}
              hintText={currentStage.hint}
            />
          </motion.div>
        )}

        {gamePhase === 'playing' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Items Inventory */}
            <div>
              <h3 className="text-xl mb-4 text-green-800">
                {currentStage.type === 'plant' ? '🌱 Available Crops' : '🛠️ Available Tools'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {getAvailableItems().map((item) => (
                  <motion.div
                    key={item.id}
                    animate={animatingCrop === item.id ? { scale: [1, 1.2, 1] } : {}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-green-300"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <p className="font-medium text-gray-800 mb-2">{item.name}</p>
                      {currentStage.type === 'tools' && 'description' in item && (
                        <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                      )}
                      <p className="text-xs text-gray-500">Click to select, then click a plot</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Persona with Hint */}
              <div className="mt-8">
                <FarmPersona
                  persona={currentLevel.persona}
                  message={currentStage.type === 'plant' ? "Choose the right crops for each plot! 🌾" : "Select the best tools for each situation! 🛠️"}
                  showHint={showHint}
                  hintText={currentStage.hint}
                />
              </div>
            </div>

            {/* Plots */}
            <div>
              <h3 className="text-xl mb-4 text-green-800">
                {currentStage.type === 'plant' ? '🌍 Farm Plots' : '🎯 Situations'}
              </h3>
              <div className="space-y-4">
                {(currentStage.plots || []).map(plot => (
                  <motion.div
                    key={plot.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-xl border-2 border-gray-300 bg-white transition-all min-h-24 hover:border-green-400"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{plot.emoji}</span>
                          <div>
                            <h4 className="font-medium text-gray-800">{plot.type}</h4>
                            <p className="text-sm text-gray-600">{plot.description}</p>
                          </div>
                        </div>
                        {!droppedItems[plot.id] && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {getAvailableItems().map(item => {
                              const isUsed = Object.values(droppedItems).includes(item.id);
                              return (
                                <motion.button
                                  key={item.id}
                                  onClick={() => !isUsed && handleCropClick(item.id, plot.id)}
                                  disabled={isUsed}
                                  whileHover={!isUsed ? { scale: 1.1 } : {}}
                                  whileTap={!isUsed ? { scale: 0.9 } : {}}
                                  className={`p-2 rounded-lg text-2xl transition-all ${
                                    isUsed 
                                      ? 'opacity-30 cursor-not-allowed' 
                                      : 'hover:bg-green-100 cursor-pointer border border-gray-200 hover:border-green-300'
                                  }`}
                                >
                                  {item.emoji}
                                </motion.button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      {droppedItems[plot.id] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-center"
                        >
                          <div className="text-4xl mb-1">
                            {getAvailableItems().find(c => c.id === droppedItems[plot.id])?.emoji}
                          </div>
                          <p className="text-sm font-medium">
                            {getAvailableItems().find(c => c.id === droppedItems[plot.id])?.name}
                          </p>
                          <Button
                            onClick={() => {
                              const newDroppedItems = { ...droppedItems };
                              delete newDroppedItems[plot.id];
                              setDroppedItems(newDroppedItems);
                            }}
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs"
                          >
                            Remove
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Button
                  onClick={checkSolution}
                  disabled={Object.keys(droppedItems).length !== (currentStage.plots?.length || 0)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  {currentStageIndex === currentLevel.stages.length - 1 ? 'Complete Level! 🎉' : 'Next Stage! ➡️'}
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {gamePhase === 'simulation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full"
          >
            <CultivationSimulation
              level={currentLevel}
              environmentData={environmentData}
              onComplete={handleSimulationComplete}
            />
          </motion.div>
        )}

        {gamePhase === 'feedback' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl mb-4 text-green-800">Excellent Farming!</h2>
            <p className="text-xl text-gray-700">
              You successfully matched all crops to their ideal soil! 🌱
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}