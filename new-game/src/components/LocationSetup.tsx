import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LocationSetupProps {
  onComplete: (location: string) => void;
}

const locations = [
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    emoji: '🏙️',
    description: 'Highland city with clay soil',
    climate: 'Temperate highland',
    features: ['Clay soil', 'Moderate rainfall', 'Cool temperatures']
  },
  {
    id: 'mombasa',
    name: 'Mombasa',
    country: 'Kenya',
    emoji: '🏖️',
    description: 'Coastal city with sandy soil',
    climate: 'Tropical coastal',
    features: ['Sandy soil', 'High humidity', 'Warm temperatures']
  },
  {
    id: 'kisumu',
    name: 'Kisumu',
    country: 'Kenya',
    emoji: '🌊',
    description: 'Lakeside city with fertile loamy soil',
    climate: 'Tropical lakeside',
    features: ['Loamy soil', 'High rainfall', 'Moderate temperatures']
  },
  {
    id: 'eldoret',
    name: 'Eldoret',
    country: 'Kenya',
    emoji: '⛰️',
    description: 'Highland town perfect for grains',
    climate: 'Highland plateau',
    features: ['Clay soil', 'Dry season farming', 'Cool highlands']
  }
];

export function LocationSetup({ onComplete }: LocationSetupProps) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [animatingLocation, setAnimatingLocation] = useState('');

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
    setAnimatingLocation(locationId);
    setTimeout(() => setAnimatingLocation(''), 800);
  };

  const handleContinue = () => {
    const location = locations.find(l => l.id === selectedLocation);
    if (location) {
      onComplete(location.name);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🌍
            </motion.div>
            
            <h2 className="text-3xl mb-4 text-green-800">
              Choose Your Farming Location
            </h2>
            
            <p className="text-gray-700 mb-8 text-lg">
              Each location has unique soil types, weather patterns, and growing conditions. 
              Choose wisely to match your farming strategy! 🌾
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {locations.map((location) => (
              <motion.div
                key={location.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={animatingLocation === location.id ? {
                  scale: [1, 1.1, 1],
                  boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 20px rgba(34, 197, 94, 0)']
                } : {}}
                onClick={() => handleLocationSelect(location.id)}
                className={`p-6 rounded-xl cursor-pointer border-2 transition-all ${
                  selectedLocation === location.id
                    ? 'border-green-500 bg-green-50 shadow-xl'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{location.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.country}</p>
                </div>
                
                <p className="text-gray-700 mb-4 text-center">
                  {location.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-700">
                    <span className="mr-2">🌡️</span>
                    <span>{location.climate}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {location.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedLocation === location.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-center"
                  >
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      ✓ Selected
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleContinue}
                disabled={!selectedLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-xl"
              >
                Analyze My Farm Location 🔍
              </Button>
            </motion.div>
          </div>
        </Card>

        {/* Background Elements */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-10 text-3xl"
        >
          🌴
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [-5, 5, -5],
            y: [-5, 5, -5]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-2xl"
        >
          🏔️
        </motion.div>
      </motion.div>
    </div>
  );
}