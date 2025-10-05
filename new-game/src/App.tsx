import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginScreen } from './components/LoginScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { LocationSetup } from './components/LocationSetup';
import { EnvironmentInsights } from './components/EnvironmentInsights';
import { GameBoard } from './components/GameBoard';
import { LevelMapSimple as LevelMap } from './components/LevelMapSimple';
import { ResultsScreen } from './components/ResultsScreen';
import { TutorialOverlay } from './components/TutorialOverlay';

export type GameState = 'login' | 'welcome' | 'profile' | 'location' | 'insights' | 'levelMap' | 'game' | 'results';

export interface PlayerProfile {
  name: string;
  avatar: string;
  location: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
    address?: string;
  };
  level: number;
  xp: number;
  badges: string[];
  unlockedAreas: string[];
  rank: string;
}

export interface EnvironmentData {
  soilType: 'clay' | 'sandy' | 'loamy';
  weather: 'dry' | 'rainy' | 'temperate';
  climate: 'highland' | 'coastal' | 'tropical';
  season: 'wet' | 'dry' | 'transitional';
}

export interface GameData {
  currentLevel: number;
  score: number;
  moves: number;
  completedCorrectly: boolean;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('login');
  const [showTutorial, setShowTutorial] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    name: '',
    avatar: 'farmer-boy',
    location: '',
    level: 1,
    xp: 0,
    badges: [],
    unlockedAreas: ['starter-field'],
    rank: 'rookie'
  });
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({
    soilType: 'clay',
    weather: 'temperate',
    climate: 'highland',
    season: 'wet'
  });
  const [gameData, setGameData] = useState<GameData>({
    currentLevel: 1,
    score: 0,
    moves: 0,
    completedCorrectly: false
  });

  const handleLogin = (username: string) => {
    setPlayerProfile(prev => ({ ...prev, name: username }));
    setGameState('welcome');
  };

  const handleProfileComplete = (profile: Partial<PlayerProfile>) => {
    setPlayerProfile(prev => ({ ...prev, ...profile }));
    setGameState('location');
  };

  const handleLocationComplete = (location: string, coordinates?: { lat: number; lng: number; address?: string }) => {
    setPlayerProfile(prev => ({ ...prev, location, locationCoordinates: coordinates }));
    // Generate fallback environment data based on location (will be overridden by LLM)
    const locations = {
      'Nairobi': { soilType: 'clay' as const, weather: 'temperate' as const, climate: 'highland' as const, season: 'wet' as const },
      'Mombasa': { soilType: 'sandy' as const, weather: 'rainy' as const, climate: 'coastal' as const, season: 'wet' as const },
      'Kisumu': { soilType: 'loamy' as const, weather: 'temperate' as const, climate: 'tropical' as const, season: 'transitional' as const },
      'Eldoret': { soilType: 'clay' as const, weather: 'dry' as const, climate: 'highland' as const, season: 'dry' as const }
    };
    const envData = locations[location as keyof typeof locations] || locations['Nairobi'];
    setEnvironmentData(envData);
    setGameState('insights');
  };

  const handleInsightsComplete = () => {
    setGameState('levelMap');
  };

  const handleLevelStart = (levelNumber: number) => {
    setGameData(prev => ({ ...prev, currentLevel: levelNumber }));
    if (levelNumber === 1 && playerProfile.xp === 0) {
      setShowTutorial(true);
    } else {
      setGameState('game');
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setGameState('game');
  };

  const handleGameComplete = (results: Partial<GameData>) => {
    setGameData(prev => ({ ...prev, ...results }));
    
    // Award XP and badges based on performance
    const newXP = results.completedCorrectly ? 50 : 20;
    const newBadges = [...playerProfile.badges];
    
    if (results.completedCorrectly && gameData.currentLevel === 1 && !newBadges.includes('soil-pro')) {
      newBadges.push('soil-pro');
    }
    
    if (results.completedCorrectly && gameData.currentLevel === 2 && !newBadges.includes('weather-pro')) {
      newBadges.push('weather-pro');
    }
    
    if (results.completedCorrectly && gameData.currentLevel === 3 && !newBadges.includes('tools-pro')) {
      newBadges.push('tools-pro');
    }
    
    setPlayerProfile(prev => ({
      ...prev,
      xp: prev.xp + newXP,
      level: results.completedCorrectly ? Math.max(prev.level, gameData.currentLevel + 1) : prev.level,
      badges: newBadges
    }));
    
    setGameState('results');
  };

  const handleNextLevel = () => {
    setGameState('levelMap');
  };

  const resetGame = () => {
    setGameState('login');
    setPlayerProfile({
      name: '',
      avatar: 'farmer-boy',
      location: '',
      level: 1,
      xp: 0,
      badges: [],
      unlockedAreas: ['starter-field'],
      rank: 'rookie'
    });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-200 to-green-100 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-80 animate-pulse" />
        <div className="absolute top-20 right-20 w-6 h-6 bg-white rounded-full opacity-60 animate-bounce" />
        <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-green-300 rounded-full opacity-70" />
      </div>

      {/* Debug Panel */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs space-y-1">
        <p>State: {gameState}</p>
        <p>Name: {playerProfile.name}</p>
        <p>Location: {playerProfile.location}</p>
        <div className="flex space-x-1">
          <button 
            onClick={() => setGameState('login')} 
            className="bg-red-500 px-2 py-1 rounded text-xs"
          >
            Reset
          </button>
          <button 
            onClick={() => {
              setPlayerProfile(prev => ({ 
                ...prev, 
                name: 'Test Farmer', 
                location: 'Nairobi',
                avatar: 'farmer-boy'
              }));
              setGameState('levelMap');
            }} 
            className="bg-blue-500 px-2 py-1 rounded text-xs"
          >
            Skip to Map
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full"
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        )}

        {gameState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <WelcomeScreen onStart={() => setGameState('profile')} />
          </motion.div>
        )}

        {gameState === 'profile' && (
          <motion.div
            key="profile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full h-full relative"
          >
            <button 
              onClick={() => setGameState('welcome')} 
              className="absolute top-4 left-4 z-10 bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              ← Back
            </button>
            <ProfileSetup onComplete={handleProfileComplete} />
          </motion.div>
        )}

        {gameState === 'location' && (
          <motion.div
            key="location"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full h-full relative"
          >
            <button 
              onClick={() => setGameState('profile')} 
              className="absolute top-4 left-4 z-10 bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              ← Back
            </button>
            <LocationSetup onComplete={handleLocationComplete} />
          </motion.div>
        )}

        {gameState === 'insights' && (
          <motion.div
            key="insights"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full h-full relative"
          >
            <button 
              onClick={() => setGameState('location')} 
              className="absolute top-4 left-4 z-10 bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              ← Back
            </button>
            <EnvironmentInsights 
              environmentData={environmentData}
              playerProfile={playerProfile}
              onComplete={handleInsightsComplete}
            />
          </motion.div>
        )}

        {gameState === 'levelMap' && (
          <motion.div
            key="levelMap"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full h-full"
          >
            <LevelMap 
              playerProfile={playerProfile}
              onLevelSelect={handleLevelStart}
              onReset={resetGame}
            />
          </motion.div>
        )}

        {gameState === 'game' && (
          <motion.div
            key="game"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full h-full"
          >
            <GameBoard 
              level={gameData.currentLevel}
              playerProfile={playerProfile}
              environmentData={environmentData}
              onComplete={handleGameComplete}
              onBackToMap={() => setGameState('levelMap')}
            />
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full h-full"
          >
            <ResultsScreen 
              gameData={gameData}
              playerProfile={playerProfile}
              onNext={handleNextLevel}
              onRetry={() => setGameState('game')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      <TutorialOverlay 
        show={showTutorial} 
        onComplete={handleTutorialComplete} 
      />
    </div>
  );
}