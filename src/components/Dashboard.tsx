import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Cloud, CloudRain, Sun, Wind, Coins, TrendingUp, MapPin, Users, Clock, Thermometer, Droplets } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCopilot } from "./CopilotContext";
import { AuthContext } from "../contexts/AuthContext";

interface DashboardData {
  firstName: string;
  lastName: string;
  creditPoints: number;
  farmHealth: number;
  activeNeighbors: number;
  nearestMarket: {
    name: string;
    distance: number;
  };
}

interface WeatherData {
  date: string;
  high: number;
  low: number;
  condition: string;
  humidity: number;
  rainChance: number;
}

interface SoilData {
  moisture: number;
  nitrogen: number;
  ph: number;
  temperature: number;
}

interface Recommendation {
  id: number;
  priority: string;
  title: string;
  description: string;
  type: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { handleElementClick } = useCopilot();
  const auth = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user's ID from context (we'll need to modify AuthContext to store user ID)
  const user = auth?.user as any; // Type assertion for now

  // If no user, don't render anything (ProtectedRoute will handle redirect)
  if (user === null) {
    return (
      <div className="space-y-6">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard data (user info and metrics)
        const dashboardResponse = await fetch(`http://127.0.0.1:5000/dashboard/${user.userId || user.id}`);
        const dashboardData = await dashboardResponse.json();
        setDashboardData(dashboardData);

        // Fetch weather data
        const weatherResponse = await fetch('http://127.0.0.1:5000/weather-forecast');
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          // Ensure it's always an array
          setWeatherData(Array.isArray(weatherData) ? weatherData : []);
        } else {
          setWeatherData([]);
        }

        // Fetch soil conditions
        const soilResponse = await fetch(`http://127.0.0.1:5000/soil-conditions/${user.userId || user.id}`);
        const soilData = await soilResponse.json();
        setSoilData(soilData);

        // Fetch AI recommendations
        const recResponse = await fetch(`http://127.0.0.1:5000/ai-recommendations/${user.userId || user.id}`);
        const recData = await recResponse.json();
        setRecommendations(recData.recommendations);

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else if (lowerCondition.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (lowerCondition.includes('wind')) {
      return <Wind className="h-8 w-8 text-gray-400" />;
    }
    return <Cloud className="h-8 w-8 text-gray-500" />;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };

  // Get today's weather for overlays
  const todaysWeather = weatherData.length > 0 ? weatherData[0] : null;
  const mondayWeather = weatherData.find(w => new Date(w.date).getDay() === 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Loading your farm data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1>Dashboard</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, {dashboardData ? `${dashboardData.firstName} ${dashboardData.lastName}` : 'Farmer'}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your farm today
        </p>
      </div>

      {/* Earth View with Annotated Data */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Live Farm View - Satellite Data</CardTitle>
          <CardDescription>Real-time environmental data overlayed on your land</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <SatelliteView />
            
            {/* Data Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Left - Time & Date */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentTime}</span>
                </div>
                <p className="text-xs opacity-80">{currentDate}</p>
              </div>

              {/* Top Right - Weather Prediction */}
              <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  <span className="font-medium">Today's Weather</span>
                </div>
                <p className="text-sm">{todaysWeather?.condition || "Clear Skies"}</p>
                <p className="text-xs">{todaysWeather ? `${todaysWeather.high}°C / ${todaysWeather.low}°C` : "28°C / 18°C"}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                  {mondayWeather && mondayWeather.rainChance > 0 && (
                    <>
                      <CloudRain className="h-4 w-4" />
                      <span className="text-xs">Rain expected Monday</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Left - Temperature Data */}
              <div className="absolute bottom-4 left-4 bg-red-600/90 backdrop-blur-sm text-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-5 w-5" />
                  <span className="font-medium">Temperature</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Air:</span>
                    <span className="text-sm font-medium">{todaysWeather?.high || 28}°C</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Soil:</span>
                    <span className="text-sm font-medium">{soilData?.temperature || 22}°C</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Crop:</span>
                    <span className="text-sm font-medium">{Math.round((todaysWeather?.high || 28) * 0.8 + (soilData?.temperature || 22) * 0.2)}°C</span>
                  </div>
                </div>
              </div>

              {/* Bottom Center - Humidity Data */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cyan-600/90 backdrop-blur-sm text-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-5 w-5" />
                  <span className="font-medium">Humidity & Moisture</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Air Humidity:</span>
                    <span className="text-sm font-medium">{todaysWeather?.humidity || 65}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Soil Moisture:</span>
                    <span className="text-sm font-medium">{soilData?.moisture || 78}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Right - Farm Zones */}
              <div className="absolute bottom-4 right-4 bg-green-600/90 backdrop-blur-sm text-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Active Zones</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Zone A: Wheat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Zone B: Corn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Zone C: Vegetables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Zone D: Fallow</span>
                  </div>
                </div>
              </div>

              {/* Center - Land Annotations */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Zone markers */}
                  <div className="absolute -top-20 -left-16 bg-green-500/80 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
                    A
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>
                  </div>
                  <div className="absolute -top-12 left-20 bg-green-500/80 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
                    B
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="absolute top-16 -left-20 bg-yellow-500/80 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
                    C
                    <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="absolute top-20 left-16 bg-gray-500/80 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
                    D
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Credit Points", { points: dashboardData?.creditPoints, rank: "Gold", nextRank: "Platinum" })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Credit Points</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.creditPoints.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Farm Health", { health: dashboardData?.farmHealth, status: "Optimal" })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Farm Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.farmHealth || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Optimal conditions detected
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Active Neighbors", { count: dashboardData?.activeNeighbors, opportunities: 3 })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Neighbors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.activeNeighbors || 0}</div>
            <p className="text-xs text-muted-foreground">
              Farmers collaborating nearby
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Nearest Market", { name: dashboardData?.nearestMarket.name, distance: `${dashboardData?.nearestMarket.distance}km` })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nearest Market</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.nearestMarket.distance || 0} km</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.nearestMarket.name || "Market"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500/50"
          onClick={() => handleElementClick("7-Day Weather Forecast", { current: "28°C Clear", tomorrow: "26°C Cloudy", upcoming: "Rain Monday" })}
        >
          <CardHeader>
            <CardTitle>7-Day Weather Forecast</CardTitle>
            <CardDescription>Based on satellite data and AI predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherData.slice(0, 4).map((weather, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(weather.condition)}
                    <div>
                      <p className="font-medium">{formatDate(weather.date)}</p>
                      <p className="text-sm text-muted-foreground">{weather.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{weather.high}°C / {weather.low}°C</p>
                    <p className="text-sm text-muted-foreground">Humidity: {weather.humidity}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:border-green-500/50"
          onClick={() => handleElementClick("Soil Conditions", { moisture: "78%", nitrogen: "65%", pH: "6.5", temp: "22°C" })}
        >
          <CardHeader>
            <CardTitle>Soil Conditions</CardTitle>
            <CardDescription>Real-time satellite analysis for your land</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Soil Moisture</span>
                <span className="font-medium">{soilData?.moisture || 78}%</span>
              </div>
              <Progress value={soilData?.moisture || 78} className="h-2" />
              <p className="text-xs text-muted-foreground">Optimal for wheat</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nitrogen Level</span>
                <span className="font-medium">{soilData?.nitrogen || 65}%</span>
              </div>
              <Progress value={soilData?.nitrogen || 65} className="h-2" />
              <p className="text-xs text-muted-foreground">Good condition</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>pH Balance</span>
                <span className="font-medium">{soilData?.ph || 6.5}</span>
              </div>
              <Progress value={(soilData?.ph || 6.5) * 10} className="h-2" />
              <p className="text-xs text-muted-foreground">Ideal for most crops</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Temperature</span>
                <span className="font-medium">{soilData?.temperature || 22}°C</span>
              </div>
              <Progress value={(soilData?.temperature || 22) / 40 * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">Perfect for growth</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card 
        className="cursor-pointer transition-all hover:shadow-lg hover:border-purple-500/50"
        onClick={() => handleElementClick("AI Recommendations for This Week", { recommendations: 3, priority: "High" })}
      >
        <CardHeader>
          <CardTitle>AI Recommendations for This Week</CardTitle>
          <CardDescription>Based on geospatial data and market analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const getBgColor = () => {
                if (rec.priority === "High") return "bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900";
                if (rec.priority === "Medium") return "bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900";
                return "bg-yellow-50 dark:bg-yellow-950 hover:bg-yellow-100 dark:hover:bg-yellow-900";
              };

              const getBadgeColor = () => {
                if (rec.priority === "High") return "bg-green-600";
                if (rec.priority === "Medium") return "bg-blue-600";
                return "bg-yellow-600";
              };

              return (
                <div
                  key={rec.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${getBgColor()}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementClick(`${rec.title}`, { ...rec });
                  }}
                >
                  <Badge className={getBadgeColor()}>
                    {rec.priority === "Watch" ? "Watch" : `${rec.priority} Priority`}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
