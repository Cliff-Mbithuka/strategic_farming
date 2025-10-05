import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoading(true);
      // Simulate login process
      setTimeout(() => {
        onLogin(username.trim());
      }, 1500);
    }
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('Guest Farmer');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🚪
          </motion.div>
          
          <h2 className="text-3xl mb-4 text-green-800">
            Enter Smart Farm
          </h2>
          
          <p className="text-gray-700 mb-6">
            Welcome! Please enter your farmer name to begin your agricultural journey.
          </p>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter farmer name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-center text-lg py-3 border-2 border-green-300 focus:border-green-500 rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={isLoading}
            />
            
            <motion.div
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              <Button
                onClick={handleLogin}
                disabled={!username.trim() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl mb-3"
              >
                {isLoading ? '🌾 Entering Farm... 🌾' : '🚜 Enter as Farmer 🚜'}
              </Button>
            </motion.div>

            <motion.div
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              <Button
                onClick={handleGuestLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full py-3 text-lg rounded-xl border-2 border-gray-300 hover:border-green-300"
              >
                {isLoading ? '🌱 Loading... 🌱' : '👤 Continue as Guest'}
              </Button>
            </motion.div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-xl"
            >
              🌽
            </motion.div>
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl"
            >
              🌱
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="text-xl"
            >
              🌸
            </motion.div>
          </div>
        </Card>

        {/* Floating Background Elements */}
        <motion.div
          animate={{ 
            y: [-8, 8, -8],
            x: [-3, 3, -3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-10 text-2xl"
        >
          🦋
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-2xl"
        >
          🌿
        </motion.div>
      </motion.div>
    </div>
  );
}