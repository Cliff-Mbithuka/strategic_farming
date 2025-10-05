# Gemini API Setup Instructions

## 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## 2. Configure Your Environment

Create a `.env` file in the project root with your API key:

```bash
# Create .env file in the project root
echo "VITE_GEMINI_API_KEY=your_actual_api_key_here" > .env
```

**Important**: Replace `your_actual_api_key_here` with your actual Gemini API key.

## 3. File Location

The `.env` file should be located at:
```
C:\Users\John\Documents\Nasa Hackathon\NasaAppChallenge\Game\.env
```

## 4. Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## 5. How It Works

- The Environmental Analysis page now queries the Gemini AI API for location-specific farming recommendations
- The system sends the location name and coordinates to Gemini
- Gemini returns structured environmental data including:
  - Soil type and characteristics
  - Weather patterns and tips
  - Climate conditions and recommended crops
- If the API fails, the system falls back to hardcoded data

## 6. Testing

1. Select a location on the map
2. The Environmental Analysis page will show a loading state
3. Once loaded, you'll see AI-powered recommendations specific to that location
4. The page will indicate "(AI-Powered Analysis)" when using LLM data

## 7. Troubleshooting

- **"Failed to load environmental analysis"**: Check your API key and internet connection
- **Loading indefinitely**: Verify your API key is correct and has proper permissions
- **No coordinates**: The system works with location names alone, but coordinates provide more accurate analysis

## 8. API Usage

The system queries Gemini with a structured prompt that requests:
- Soil analysis (type, benefits, challenges)
- Weather patterns (conditions, tips)
- Climate recommendations (suitable crops)

All responses are formatted as JSON and validated before display.

