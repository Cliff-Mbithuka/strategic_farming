import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Satellite, Map, Layers, Download, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SatelliteView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Satellite Imaging & Geospatial Data</h1>
          <p className="text-muted-foreground">
            Real-time satellite data and analysis for your farm
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="satellite" className="space-y-4">
        <TabsList>
          <TabsTrigger value="satellite">
            <Satellite className="h-4 w-4 mr-2" />
            Satellite View
          </TabsTrigger>
          <TabsTrigger value="thermal">
            <Layers className="h-4 w-4 mr-2" />
            Thermal Map
          </TabsTrigger>
          <TabsTrigger value="vegetation">
            <Map className="h-4 w-4 mr-2" />
            NDVI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="satellite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Farm - Satellite Imagery</CardTitle>
              <CardDescription>Last updated: October 4, 2025 at 9:30 AM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681999735639-da9eafbb385f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBhZ3JpY3VsdHVyZSUyMGZhcm18ZW58MXx8fHwxNzU5NTU4OTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Satellite view of farmland"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className="bg-green-600">Active</Badge>
                  <Badge className="bg-blue-600">32.5 hectares</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="text-xl font-semibold mt-1">32.5 ha</p>
                  <p className="text-xs text-muted-foreground mt-1">80.3 acres</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Cultivation</p>
                  <p className="text-xl font-semibold mt-1">28.2 ha</p>
                  <p className="text-xs text-muted-foreground mt-1">86.8% utilization</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Fallow Land</p>
                  <p className="text-xl font-semibold mt-1">4.3 ha</p>
                  <p className="text-xs text-muted-foreground mt-1">13.2% resting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Field Zones Analysis</CardTitle>
                <CardDescription>AI-identified crop zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded">
                    <div>
                      <p className="font-medium">Zone A - Wheat</p>
                      <p className="text-sm text-muted-foreground">12.5 hectares</p>
                    </div>
                    <Badge className="bg-green-600">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded">
                    <div>
                      <p className="font-medium">Zone B - Corn</p>
                      <p className="text-sm text-muted-foreground">9.2 hectares</p>
                    </div>
                    <Badge className="bg-green-600">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                    <div>
                      <p className="font-medium">Zone C - Vegetables</p>
                      <p className="text-sm text-muted-foreground">6.5 hectares</p>
                    </div>
                    <Badge className="bg-yellow-600">Needs Attention</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded">
                    <div>
                      <p className="font-medium">Zone D - Fallow</p>
                      <p className="text-sm text-muted-foreground">4.3 hectares</p>
                    </div>
                    <Badge variant="outline">Resting</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Neighboring Farms</CardTitle>
                <CardDescription>Satellite data from surrounding areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded">
                    <div>
                      <p className="font-medium">North Farm - Maria Santos</p>
                      <p className="text-sm text-muted-foreground">Planting tomatoes • 15 ha</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded">
                    <div>
                      <p className="font-medium">East Farm - David Chen</p>
                      <p className="text-sm text-muted-foreground">Growing corn • 22 ha</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded">
                    <div>
                      <p className="font-medium">South Farm - Ana Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Wheat harvest • 18 ha</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="thermal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thermal Mapping</CardTitle>
              <CardDescription>Heat distribution analysis across your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559506709-e3d879c60305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtbGFuZCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzU5NDkxMjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Thermal map of farmland"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Temperature</p>
                  <p className="text-xl font-semibold mt-1">24.5°C</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Hot Spots</p>
                  <p className="text-xl font-semibold mt-1">3 areas</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Cold Zones</p>
                  <p className="text-xl font-semibold mt-1">1 area</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vegetation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NDVI (Vegetation Index) Analysis</CardTitle>
              <CardDescription>Plant health and growth monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 to-green-200 dark:from-red-950 dark:via-yellow-950 dark:via-green-950 dark:to-green-900 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Low Vegetation</span>
                    <span className="text-sm">Dense Vegetation</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">NDVI: 0.0</span>
                    <span className="text-xs">NDVI: 1.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Average NDVI</p>
                    <p className="text-xl font-semibold mt-1">0.72</p>
                    <p className="text-xs text-muted-foreground mt-1">Healthy vegetation</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="text-xl font-semibold mt-1">+8.3%</p>
                    <p className="text-xs text-muted-foreground mt-1">vs. last week</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Zone Analysis</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Zone A</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">0.85</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Zone B</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">0.78</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Zone C</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-600" style={{ width: '58%' }}></div>
                        </div>
                        <span className="text-sm font-medium">0.58</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}