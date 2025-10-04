import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Cloud, CloudRain, Sun, Wind, Coins, TrendingUp, MapPin, Users, Clock, Thermometer, Droplets } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCopilot } from "./CopilotContext";

export function Dashboard() {
  const { handleElementClick } = useCopilot();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, Farmer John</h1>
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
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1722080767360-f0640ae8ce2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHNhdGVsbGl0ZSUyMG1hcHxlbnwxfHx8fDE3NTk1NjAyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Satellite view of farm"
              className="w-full h-[400px] object-cover"
            />
            
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
                <p className="text-sm">Clear Skies</p>
                <p className="text-xs">28°C / 18°C</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                  <CloudRain className="h-4 w-4" />
                  <span className="text-xs">Rain expected Monday</span>
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
                    <span className="text-sm font-medium">28°C</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Soil:</span>
                    <span className="text-sm font-medium">22°C</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Crop:</span>
                    <span className="text-sm font-medium">24°C</span>
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
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs">Soil Moisture:</span>
                    <span className="text-sm font-medium">78%</span>
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
          onClick={() => handleElementClick("Credit Points", { points: 1247, rank: "Gold", nextRank: "Platinum" })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Credit Points</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Farm Health", { health: 94, status: "Optimal" })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Farm Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Optimal conditions detected
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Active Neighbors", { count: 23, opportunities: 3 })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Neighbors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Farmers collaborating nearby
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-green-500/50"
          onClick={() => handleElementClick("Nearest Market", { name: "Green Valley Market", distance: "12km" })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nearest Market</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 km</div>
            <p className="text-xs text-muted-foreground">
              Green Valley Market
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">Clear skies</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">28°C / 18°C</p>
                  <p className="text-sm text-muted-foreground">Humidity: 65%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cloud className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="font-medium">Tomorrow</p>
                    <p className="text-sm text-muted-foreground">Partly cloudy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">26°C / 17°C</p>
                  <p className="text-sm text-muted-foreground">Humidity: 70%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudRain className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Monday</p>
                    <p className="text-sm text-muted-foreground">Light rain</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">23°C / 16°C</p>
                  <p className="text-sm text-muted-foreground">Humidity: 85%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wind className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">Tuesday</p>
                    <p className="text-sm text-muted-foreground">Windy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">25°C / 15°C</p>
                  <p className="text-sm text-muted-foreground">Humidity: 60%</p>
                </div>
              </div>
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
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">Optimal for wheat</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nitrogen Level</span>
                <span className="font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">Good condition</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>pH Balance</span>
                <span className="font-medium">6.5</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">Ideal for most crops</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Temperature</span>
                <span className="font-medium">22°C</span>
              </div>
              <Progress value={73} className="h-2" />
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
            <div 
              className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg cursor-pointer transition-all hover:bg-green-100 dark:hover:bg-green-900"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("Tomato Planting Recommendation", { crop: "Tomatoes", priority: "High", price: "$4.50/kg" });
              }}
            >
              <Badge className="bg-green-600">High Priority</Badge>
              <div className="flex-1">
                <p className="font-medium">Optimal planting window for tomatoes</p>
                <p className="text-sm text-muted-foreground">
                  Soil conditions and weather patterns indicate ideal conditions for the next 5 days. Market demand is high with prices at $4.50/kg.
                </p>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg cursor-pointer transition-all hover:bg-blue-100 dark:hover:bg-blue-900"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("Neighbor Collaboration", { neighbors: 3, points: 150 });
              }}
            >
              <Badge className="bg-blue-600">Medium Priority</Badge>
              <div className="flex-1">
                <p className="font-medium">Consider collaboration with 3 nearby farmers</p>
                <p className="text-sm text-muted-foreground">
                  Neighboring farms are planting complementary crops. Coordinating can optimize pest control and earn 150 credit points.
                </p>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg cursor-pointer transition-all hover:bg-yellow-100 dark:hover:bg-yellow-900"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("Pest Risk Alert", { risk: "High", crop: "Corn", action: "Preventive treatment needed" });
              }}
            >
              <Badge className="bg-yellow-600">Watch</Badge>
              <div className="flex-1">
                <p className="font-medium">Pest risk increasing for corn fields</p>
                <p className="text-sm text-muted-foreground">
                  Satellite data shows increased activity in the region. Consider preventive measures within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}