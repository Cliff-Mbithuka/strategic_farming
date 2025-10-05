import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import farmerBoyAvatar from './Avatars/young_man.png';
import farmerGirlAvatar from './Avatars/young_woman.png';
import scientistAvatar from './Avatars/Scientist.png';
import villageElderAvatar from './Avatars/Village Elder.png';
import Avatar from './Avatars/Avatar.png';


interface ProfileSetupProps {
  onComplete: (profile: { name: string; avatar: string }) => void;
}

const avatars = [
  { id: 'farmer-boy', image: farmerBoyAvatar, name: 'Farmer Boy', description: 'Loves tractors and maize!' },
  { id: 'farmer-girl', image: farmerGirlAvatar, name: 'Farmer Girl', description: 'Expert in sustainable farming!' },
  { id: 'scientist', image: scientistAvatar, name: 'Scientist', description: 'Studies soil and weather!' },
  { id: 'village-elder', image: villageElderAvatar, name: 'Village Elder', description: 'Wisdom of traditional farming!' }
];

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('farmer-boy');
  const [currentStep, setCurrentStep] = useState<'name' | 'avatar'>('name');

  const handleNameSubmit = () => {
    if (name.trim()) {
      setCurrentStep('avatar');
    }
  };

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };

  const handleComplete = () => {
    onComplete({ name: name.trim(), avatar: selectedAvatar });
  };

  const selectedAvatarData = avatars.find(a => a.id === selectedAvatar)!;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          {currentStep === 'name' && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🌾
              </motion.div>
              
              <h2 className="text-3xl mb-4 text-green-800">
                Welcome to Smart Farm!
              </h2>
              
              <p className="text-gray-600 mb-6">
                What should we call you, future farming hero?
              </p>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-center text-xl py-3 border-2 border-green-300 focus:border-green-500 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleNameSubmit}
                    disabled={!name.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl"
                  >
                    Continue 🚀
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentStep === 'avatar' && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-center"
            >
              <motion.img
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                src={Avatar}
                alt={selectedAvatarData.name}
                className="w-16 h-16 mx-auto mb-4"
              />
              
              <h2 className="text-2xl mb-2 text-green-800">
                Hello, {name}! 👋
              </h2>
              
              <p className="text-gray-600 mb-6">
                Choose your farming avatar:
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {avatars.map((avatar) => (
                  <motion.div
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                      selectedAvatar === avatar.id
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <img src={avatar.image} alt={avatar.name} className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-800">{avatar.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{avatar.description}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{
                  boxShadow: selectedAvatar ? ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 20px rgba(34, 197, 94, 0)'] : '0 0 0 0 rgba(34, 197, 94, 0)'
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Button
                  onClick={handleComplete}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl"
                >
                  Start Farming Adventure! 🌱
                </Button>
              </motion.div>
            </motion.div>
          )}
        </Card>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-10 text-2xl"
        >
          🌺
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [-5, 5, -5],
            y: [-5, 5, -5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-2xl"
        >
          🦋
        </motion.div>
      </motion.div>
    </div>
  );
}
