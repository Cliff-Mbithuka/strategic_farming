import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, TrendingUp, TrendingDown, MapPin, DollarSign, Users, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function MarketPlace() {
  const nearbyMarkets = [
    {
      name: "Green Valley Market",
      distance: "12 km",
      demands: [
        { crop: "Tomatoes", price: "KSH 675/kg", trend: "up", demand: "High" },
        { crop: "Wheat", price: "KSH 128/kg", trend: "stable", demand: "Medium" },
        { crop: "Corn", price: "KSH 180/kg", trend: "up", demand: "High" }
      ],
      buyers: 45,
      rating: 4.8
    },
    {
      name: "Central City Wholesale",
      distance: "28 km",
      demands: [
        { crop: "Vegetables", price: "KSH 480/kg", trend: "up", demand: "High" },
        { crop: "Rice", price: "KSH 225/kg", trend: "down", demand: "Low" },
        { crop: "Peppers", price: "KSH 870/kg", trend: "up", demand: "Very High" }
      ],
      buyers: 120,
      rating: 4.6
    },
    {
      name: "Farmer's Direct Co-op",
      distance: "18 km",
      demands: [
        { crop: "Organic Wheat", price: "KSH 180/kg", trend: "up", demand: "Medium" },
        { crop: "Soybeans", price: "KSH 210/kg", trend: "stable", demand: "Medium" },
        { crop: "Lentils", price: "KSH 345/kg", trend: "up", demand: "High" }
      ],
      buyers: 32,
      rating: 4.9
    }
  ];

  const priceAnalysis = [
    { crop: "Tomatoes", currentPrice: "KSH 675", lastWeek: "KSH 630", change: "+7.1%", forecast: "Increasing" },
    { crop: "Wheat", currentPrice: "KSH 128", lastWeek: "KSH 131", change: "-2.3%", forecast: "Stable" },
    { crop: "Corn", currentPrice: "KSH 180", lastWeek: "KSH 173", change: "+4.3%", forecast: "Increasing" },
    { crop: "Peppers", currentPrice: "KSH 870", lastWeek: "KSH 825", change: "+5.5%", forecast: "Increasing" },
    { crop: "Rice", currentPrice: "KSH 225", lastWeek: "KSH 248", change: "-9.1%", forecast: "Decreasing" }
  ];

  const recommendations = [
    {
      title: "High Demand: Tomatoes at Green Valley Market",
      description: "Current price: KSH 675/kg, 7.1% above last week. High demand expected for next 2 weeks.",
      potential: "KSH 427,500",
      action: "Harvest and sell now"
    },
    {
      title: "Bulk Opportunity: Peppers at Central City",
      description: "Very high demand with premium pricing. 5 buyers actively seeking suppliers.",
      potential: "KSH 480,000",
      action: "Contact buyers"
    },
    {
      title: "Collaborative Sale: Wheat with 3 neighbors",
      description: "Combine harvest with nearby farmers for better negotiating power. +12% price increase.",
      potential: "KSH 292,500",
      action: "Join collaboration"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Market Place</h1>
        <p className="text-muted-foreground">
          Connect with buyers and find the best prices for your crops
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nearby Markets</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Within 50 km radius
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">197</div>
            <p className="text-xs text-muted-foreground">
              Looking for suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Potential Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH 1,200,000</div>
            <p className="text-xs text-muted-foreground">
              From current harvest
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Market Banner */}
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1526399743290-f73cb4022f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0fGVufDF8fHx8MTc1OTU1ODk4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Farmers market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">Smart Market Connections</h2>
              <p className="text-lg opacity-90">Find the best prices and reduce transport costs</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Market Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Selling Opportunities</CardTitle>
          <CardDescription>AI-powered recommendations based on your crops and market data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">
                      Potential: {rec.potential}
                    </Badge>
                  </div>
                </div>
                <Button>
                  {rec.action}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Nearby Markets */}
      <div className="space-y-4">
        <h2>Nearby Markets</h2>
        {nearbyMarkets.map((market, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{market.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {market.distance} away • {market.buyers} active buyers • ★ {market.rating}
                  </CardDescription>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="font-medium">Current Demands & Prices</p>
                {market.demands.map((demand, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{demand.crop}</p>
                        <p className="text-sm text-muted-foreground">Demand: {demand.demand}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">{demand.price}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {demand.trend === "up" && (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">Rising</span>
                            </>
                          )}
                          {demand.trend === "down" && (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-600" />
                              <span className="text-red-600">Falling</span>
                            </>
                          )}
                          {demand.trend === "stable" && (
                            <span className="text-muted-foreground">Stable</span>
                          )}
                        </div>
                      </div>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Sell
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Price Analysis & Forecast</CardTitle>
          <CardDescription>Track market trends for better selling decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priceAnalysis.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.crop}</p>
                  <p className="text-sm text-muted-foreground">Last week: {item.lastWeek}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{item.currentPrice}</p>
                    <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </p>
                  </div>
                  <Badge variant="outline" className="w-24 justify-center">
                    {item.forecast}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
