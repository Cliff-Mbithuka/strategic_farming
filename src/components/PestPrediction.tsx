import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Bug, AlertTriangle, CheckCircle, Calendar, Droplets, Thermometer, Wind } from "lucide-react";
import { Progress } from "./ui/progress";

export function PestPrediction() {
  const pestAlerts = [
    {
      pest: "Aphids",
      severity: "high",
      risk: 78,
      affectedCrops: ["Wheat", "Corn"],
      area: "Zone A & B",
      peakDate: "Oct 8-12, 2025",
      preventiveMeasures: [
        "Apply neem oil spray in the early morning",
        "Introduce ladybugs as natural predators",
        "Monitor daily for 7 days",
        "Coordinate with 3 neighboring farms"
      ],
      factors: {
        weather: "High humidity (85%)",
        temperature: "Optimal for breeding (24-28°C)",
        neighborActivity: "2 farms reported sightings",
        historicalData: "Similar pattern last year"
      }
    },
    {
      pest: "Corn Borers",
      severity: "medium",
      risk: 45,
      affectedCrops: ["Corn"],
      area: "Zone B",
      peakDate: "Oct 15-20, 2025",
      preventiveMeasures: [
        "Early planting to avoid peak infestation",
        "Use pheromone traps for monitoring",
        "Consider resistant corn varieties",
        "Proper crop residue management"
      ],
      factors: {
        weather: "Moderate conditions",
        temperature: "Favorable range",
        neighborActivity: "1 farm detected activity",
        historicalData: "Low incidence historically"
      }
    },
    {
      pest: "Locusts",
      severity: "low",
      risk: 18,
      affectedCrops: ["All crops"],
      area: "All zones",
      peakDate: "Oct 25-30, 2025",
      preventiveMeasures: [
        "Regular field monitoring",
        "Maintain communication with regional office",
        "Prepare emergency response plan"
      ],
      factors: {
        weather: "Unfavorable for migration",
        temperature: "Below activity threshold",
        neighborActivity: "No reports",
        historicalData: "Rare in this region"
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-600";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-950";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-950";
      case "low":
        return "bg-green-50 dark:bg-green-950";
      default:
        return "bg-gray-50 dark:bg-gray-950";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Pest Prediction & Management</h1>
        <p className="text-muted-foreground">
          AI-powered pest forecasting based on satellite data and environmental factors
        </p>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">High Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Medium Risk</CardTitle>
            <Bug className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Monitor closely
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Protected Zones</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Zone C & D</div>
            <p className="text-xs text-muted-foreground">
              Low risk currently
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {pestAlerts.map((alert, index) => (
        <Card key={index} className={getSeverityBg(alert.severity)}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>{alert.pest}</CardTitle>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()} RISK
                  </Badge>
                </div>
                <CardDescription>
                  Affecting {alert.affectedCrops.join(", ")} in {alert.area}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Risk Score</p>
                <p className="text-2xl font-bold">{alert.risk}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Risk Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Infestation Risk Level</span>
                <span className="font-medium">{alert.risk}%</span>
              </div>
              <Progress value={alert.risk} className="h-2" />
            </div>

            {/* Peak Activity */}
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>Peak Activity Period</AlertTitle>
              <AlertDescription>{alert.peakDate}</AlertDescription>
            </Alert>

            {/* Contributing Factors */}
            <div>
              <p className="font-medium mb-3">Contributing Environmental Factors</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Weather Conditions</p>
                    <p className="text-xs text-muted-foreground">{alert.factors.weather}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                  <Thermometer className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-xs text-muted-foreground">{alert.factors.temperature}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                  <Bug className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Neighbor Activity</p>
                    <p className="text-xs text-muted-foreground">{alert.factors.neighborActivity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                  <Wind className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Historical Data</p>
                    <p className="text-xs text-muted-foreground">{alert.factors.historicalData}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preventive Measures */}
            <div>
              <p className="font-medium mb-3">Recommended Preventive Measures</p>
              <div className="space-y-2">
                {alert.preventiveMeasures.map((measure, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                    </div>
                    <p className="text-sm">{measure}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button>Set Reminder</Button>
              <Button variant="outline">Share with Neighbors</Button>
              <Button variant="outline">View Historical Data</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pest Control History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pest Control Actions</CardTitle>
          <CardDescription>Your pest management history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Aphid treatment - Zone A</p>
                  <p className="text-sm text-muted-foreground">Applied organic pesticide • Sep 28, 2025</p>
                </div>
              </div>
              <Badge className="bg-green-600">Successful</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Preventive spray - Zone B</p>
                  <p className="text-sm text-muted-foreground">Neem oil application • Sep 20, 2025</p>
                </div>
              </div>
              <Badge className="bg-green-600">Completed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Collaborative pest control</p>
                  <p className="text-sm text-muted-foreground">Joint action with 4 neighbors • Sep 15, 2025</p>
                </div>
              </div>
              <Badge className="bg-green-600">+200 points</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}