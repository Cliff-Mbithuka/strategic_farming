import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface FarmPersonaProps {
  persona: 'mama-amina' | 'kiptoo' | 'dr-flora';
  message: string;
  onNext?: () => void;
  showHint?: boolean;
  hintText?: string;
}

const personas = {
  'mama-amina': {
    name: 'Mama Amina',
    emoji: '👩🏿‍🌾',
    role: 'Soil & Weather Expert',
    color: 'from-amber-400 to-orange-500',
    textColor: 'text-amber-800'
  },
  'kiptoo': {
    name: 'Kiptoo',
    emoji: '👨🏿‍🔧',
    role: 'Modern Tools Specialist',
    color: 'from-blue-400 to-cyan-500',
    textColor: 'text-blue-800'
  },
  'dr-flora': {
    name: 'Dr. Flora',
    emoji: '👩🏿‍🔬',
    role: 'Plant Science Researcher',
    color: 'from-green-400 to-emerald-500',
    textColor: 'text-green-800'
  }
};

export function FarmPersona({ persona, message, onNext, showHint, hintText }: FarmPersonaProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const personaData = personas[persona];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      setIsAnimating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="relative"
    >
      {/* Persona Avatar */}
      <motion.div
        animate={isAnimating ? { 
          y: [-5, 5, -5],
          rotate: [-2, 2, -2]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${personaData.color} flex items-center justify-center shadow-lg border-4 border-white`}>
          <span className="text-3xl">{personaData.emoji}</span>
        </div>
        
        {/* Name Badge */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border-2 border-gray-200">
          <p className={`text-xs font-semibold ${personaData.textColor}`}>
            {personaData.name}
          </p>
          <p className="text-xs text-gray-600">
            {personaData.role}
          </p>
        </div>
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute left-24 top-0 max-w-xs"
          >
            <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-gray-200 relative">
              {/* Speech Bubble Tail */}
              <div className="absolute left-0 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white transform -translate-x-2" />
              <div className="absolute left-0 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-200 transform -translate-x-3" />
              
              <p className="text-sm text-gray-800 mb-3">
                {message}
              </p>

              {showHint && hintText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3"
                >
                  <p className="text-xs text-yellow-800">
                    💡 <strong>Hint:</strong> {hintText}
                  </p>
                </motion.div>
              )}

              {onNext && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onNext}
                    size="sm"
                    className={`w-full bg-gradient-to-r ${personaData.color} text-white border-0 hover:shadow-lg`}
                  >
                    Got it! 👍
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Gestures */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute -top-2 -right-2 text-lg"
      >
        ✨
      </motion.div>
    </motion.div>
  );
}