import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface EnvironmentalData {
  soilType: {
    emoji: string;
    name: string;
    color: string;
    description: string;
    benefits: string[];
    challenges: string[];
  };
  weather: {
    emoji: string;
    name: string;
    color: string;
    description: string;
    tips: string[];
  };
  climate: {
    emoji: string;
    name: string;
    color: string;
    description: string;
    crops: string[];
  };
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

export async function getEnvironmentalAnalysis(location: string, coordinates?: LocationCoordinates): Promise<EnvironmentalData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are an expert agricultural consultant specializing in smart farming and environmental analysis. Please provide a detailed environmental analysis for the location: "${location}"${coordinates ? ` (coordinates: ${coordinates.lat}, ${coordinates.lng})` : ''}.

Please respond with a structured JSON object following this EXACT format:

{
  "soilType": {
    "emoji": "🟫",
    "name": "Clay Soil",
    "color": "amber",
    "description": "Brief description of the soil type and its characteristics",
    "benefits": ["benefit 1", "benefit 2", "benefit 3"],
    "challenges": ["challenge 1", "challenge 2", "challenge 3"]
  },
  "weather": {
    "emoji": "⛅",
    "name": "Moderate Weather",
    "color": "green",
    "description": "Brief description of the weather patterns",
    "tips": ["tip 1", "tip 2", "tip 3"]
  },
  "climate": {
    "emoji": "⛰️",
    "name": "Highland Climate",
    "color": "purple",
    "description": "Brief description of the climate conditions",
    "crops": ["crop 1", "crop 2", "crop 3", "crop 4"]
  }
}

IMPORTANT REQUIREMENTS:
1. Use appropriate emojis for each category (soil, weather, climate)
2. Use these color options only: "amber", "yellow", "orange", "blue", "green", "purple", "cyan"
3. Provide 3 benefits and 3 challenges for soil
4. Provide 3 tips for weather
5. Provide 4 recommended crops for climate
6. Base your analysis on real agricultural knowledge for the specific location
7. Focus on practical farming advice
8. Return ONLY the JSON object, no additional text or explanations

Location context: ${location}
${coordinates ? `Geographic coordinates: ${coordinates.lat}, ${coordinates.lng}` : ''}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const environmentalData = JSON.parse(jsonMatch[0]);
    
    // Validate the structure
    if (!environmentalData.soilType || !environmentalData.weather || !environmentalData.climate) {
      throw new Error('Invalid response structure');
    }
    
    return environmentalData as EnvironmentalData;
  } catch (error) {
    console.error('Error getting environmental analysis:', error);
    
    // Return fallback data for the location
    return getFallbackEnvironmentalData(location);
  }
}

function getFallbackEnvironmentalData(location: string): EnvironmentalData {
  // Fallback data based on common patterns
  const locationLower = location.toLowerCase();
  
  if (locationLower.includes('nairobi') || locationLower.includes('highland')) {
    return {
      soilType: {
        emoji: '🟫',
        name: 'Clay Soil',
        color: 'amber',
        description: 'Rich, holds water well, perfect for crops like maize and beans',
        benefits: ['High water retention', 'Rich in nutrients', 'Good for root crops'],
        challenges: ['Can become waterlogged', 'Hard when dry', 'Slow drainage']
      },
      weather: {
        emoji: '⛅',
        name: 'Moderate Weather',
        color: 'green',
        description: 'Balanced conditions, ideal for diverse crop varieties',
        tips: ['Perfect for mixed farming', 'Good for most vegetables', 'Maintain regular watering']
      },
      climate: {
        emoji: '⛰️',
        name: 'Highland Climate',
        color: 'purple',
        description: 'Cool temperatures, great for grains and vegetables',
        crops: ['Maize', 'Wheat', 'Potatoes', 'Cabbage']
      }
    };
  } else if (locationLower.includes('mombasa') || locationLower.includes('coastal')) {
    return {
      soilType: {
        emoji: '🟨',
        name: 'Sandy Soil',
        color: 'yellow',
        description: 'Drains quickly, warms up fast, ideal for quick-growing crops',
        benefits: ['Good drainage', 'Easy to work', 'Warms up quickly'],
        challenges: ['Low water retention', 'Needs frequent watering', 'Low nutrients']
      },
      weather: {
        emoji: '🌧️',
        name: 'Rainy Season',
        color: 'blue',
        description: 'High rainfall, watch for flooding and plant diseases',
        tips: ['Ensure good drainage', 'Watch for fungal diseases', 'Plant water-loving crops']
      },
      climate: {
        emoji: '🏖️',
        name: 'Coastal Climate',
        color: 'cyan',
        description: 'Warm and humid, perfect for tropical crops',
        crops: ['Coconuts', 'Cashews', 'Mangoes', 'Cassava']
      }
    };
  } else {
    // Default fallback
    return {
      soilType: {
        emoji: '🟤',
        name: 'Loamy Soil',
        color: 'orange',
        description: 'Perfect balance of sand, silt, and clay - ideal for most crops',
        benefits: ['Balanced drainage', 'High fertility', 'Excellent structure'],
        challenges: ['Can be expensive', 'Needs maintenance', 'May compact over time']
      },
      weather: {
        emoji: '☀️',
        name: 'Dry Season',
        color: 'orange',
        description: 'Low rainfall, requires irrigation and drought-resistant crops',
        tips: ['Use drip irrigation', 'Plant drought-resistant varieties', 'Mulch to retain moisture']
      },
      climate: {
        emoji: '🌴',
        name: 'Tropical Climate',
        color: 'green',
        description: 'Hot and humid, ideal for tropical agriculture',
        crops: ['Bananas', 'Coffee', 'Sugarcane', 'Pineapples']
      }
    };
  }
}

