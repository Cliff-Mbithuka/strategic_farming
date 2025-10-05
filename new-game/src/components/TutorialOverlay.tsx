import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface TutorialOverlayProps {
  show: boolean;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to Smart Farming! 🌾",
    content: "Learn African farming techniques through fun puzzles! You'll match crops to the right soil types.",
    emoji: "👋",
    highlight: null
  },
  {
    title: "Meet Your Farm Guides",
    content: "Mama Amina, Kiptoo, and Dr. Flora will teach you about soil, tools, and plant science!",
    emoji: "👩🏿‍🌾",
    highlight: null
  },
  {
    title: "How to Play",
    content: "Click on a crop emoji under each soil plot to plant it there. Match crops to their ideal soil!",
    emoji: "🎮",
    highlight: null
  }
];

export function TutorialOverlay({ show, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!show) return null;

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 bg-white shadow-2xl border-0 text-center">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              {step.emoji}
            </motion.div>

            <h2 className="text-2xl mb-4 text-green-800">
              {step.title}
            </h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {step.content}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1"
              >
                Skip Tutorial
              </Button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  onClick={handleNext}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Let's Farm! 🚜" : "Next →"}
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}