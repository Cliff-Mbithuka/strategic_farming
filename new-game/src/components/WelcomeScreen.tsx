import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [gateOpen, setGateOpen] = useState(false);

  const handleStartClick = () => {
    setGateOpen(true);
    setTimeout(onStart, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-sky-300 to-green-200 relative overflow-hidden">
      {/* Background Farm Scene */}
      <div className="absolute inset-0 opacity-30">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1747889268735-31192c2a6df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFybSUyMHZpbGxhZ2UlMjBjYXJ0b29ufGVufDF8fHx8MTc1OTY0NjUwOHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="African farm village"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animated Clouds */}
      <motion.div
        animate={{ x: [-100, 100, -100] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-0 w-24 h-16 bg-white rounded-full opacity-60"
      />
      <motion.div
        animate={{ x: [100, -100, 100] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-32 right-0 w-32 h-20 bg-white rounded-full opacity-50"
      />

      {/* Farm Gate */}
      <motion.div
        className="relative z-10 mb-8"
        animate={gateOpen ? { rotateY: -90 } : { rotateY: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ transformOrigin: "left center" }}
      >
        <div className="w-80 h-96 bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg border-4 border-amber-900 shadow-2xl">
          {/* Gate Posts */}
          <div className="absolute -left-4 top-0 w-8 h-full bg-amber-900 rounded-l-lg" />
          <div className="absolute -right-4 top-0 w-8 h-full bg-amber-900 rounded-r-lg" />
          
          {/* Gate Bars */}
          <div className="p-6 h-full flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-3 bg-amber-600 rounded-full" />
            ))}
          </div>

          {/* Gate Sign */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-green-600 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-white text-sm font-semibold text-center">
              🌾 SMART FARM 🌾
            </p>
          </div>
        </div>
      </motion.div>

      {/* Welcome Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center z-20 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md mx-4"
      >
        <motion.h1
          animate={{ 
            scale: [1, 1.05, 1],
            color: ['#16a34a', '#059669', '#16a34a']
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mb-4 font-bold"
        >
          🌱 Smart Farming Challenge
        </motion.h1>
        
        <p className="text-lg mb-6 text-gray-700">
          🌍 Learn African smart farming through interactive puzzles!<br/>
          🌱 Match crops to soil types and master sustainable agriculture!<br/>
          🏆 Earn XP, unlock badges, and become a farming hero!
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleStartClick}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-full shadow-lg transform transition-all duration-200 relative overflow-hidden"
            disabled={gateOpen}
          >
            {!gateOpen && (
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 20px rgba(34, 197, 94, 0)'],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            )}
            {gateOpen ? '🌾 Opening Farm Gate... 🌾' : '🚜 Start Your Farming Journey! 🚜'}
          </Button>
        </motion.div>

        <div className="mt-4 flex justify-center space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            🌽
          </motion.div>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🌱
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            🌸
          </motion.div>
        </div>
      </motion.div>

      {/* Flying Elements */}
      <motion.div
        animate={{ 
          y: [-10, -20, -10],
          x: [0, 20, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-40 right-20 text-3xl"
      >
        🦋
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [-15, -25, -15],
          x: [0, -15, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-60 left-16 text-2xl"
      >
        🐝
      </motion.div>
    </div>
  );
}