import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { EnvironmentData, PlayerProfile } from '../App';
import { getEnvironmentalAnalysis, EnvironmentalData as LLMEnvironmentalData } from '../services/llmService';

interface EnvironmentInsightsProps {
  environmentData: EnvironmentData;
  playerProfile: PlayerProfile;
  onComplete: () => void;
}

export function EnvironmentInsights({ environmentData, playerProfile, onComplete }: EnvironmentInsightsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [llmData, setLlmData] = useState<LLMEnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query LLM for environmental analysis
  useEffect(() => {
    const fetchEnvironmentalData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use coordinates from player profile (from map selection)
        const coordinates = playerProfile.locationCoordinates 
          ? {
              lat: playerProfile.locationCoordinates.lat,
              lng: playerProfile.locationCoordinates.lng,
              name: playerProfile.location,
              address: playerProfile.locationCoordinates.address
            }
          : undefined;

        const analysisData = await getEnvironmentalAnalysis(playerProfile.location, coordinates);
        setLlmData(analysisData);
      } catch (err) {
        console.error('Error fetching environmental analysis:', err);
        setError('Failed to load environmental analysis. Using default data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvironmentalData();
  }, [playerProfile.location]);

  // Use LLM data if available, otherwise fallback to hardcoded data
  const soil = llmData?.soilType || getFallbackSoilData(environmentData.soilType);
  const weather = llmData?.weather || getFallbackWeatherData(environmentData.weather);
  const climate = llmData?.climate || getFallbackClimateData(environmentData.climate);

  const steps = [
    { title: 'Soil Analysis', data: soil, icon: '🌍' },
    { title: 'Weather Patterns', data: weather, icon: '🌦️' },
    { title: 'Climate Conditions', data: climate, icon: '🌡️' }
  ];

  useEffect(() => {
    if (!isLoading && !error) {
      if (currentStep < steps.length) {
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setShowRecommendations(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, steps.length, isLoading, error]);

  const handleContinue = () => {
    onComplete();
  };

  // Fallback data functions (keeping the original hardcoded data as backup)
  function getFallbackSoilData(soilType: string) {
    const soilData = {
      clay: {
        emoji: '🟫',
        name: 'Clay Soil',
        color: 'amber',
        description: 'Rich, holds water well, perfect for crops like maize and beans',
        benefits: ['High water retention', 'Rich in nutrients', 'Good for root crops'],
        challenges: ['Can become waterlogged', 'Hard when dry', 'Slow drainage']
      },
      sandy: {
        emoji: '🟨',
        name: 'Sandy Soil',
        color: 'yellow',
        description: 'Drains quickly, warms up fast, ideal for quick-growing crops',
        benefits: ['Good drainage', 'Easy to work', 'Warms up quickly'],
        challenges: ['Low water retention', 'Needs frequent watering', 'Low nutrients']
      },
      loamy: {
        emoji: '🟤',
        name: 'Loamy Soil',
        color: 'orange',
        description: 'Perfect balance of sand, silt, and clay - ideal for most crops',
        benefits: ['Balanced drainage', 'High fertility', 'Excellent structure'],
        challenges: ['Can be expensive', 'Needs maintenance', 'May compact over time']
      }
    };
    return soilData[soilType as keyof typeof soilData] || soilData.clay;
  }

  function getFallbackWeatherData(weatherType: string) {
    const weatherData = {
      dry: {
        emoji: '☀️',
        name: 'Dry Season',
        color: 'orange',
        description: 'Low rainfall, requires irrigation and drought-resistant crops',
        tips: ['Use drip irrigation', 'Plant drought-resistant varieties', 'Mulch to retain moisture']
      },
      rainy: {
        emoji: '🌧️',
        name: 'Rainy Season',
        color: 'blue',
        description: 'High rainfall, watch for flooding and plant diseases',
        tips: ['Ensure good drainage', 'Watch for fungal diseases', 'Plant water-loving crops']
      },
      temperate: {
        emoji: '⛅',
        name: 'Moderate Weather',
        color: 'green',
        description: 'Balanced conditions, ideal for diverse crop varieties',
        tips: ['Perfect for mixed farming', 'Good for most vegetables', 'Maintain regular watering']
      }
    };
    return weatherData[weatherType as keyof typeof weatherData] || weatherData.temperate;
  }

  function getFallbackClimateData(climateType: string) {
    const climateData = {
      highland: {
        emoji: '⛰️',
        name: 'Highland Climate',
        color: 'purple',
        description: 'Cool temperatures, great for grains and vegetables',
        crops: ['Maize', 'Wheat', 'Potatoes', 'Cabbage']
      },
      coastal: {
        emoji: '🏖️',
        name: 'Coastal Climate',
        color: 'cyan',
        description: 'Warm and humid, perfect for tropical crops',
        crops: ['Coconuts', 'Cashews', 'Mangoes', 'Cassava']
      },
      tropical: {
        emoji: '🌴',
        name: 'Tropical Climate',
        color: 'green',
        description: 'Hot and humid, ideal for tropical agriculture',
        crops: ['Bananas', 'Coffee', 'Sugarcane', 'Pineapples']
      }
    };
    return climateData[climateType as keyof typeof climateData] || climateData.highland;
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-100 to-purple-100 flex items-center justify-center p-4 overflow-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🔍
            </motion.div>
            
            <h2 className="text-3xl mb-4 text-green-800">
              Environmental Analysis for {playerProfile.location}
            </h2>
            
            <p className="text-gray-700 text-lg">
              Let's analyze your farming conditions to optimize your crops! 🌾
            </p>

            {/* Loading and Error States */}
            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700">Analyzing environmental data...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">⚠️</span>
                  <span className="text-yellow-700">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={!isLoading && currentStep >= index ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.5, type: 'spring', damping: 15 }}
              >
                <Card className={`p-6 text-center border-2 ${
                  !isLoading && currentStep >= index ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <motion.div
                    animate={!isLoading && currentStep === index ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl mb-3"
                  >
                    {!isLoading && currentStep >= index ? step.data.emoji : step.icon}
                  </motion.div>
                  
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    {step.title}
                  </h3>
                  
                  {!isLoading && currentStep >= index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className={`mb-3 bg-${step.data.color}-100 text-${step.data.color}-800`}>
                        {step.data.name}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {step.data.description}
                      </p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed Recommendations */}
          <AnimatePresence>
            {!isLoading && showRecommendations && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl text-center mb-6 text-green-800">
                  🎯 Farming Recommendations
                  {llmData && (
                    <span className="text-sm text-blue-600 ml-2">(AI-Powered Analysis)</span>
                  )}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Soil Tips */}
                  <Card className="p-6 bg-amber-50 border-amber-200">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{soil.emoji}</span>
                      <h4 className="text-lg font-bold text-amber-800">{soil.name} Tips</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-green-700 mb-1">Benefits:</h5>
                        {soil.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h5 className="font-medium text-orange-700 mb-1">Watch out for:</h5>
                        {soil.challenges.map((challenge, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <span className="text-orange-500 mr-2">⚠️</span>
                            {challenge}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Weather & Climate */}
                  <Card className="p-6 bg-blue-50 border-blue-200">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{weather.emoji}</span>
                      <h4 className="text-lg font-bold text-blue-800">Growing Tips</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-blue-700 mb-2">Weather Strategy:</h5>
                        {weather.tips.map((tip, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700 mb-1">
                            <span className="text-blue-500 mr-2">💡</span>
                            {tip}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Recommended Crops:</h5>
                        <div className="flex flex-wrap gap-2">
                          {climate.crops.map((crop, i) => (
                            <Badge key={i} className="bg-green-100 text-green-800 text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleContinue}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-xl"
                    >
                      Start Farming Challenges! 🚜
                    </Button>
                  </motion.div>
                </div>
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
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-10 text-3xl"
        >
          🌱
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [-5, 5, -5],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-2xl"
        >
          📊
        </motion.div>
      </motion.div>
    </div>
  );
}