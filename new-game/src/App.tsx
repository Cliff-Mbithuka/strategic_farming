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
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>(['basic-farm']);
  const [gameStats, setGameStats] = useState({
    totalGamesPlayed: 0,
    perfectScoreGames: 0,
    fastestCompletion: null,
    averageScore: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [achievements, setAchievements] = useState<string[]>([]);
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

  const calculateScore = (baseScore: number, moves: number, completed: boolean, timeBonus: number = 0) => {
    let score = baseScore;

    // Perfect score bonus
    if (completed && moves <= 3) score += 30;

    // Streak bonus
    if (gameStats.currentStreak > 1) score += Math.min(gameStats.currentStreak * 5, 50);

    // Time bonus for future implementation
    score += timeBonus;

    return Math.min(score, 100);
  };

  const checkAchievements = (results: Partial<GameData>, currentProfile: PlayerProfile) => {
    const newAchievements = [...achievements];
    const newBadges = [...currentProfile.badges];

    // Perfect score streak
    if ((results.score || 0) >= 95 && gameStats.currentStreak >= 5 && !newAchievements.includes('perfect-streak')) {
      newAchievements.push('perfect-streak');
    }

    // Level completion badges
    if (results.completedCorrectly) {
      if (gameData.currentLevel === 1 && !newBadges.includes('soil-pro')) newBadges.push('soil-pro');
      if (gameData.currentLevel === 3 && !newBadges.includes('tool-master')) newBadges.push('tool-master');
      if (gameData.currentLevel === 5 && !newBadges.includes('sustainability-hero')) newBadges.push('sustainability-hero');
    }

    // Speed farmer (low moves)
    if ((results.moves || 0) <= 2 && !newAchievements.includes('speed-farmer')) {
      newAchievements.push('speed-farmer');
    }

    return { newAchievements, newBadges };
  };

  const handleGameComplete = (results: Partial<GameData>) => {
    setGameData(prev => ({ ...prev, ...results }));

    // Enhanced scoring
    const baseScore = results.completedCorrectly ? 70 : Math.max(30, 100 - (results.moves || 0) * 5);
    const enhancedScore = calculateScore(baseScore, results.moves || 0, results.completedCorrectly || false);

    // Update game stats
    setGameStats(prev => {
      const newStats = { ...prev };
      newStats.totalGamesPlayed += 1;

      if (results.completedCorrectly) {
        newStats.currentStreak += 1;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);

        if (enhancedScore >= 95) newStats.perfectScoreGames += 1;
      } else {
        newStats.currentStreak = 0;
      }

      // Calculate average score
      const totalScorePoints = (prev.averageScore * prev.totalGamesPlayed) + enhancedScore;
      newStats.averageScore = totalScorePoints / newStats.totalGamesPlayed;

      return newStats;
    });

    // Check for achievements and badges
    const { newAchievements, newBadges } = checkAchievements(results, playerProfile);

    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
    }

    // Award XP and badges based on performance
    const baseXP = results.completedCorrectly ? 50 : 20;
    const achievementBonus = newAchievements.length - achievements.length;
    const newXP = baseXP + (achievementBonus * 15) + ((results.score || 0) >= 90 ? 10 : 0);

    // Unlock features based on progress
    const newUnlockedFeatures = [...unlockedFeatures];
    if (playerProfile.level >= 3 && !newUnlockedFeatures.includes('decorative-farm')) {
      newUnlockedFeatures.push('decorative-farm');
    }
    if (gameStats.totalGamesPlayed >= 5 && !newUnlockedFeatures.includes('statistics')) {
      newUnlockedFeatures.push('statistics');
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

    setUnlockedFeatures(newUnlockedFeatures);
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
    <div className="w-full h-screen bg-gradient-to-br from-sky-300 via-green-200 to-yellow-100 overflow-hidden relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 left-10 w-10 h-10 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-90 shadow-lg"
        />
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-8 h-8 bg-white rounded-full opacity-70 shadow-md"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 w-6 h-6 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full opacity-80"
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-32 left-20 w-12 h-3 bg-green-500 rounded-full opacity-60"
        />
        <motion.div
          animate={{ scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-32 right-1/3 w-5 h-5 bg-blue-300 rounded-full opacity-70"
        />
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
            <motion.button
              onClick={() => setGameState('welcome')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-sm font-medium hover:bg-white hover:shadow-xl transition-all duration-200"
            >
              ← Back
            </motion.button>
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
            <motion.button
              onClick={() => setGameState('profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-sm font-medium hover:bg-white hover:shadow-xl transition-all duration-200"
            >
              ← Back
            </motion.button>
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
            <motion.button
              onClick={() => setGameState('location')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-sm font-medium hover:bg-white hover:shadow-xl transition-all duration-200"
            >
              ← Back
            </motion.button>
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
              gameStats={gameStats}
              newAchievements={achievements}
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
