// Level System Configuration for Smart Farming Challenge

export interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  xpReward: number;
  icon: string;
  persona: 'mama-amina' | 'kiptoo' | 'dr-flora';
  type: 'plant-only' | 'plant-tools' | 'tools-only' | 'simulation' | 'market';
  stages: GameStage[];
  unlockRequirement: number; // minimum level needed
  area: string;
}

export interface GameStage {
  id: string;
  name: string;
  instruction: string;
  type: 'plant' | 'tools' | 'weather' | 'simulation';
  plots?: PlotData[];
  crops?: CropData[];
  tools?: ToolData[];
  weatherOptions?: WeatherData[];
  correctCombinations?: { [key: string]: string };
  hint: string;
}

export interface PlotData {
  id: string;
  type: string;
  emoji: string;
  description: string;
  color: string;
}

export interface CropData {
  id: string;
  name: string;
  emoji: string;
  correctSoil?: string;
  correctWeather?: string;
  growthTime: number;
}

export interface ToolData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  useCase: string;
  correctFor?: string[];
}

export interface WeatherData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effects: string[];
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Soil Basics',
    description: 'Learn about different soil types and crop matching',
    difficulty: 'Beginner',
    xpReward: 50,
    icon: '🌍',
    persona: 'mama-amina',
    type: 'plant-only',
    unlockRequirement: 1,
    area: 'starter-field',
    stages: [
      {
        id: 'soil-match',
        name: 'Match Crops to Soil',
        instruction: 'Hello! I\'m Mama Amina. Let\'s start with soil basics. Match each crop to its ideal soil type.',
        type: 'plant',
        plots: [
          { id: 'clay', type: 'Clay Soil', emoji: '🟫', description: 'Rich, holds water well', color: 'bg-amber-600' },
          { id: 'sandy', type: 'Sandy Soil', emoji: '🟨', description: 'Drains quickly', color: 'bg-yellow-400' },
          { id: 'loamy', type: 'Loamy Soil', emoji: '🟤', description: 'Perfect balance', color: 'bg-orange-600' }
        ],
        crops: [
          { id: 'maize', name: 'Maize', emoji: '🌽', correctSoil: 'clay', growthTime: 3 },
          { id: 'beans', name: 'Beans', emoji: '🫘', correctSoil: 'loamy', growthTime: 2 },
          { id: 'millet', name: 'Millet', emoji: '🌾', correctSoil: 'sandy', growthTime: 4 }
        ],
        correctCombinations: { 'clay': 'maize', 'loamy': 'beans', 'sandy': 'millet' },
        hint: 'Maize loves clay soil because it holds water well!'
      }
    ]
  },
  {
    id: 2,
    title: 'Weather Patterns',
    description: 'Understand how weather affects crop growth',
    difficulty: 'Beginner',
    xpReward: 75,
    icon: '🌦️',
    persona: 'dr-flora',
    type: 'plant-only',
    unlockRequirement: 2,
    area: 'weather-station',
    stages: [
      {
        id: 'weather-crop',
        name: 'Crops and Weather',
        instruction: 'I\'m Dr. Flora! Now let\'s see how weather affects your crops. Choose the right crops for each weather condition.',
        type: 'plant',
        plots: [
          { id: 'sunny', type: 'Sunny Plot', emoji: '☀️', description: 'Full sun, hot and dry', color: 'bg-yellow-300' },
          { id: 'shaded', type: 'Shaded Plot', emoji: '⛅', description: 'Partial shade, cool', color: 'bg-gray-300' },
          { id: 'rainy', type: 'Rainy Plot', emoji: '🌧️', description: 'High rainfall area', color: 'bg-blue-300' }
        ],
        crops: [
          { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅', correctSoil: 'sunny', growthTime: 3 },
          { id: 'lettuce', name: 'Lettuce', emoji: '🥬', correctSoil: 'shaded', growthTime: 2 },
          { id: 'rice', name: 'Rice', emoji: '🌾', correctSoil: 'rainy', growthTime: 5 }
        ],
        correctCombinations: { 'sunny': 'tomatoes', 'shaded': 'lettuce', 'rainy': 'rice' },
        hint: 'Tomatoes love sunshine, lettuce prefers cooler conditions!'
      }
    ]
  },
  {
    id: 3,
    title: 'Smart Tools',
    description: 'Use modern farming equipment effectively',
    difficulty: 'Intermediate',
    xpReward: 100,
    icon: '🚜',
    persona: 'kiptoo',
    type: 'plant-tools',
    unlockRequirement: 3,
    area: 'tool-shed',
    stages: [
      {
        id: 'plant-stage',
        name: 'Plant Your Crops',
        instruction: 'I\'m Kiptoo! First, let\'s plant some crops, then we\'ll choose the right tools.',
        type: 'plant',
        plots: [
          { id: 'field1', type: 'Large Field', emoji: '🌾', description: 'Big farming area', color: 'bg-green-400' },
          { id: 'field2', type: 'Dry Field', emoji: '🏜️', description: 'Needs irrigation', color: 'bg-yellow-500' },
          { id: 'field3', type: 'Small Plot', emoji: '🌱', description: 'Hand farming area', color: 'bg-green-300' }
        ],
        crops: [
          { id: 'wheat', name: 'Wheat', emoji: '🌾', correctSoil: 'field1', growthTime: 4 },
          { id: 'corn', name: 'Corn', emoji: '🌽', correctSoil: 'field2', growthTime: 3 },
          { id: 'herbs', name: 'Herbs', emoji: '🌿', correctSoil: 'field3', growthTime: 2 }
        ],
        correctCombinations: { 'field1': 'wheat', 'field2': 'corn', 'field3': 'herbs' },
        hint: 'Large fields need different crops than small plots!'
      },
      {
        id: 'tools-stage',
        name: 'Choose Your Tools',
        instruction: 'Great! Now select the right tools for each planted field.',
        type: 'tools',
        plots: [
          { id: 'field1', type: 'Large Field', emoji: '🌾', description: 'Big farming area', color: 'bg-green-400' },
          { id: 'field2', type: 'Dry Field', emoji: '🏜️', description: 'Needs irrigation', color: 'bg-yellow-500' },
          { id: 'field3', type: 'Small Plot', emoji: '🌱', description: 'Hand farming area', color: 'bg-green-300' }
        ],
        tools: [
          { id: 'tractor', name: 'Tractor', emoji: '🚜', description: 'For large scale farming', useCase: 'Large areas', correctFor: ['field1'] },
          { id: 'irrigation', name: 'Irrigation', emoji: '💧', description: 'Water delivery system', useCase: 'Dry areas', correctFor: ['field2'] },
          { id: 'hand-tools', name: 'Hand Tools', emoji: '🛠️', description: 'For precision work', useCase: 'Small plots', correctFor: ['field3'] }
        ],
        correctCombinations: { 'field1': 'tractor', 'field2': 'irrigation', 'field3': 'hand-tools' },
        hint: 'Match tools to field size and needs!'
      }
    ]
  },
  {
    id: 4,
    title: 'Irrigation Systems',
    description: 'Master water management for optimal growth',
    difficulty: 'Intermediate',
    xpReward: 125,
    icon: '💧',
    persona: 'kiptoo',
    type: 'tools-only',
    unlockRequirement: 4,
    area: 'irrigation-zone',
    stages: [
      {
        id: 'water-management',
        name: 'Water Distribution',
        instruction: 'Water is life! Let\'s set up irrigation systems for different crop needs.',
        type: 'tools',
        plots: [
          { id: 'thirsty', type: 'High Water Crops', emoji: '🌊', description: 'Needs lots of water', color: 'bg-blue-400' },
          { id: 'moderate', type: 'Moderate Water Crops', emoji: '💧', description: 'Regular watering', color: 'bg-blue-300' },
          { id: 'drought', type: 'Drought-Resistant Crops', emoji: '🏜️', description: 'Minimal water', color: 'bg-yellow-400' }
        ],
        tools: [
          { id: 'sprinklers', name: 'Sprinklers', emoji: '💦', description: 'Continuous water supply', useCase: 'Heavy watering', correctFor: ['thirsty'] },
          { id: 'drip', name: 'Drip System', emoji: '💧', description: 'Efficient water delivery', useCase: 'Controlled watering', correctFor: ['moderate'] },
          { id: 'minimal', name: 'Rain Collection', emoji: '🌧️', description: 'Natural water harvesting', useCase: 'Low water needs', correctFor: ['drought'] }
        ],
        correctCombinations: { 'thirsty': 'sprinklers', 'moderate': 'drip', 'drought': 'minimal' },
        hint: 'Different crops need different amounts of water!'
      }
    ]
  },
  {
    id: 5,
    title: 'Crop Rotation',
    description: 'Learn sustainable farming practices',
    difficulty: 'Advanced',
    xpReward: 150,
    icon: '🔄',
    persona: 'mama-amina',
    type: 'simulation',
    unlockRequirement: 5,
    area: 'rotation-fields',
    stages: [
      {
        id: 'rotation-planning',
        name: 'Plan Crop Rotation',
        instruction: 'Wisdom of generations! Rotate crops to keep soil healthy and productive.',
        type: 'plant',
        plots: [
          { id: 'season1', type: 'Season 1', emoji: '🌱', description: 'Plant nitrogen-fixing crops', color: 'bg-green-400' },
          { id: 'season2', type: 'Season 2', emoji: '🌾', description: 'Plant heavy feeders', color: 'bg-yellow-400' },
          { id: 'season3', type: 'Season 3', emoji: '🌿', description: 'Plant light feeders', color: 'bg-blue-400' }
        ],
        crops: [
          { id: 'legumes', name: 'Legumes', emoji: '🫘', correctSoil: 'season1', growthTime: 3 },
          { id: 'grains', name: 'Grains', emoji: '🌾', correctSoil: 'season2', growthTime: 4 },
          { id: 'leafy', name: 'Leafy Greens', emoji: '🥬', correctSoil: 'season3', growthTime: 2 }
        ],
        correctCombinations: { 'season1': 'legumes', 'season2': 'grains', 'season3': 'leafy' },
        hint: 'Start with nitrogen-fixing crops to enrich the soil!'
      }
    ]
  },
  {
    id: 6,
    title: 'Pest Management',
    description: 'Protect crops from pests naturally',
    difficulty: 'Advanced',
    xpReward: 175,
    icon: '🐛',
    persona: 'dr-flora',
    type: 'plant-tools',
    unlockRequirement: 6,
    area: 'protection-zone',
    stages: [
      {
        id: 'pest-identification',
        name: 'Identify Problems',
        instruction: 'Protect your crops! Choose natural solutions for pest problems.',
        type: 'tools',
        plots: [
          { id: 'aphids', type: 'Aphid Infestation', emoji: '🐛', description: 'Small green bugs', color: 'bg-red-400' },
          { id: 'fungus', type: 'Fungal Disease', emoji: '🍄', description: 'Spots on leaves', color: 'bg-purple-400' },
          { id: 'weeds', type: 'Weed Problem', emoji: '🌿', description: 'Competing plants', color: 'bg-orange-400' }
        ],
        tools: [
          { id: 'ladybugs', name: 'Ladybugs', emoji: '🐞', description: 'Natural predators', useCase: 'Aphid control', correctFor: ['aphids'] },
          { id: 'neem', name: 'Neem Oil', emoji: '🌱', description: 'Natural fungicide', useCase: 'Disease prevention', correctFor: ['fungus'] },
          { id: 'mulch', name: 'Mulching', emoji: '🍂', description: 'Weed suppression', useCase: 'Weed control', correctFor: ['weeds'] }
        ],
        correctCombinations: { 'aphids': 'ladybugs', 'fungus': 'neem', 'weeds': 'mulch' },
        hint: 'Nature provides the best solutions for natural farming!'
      }
    ]
  },
  {
    id: 7,
    title: 'Market Planning',
    description: 'Plan crops based on market demand',
    difficulty: 'Advanced',
    xpReward: 200,
    icon: '📈',
    persona: 'kiptoo',
    type: 'market',
    unlockRequirement: 7,
    area: 'market-analysis',
    stages: [
      {
        id: 'market-demand',
        name: 'Meet Market Demand',
        instruction: 'Smart farmers think like entrepreneurs! Plant what the market needs.',
        type: 'plant',
        plots: [
          { id: 'high-demand', type: 'High Demand', emoji: '📈', description: 'Popular in markets', color: 'bg-green-500' },
          { id: 'export', type: 'Export Crops', emoji: '🚢', description: 'International sales', color: 'bg-blue-500' },
          { id: 'local', type: 'Local Market', emoji: '🏪', description: 'Community needs', color: 'bg-orange-500' }
        ],
        crops: [
          { id: 'vegetables', name: 'Vegetables', emoji: '🥕', correctSoil: 'high-demand', growthTime: 2 },
          { id: 'flowers', name: 'Flowers', emoji: '🌸', correctSoil: 'export', growthTime: 3 },
          { id: 'fruits', name: 'Fruits', emoji: '🍎', correctSoil: 'local', growthTime: 5 }
        ],
        correctCombinations: { 'high-demand': 'vegetables', 'export': 'flowers', 'local': 'fruits' },
        hint: 'Vegetables are always in demand, flowers export well!'
      }
    ]
  },
  {
    id: 8,
    title: 'Climate Adaptation',
    description: 'Adapt farming to changing climate',
    difficulty: 'Expert',
    xpReward: 225,
    icon: '🌡️',
    persona: 'dr-flora',
    type: 'plant-tools',
    unlockRequirement: 8,
    area: 'climate-zone',
    stages: [
      {
        id: 'climate-resilience',
        name: 'Climate-Smart Farming',
        instruction: 'The climate is changing! Choose resilient crops and adaptive techniques.',
        type: 'plant',
        plots: [
          { id: 'drought-zone', type: 'Drought Zone', emoji: '🏜️', description: 'Low rainfall area', color: 'bg-yellow-600' },
          { id: 'flood-zone', type: 'Flood Prone', emoji: '🌊', description: 'High rainfall risk', color: 'bg-blue-600' },
          { id: 'heat-zone', type: 'Heat Stress', emoji: '🔥', description: 'High temperature area', color: 'bg-red-500' }
        ],
        crops: [
          { id: 'drought-resistant', name: 'Sorghum', emoji: '🌾', correctSoil: 'drought-zone', growthTime: 4 },
          { id: 'flood-tolerant', name: 'Rice Varieties', emoji: '🌾', correctSoil: 'flood-zone', growthTime: 5 },
          { id: 'heat-tolerant', name: 'Millet', emoji: '🌿', correctSoil: 'heat-zone', growthTime: 3 }
        ],
        correctCombinations: { 'drought-zone': 'drought-resistant', 'flood-zone': 'flood-tolerant', 'heat-zone': 'heat-tolerant' },
        hint: 'Choose crops that can handle extreme weather!'
      }
    ]
  },
  {
    id: 9,
    title: 'Technology Integration',
    description: 'Use modern technology in farming',
    difficulty: 'Expert',
    xpReward: 250,
    icon: '📱',
    persona: 'kiptoo',
    type: 'tools-only',
    unlockRequirement: 9,
    area: 'tech-hub',
    stages: [
      {
        id: 'smart-farming',
        name: 'Smart Farming Tools',
        instruction: 'Welcome to the future! Use technology to optimize your farming.',
        type: 'tools',
        plots: [
          { id: 'monitoring', type: 'Crop Monitoring', emoji: '📊', description: 'Track crop health', color: 'bg-purple-500' },
          { id: 'automation', type: 'Automated Systems', emoji: '🤖', description: 'Automated farming', color: 'bg-cyan-500' },
          { id: 'precision', type: 'Precision Agriculture', emoji: '🎯', description: 'Exact resource use', color: 'bg-green-500' }
        ],
        tools: [
          { id: 'sensors', name: 'IoT Sensors', emoji: '📡', description: 'Monitor soil and weather', useCase: 'Data collection', correctFor: ['monitoring'] },
          { id: 'drones', name: 'Farming Drones', emoji: '🚁', description: 'Automated operations', useCase: 'Autonomous farming', correctFor: ['automation'] },
          { id: 'gps', name: 'GPS Systems', emoji: '🛰️', description: 'Precise field mapping', useCase: 'Precision farming', correctFor: ['precision'] }
        ],
        correctCombinations: { 'monitoring': 'sensors', 'automation': 'drones', 'precision': 'gps' },
        hint: 'Technology helps farmers make better decisions!'
      }
    ]
  },
  {
    id: 10,
    title: 'Farm Management',
    description: 'Master complete farm operations',
    difficulty: 'Expert',
    xpReward: 300,
    icon: '🏆',
    persona: 'mama-amina',
    type: 'simulation',
    unlockRequirement: 10,
    area: 'master-farm',
    stages: [
      {
        id: 'complete-farm',
        name: 'Run Your Farm',
        instruction: 'You\'ve learned so much! Now manage a complete farm with all your knowledge.',
        type: 'simulation',
        plots: [
          { id: 'crop-section', type: 'Crop Production', emoji: '🌾', description: 'Main crop growing area', color: 'bg-green-600' },
          { id: 'livestock-section', type: 'Livestock Area', emoji: '🐄', description: 'Animal farming zone', color: 'bg-brown-400' },
          { id: 'processing-section', type: 'Processing Unit', emoji: '🏭', description: 'Value addition area', color: 'bg-gray-500' }
        ],
        tools: [
          { id: 'integrated-system', name: 'Integrated Farming', emoji: '🔄', description: 'Crops + Livestock + Processing', useCase: 'Complete farm system', correctFor: ['crop-section', 'livestock-section', 'processing-section'] }
        ],
        correctCombinations: { 
          'crop-section': 'integrated-system', 
          'livestock-section': 'integrated-system', 
          'processing-section': 'integrated-system' 
        },
        hint: 'A successful farm integrates all systems together!'
      }
    ]
  }
];

export const BADGES = [
  { id: 'soil-pro', name: 'Soil Pro', emoji: '🌍', description: 'Mastered soil basics', unlockLevel: 1 },
  { id: 'weather-wise', name: 'Weather Wise', emoji: '🌦️', description: 'Weather expert', unlockLevel: 2 },
  { id: 'tool-master', name: 'Tool Master', emoji: '🚜', description: 'Equipment specialist', unlockLevel: 3 },
  { id: 'water-wizard', name: 'Water Wizard', emoji: '💧', description: 'Irrigation expert', unlockLevel: 4 },
  { id: 'rotation-guru', name: 'Rotation Guru', emoji: '🔄', description: 'Sustainable farming', unlockLevel: 5 },
  { id: 'pest-defender', name: 'Pest Defender', emoji: '🐞', description: 'Natural pest control', unlockLevel: 6 },
  { id: 'market-genius', name: 'Market Genius', emoji: '📈', description: 'Business-minded farmer', unlockLevel: 7 },
  { id: 'climate-champion', name: 'Climate Champion', emoji: '🌡️', description: 'Climate adaptation expert', unlockLevel: 8 },
  { id: 'tech-pioneer', name: 'Tech Pioneer', emoji: '📱', description: 'Modern farming technology', unlockLevel: 9 },
  { id: 'farm-master', name: 'Farm Master', emoji: '🏆', description: 'Complete farm management', unlockLevel: 10 }
];

export const RANKS = [
  { id: 'rookie', name: 'Rookie Farmer', emoji: '🌱', minXP: 0, color: 'text-green-600' },
  { id: 'local', name: 'Local Farmer', emoji: '🚜', minXP: 200, color: 'text-blue-600' },
  { id: 'regional', name: 'Regional Farmer', emoji: '🌾', minXP: 500, color: 'text-purple-600' },
  { id: 'smart', name: 'Smart Farmer', emoji: '🎯', minXP: 1000, color: 'text-orange-600' },
  { id: 'master', name: 'Master Farmer', emoji: '🏆', minXP: 2000, color: 'text-yellow-600' }
];

export function getLevelById(levelId: number): Level | undefined {
  return LEVELS.find(level => level.id === levelId);
}

export function getPlayerRank(xp: number) {
  const ranks = [...RANKS].reverse();
  return ranks.find(rank => xp >= rank.minXP) || RANKS[0];
}

export function getAvailableBadges(level: number) {
  return BADGES.filter(badge => badge.unlockLevel <= level);
}