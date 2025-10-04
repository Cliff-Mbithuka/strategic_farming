import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Coins, Award, TrendingUp, Gift, CheckCircle, Clock, Users, Leaf } from "lucide-react";
import { Progress } from "./ui/progress";

export function CreditSystem() {
  const recentTransactions = [
    {
      type: "earned",
      amount: 200,
      description: "Joint pest control collaboration",
      date: "Oct 3, 2025",
      participants: ["Maria Santos", "Ana Rodriguez"]
    },
    {
      type: "earned",
      amount: 85,
      description: "Followed AI planting recommendation",
      date: "Oct 2, 2025"
    },
    {
      type: "redeemed",
      amount: -150,
      description: "Premium market analysis report",
      date: "Oct 1, 2025"
    },
    {
      type: "earned",
      amount: 120,
      description: "Sustainable farming practice bonus",
      date: "Sep 30, 2025"
    },
    {
      type: "earned",
      amount: 50,
      description: "Shared equipment with neighbor",
      date: "Sep 28, 2025",
      participants: ["David Chen"]
    },
    {
      type: "redeemed",
      amount: -100,
      description: "Unlocked advanced satellite features",
      date: "Sep 25, 2025"
    }
  ];

  const earnOpportunities = [
    {
      title: "Complete Weekly AI Challenge",
      points: 100,
      deadline: "3 days",
      description: "Follow AI recommendations for your farm this week",
      difficulty: "Easy"
    },
    {
      title: "Achieve 90% Crop Yield Target",
      points: 250,
      deadline: "30 days",
      description: "Meet or exceed predicted yield based on satellite data",
      difficulty: "Medium"
    },
    {
      title: "Zero-Waste Farming Week",
      points: 180,
      deadline: "7 days",
      description: "Implement sustainable practices with zero waste",
      difficulty: "Medium"
    },
    {
      title: "Help 5 Neighbors",
      points: 300,
      deadline: "14 days",
      description: "Share knowledge or resources with other farmers",
      difficulty: "Hard"
    }
  ];

  const rewards = [
    {
      name: "Premium Weather Forecast",
      cost: 200,
      description: "15-day detailed forecast with hourly data",
      category: "Weather"
    },
    {
      name: "Advanced Soil Analysis",
      cost: 300,
      description: "Deep soil composition and nutrient mapping",
      category: "Analysis"
    },
    {
      name: "Market Priority Listing",
      cost: 250,
      description: "Featured listing in all nearby markets for 30 days",
      category: "Market"
    },
    {
      name: "Equipment Rental Discount",
      cost: 150,
      description: "20% off on next equipment rental",
      category: "Equipment"
    },
    {
      name: "Expert Consultation",
      cost: 500,
      description: "1-hour video call with agricultural expert",
      category: "Consultation"
    },
    {
      name: "Bulk Purchase Discount",
      cost: 180,
      description: "15% off on fertilizer and seed purchases",
      category: "Supplies"
    }
  ];

  const achievements = [
    { name: "Early Adopter", icon: Award, earned: true },
    { name: "Collaboration Master", icon: Users, earned: true },
    { name: "Eco Warrior", icon: Leaf, earned: true },
    { name: "Market Expert", icon: TrendingUp, earned: false },
    { name: "Tech Savvy", icon: CheckCircle, earned: false }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Credit Points System</h1>
        <p className="text-muted-foreground">
          Earn points through smart farming and unlock rewards
        </p>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Points</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+155</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Points Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,890</div>
            <p className="text-xs text-muted-foreground">
              Lifetime total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Points Redeemed</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,643</div>
            <p className="text-xs text-muted-foreground">
              On rewards & features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Rank</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Gold</div>
            <p className="text-xs text-muted-foreground">
              Top 15% of farmers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Rank Progress</CardTitle>
          <CardDescription>353 points to reach Platinum rank</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gold Rank</span>
              <span className="font-medium">1,247 / 1,600 points</span>
            </div>
            <Progress value={77.9} className="h-3" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-xs text-muted-foreground">Bronze</p>
              <p className="text-sm font-semibold mt-1">✓ 0</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-xs text-muted-foreground">Silver</p>
              <p className="text-sm font-semibold mt-1">✓ 500</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-2 border-yellow-600">
              <p className="text-xs text-muted-foreground">Gold</p>
              <p className="text-sm font-semibold mt-1">→ 1,000</p>
            </div>
            <div className="text-center p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground">Platinum</p>
              <p className="text-sm font-semibold mt-1">1,600</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earn Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Ways to Earn Points</CardTitle>
          <CardDescription>Complete challenges and follow best practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {earnOpportunities.map((opportunity, index) => (
            <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{opportunity.title}</h3>
                  <Badge className="bg-green-600">+{opportunity.points} points</Badge>
                  <Badge variant="outline">{opportunity.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Deadline: {opportunity.deadline}</span>
                </div>
              </div>
              <Button>Start</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rewards Store */}
        <Card>
          <CardHeader>
            <CardTitle>Rewards Store</CardTitle>
            <CardDescription>Redeem your points for valuable features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{reward.name}</p>
                    <Badge variant="secondary" className="text-xs">{reward.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-yellow-600">{reward.cost}</p>
                  <p className="text-xs text-muted-foreground mb-2">points</p>
                  <Button size="sm" variant="outline" disabled={reward.cost > 1247}>
                    Redeem
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity & Achievements */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your point activity history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "earned" ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"
                      }`}>
                        {transaction.type === "earned" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <Gift className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{transaction.description}</p>
                        {transaction.participants && (
                          <p className="text-xs text-muted-foreground">
                            With: {transaction.participants.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === "earned" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Unlock badges and bonuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg text-center ${
                        achievement.earned 
                          ? "bg-green-50 dark:bg-green-950 border-2 border-green-600" 
                          : "bg-secondary opacity-50"
                      }`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        achievement.earned ? "text-green-600" : "text-muted-foreground"
                      }`} />
                      <p className="text-xs font-medium">{achievement.name}</p>
                      {achievement.earned && (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}