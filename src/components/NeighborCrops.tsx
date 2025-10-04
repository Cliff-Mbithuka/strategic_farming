import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Users, MapPin, TrendingUp, MessageCircle, Award } from "lucide-react";
import { Progress } from "./ui/progress";

export function NeighborCrops() {
  const neighbors = [
    {
      name: "Maria Santos",
      distance: "2.3 km",
      crops: "Tomatoes, Peppers",
      area: "15 ha",
      collaboration: "Active",
      points: 890,
      initials: "MS",
      status: "Currently planting tomatoes for spring harvest"
    },
    {
      name: "David Chen",
      distance: "3.1 km",
      crops: "Corn, Soybeans",
      area: "22 ha",
      collaboration: "Active",
      points: 1240,
      initials: "DC",
      status: "Harvesting corn - excellent yield this season"
    },
    {
      name: "Ana Rodriguez",
      distance: "1.8 km",
      crops: "Wheat, Barley",
      area: "18 ha",
      collaboration: "Active",
      points: 1050,
      initials: "AR",
      status: "Wheat ready for harvest next week"
    },
    {
      name: "James Wilson",
      distance: "4.5 km",
      crops: "Vegetables, Herbs",
      area: "8 ha",
      collaboration: "Pending",
      points: 620,
      initials: "JW",
      status: "Growing organic vegetables for local market"
    },
    {
      name: "Priya Patel",
      distance: "5.2 km",
      crops: "Rice, Lentils",
      area: "25 ha",
      collaboration: "Active",
      points: 1380,
      initials: "PP",
      status: "Rice fields showing excellent growth patterns"
    },
  ];

  const collaborationOpportunities = [
    {
      title: "Joint Pest Control Initiative",
      participants: ["Maria Santos", "Ana Rodriguez", "You"],
      reward: 200,
      description: "Coordinate pest control measures across 3 adjacent farms. Satellite data shows aphid activity increasing in the region.",
      deadline: "3 days"
    },
    {
      title: "Bulk Equipment Rental",
      participants: ["David Chen", "Priya Patel", "You"],
      reward: 150,
      description: "Share harvesting equipment to reduce costs. Estimated savings of KSH 800 per farmer.",
      deadline: "5 days"
    },
    {
      title: "Market Coordination",
      participants: ["Maria Santos", "James Wilson", "You"],
      reward: 180,
      description: "Combine produce for better market prices. Collective bargaining increases profit by 15%.",
      deadline: "1 week"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Neighbor Collaboration</h1>
        <p className="text-muted-foreground">
          Connect with nearby farmers and optimize together
        </p>
      </div>

      {/* Collaboration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Neighbors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Within 10 km radius
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Collaboration Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+85</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Shared Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH 2,340</div>
            <p className="text-xs text-muted-foreground">
              Through collaboration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collaboration Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Available Collaboration Opportunities</CardTitle>
          <CardDescription>Earn credit points and optimize farming practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {collaborationOpportunities.map((opportunity, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{opportunity.title}</h3>
                    <Badge className="bg-green-600">
                      +{opportunity.reward} points
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {opportunity.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{opportunity.participants.join(", ")}</span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs text-muted-foreground">Deadline: {opportunity.deadline}</p>
                  <Button size="sm">Join</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Neighbor List */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Farmers</CardTitle>
          <CardDescription>See what your neighbors are growing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {neighbors.map((neighbor, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{neighbor.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{neighbor.name}</h3>
                        <Badge variant={neighbor.collaboration === "Active" ? "default" : "outline"}>
                          {neighbor.collaboration}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {neighbor.distance} away
                        </span>
                        <span>• {neighbor.area}</span>
                        <span>• {neighbor.points} points</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{neighbor.status}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{neighbor.crops}</Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      View Farm
                    </Button>
                    {neighbor.collaboration === "Pending" && (
                      <Button size="sm">Connect</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Crop Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Crop Distribution</CardTitle>
          <CardDescription>What's being grown in your area (10km radius)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Wheat & Grains</span>
                <span className="font-medium">35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vegetables</span>
                <span className="font-medium">25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Corn & Soybeans</span>
                <span className="font-medium">22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rice & Lentils</span>
                <span className="font-medium">12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Other Crops</span>
                <span className="font-medium">6%</span>
              </div>
              <Progress value={6} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
