"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation, Fuel, Plus, Trash2, Download, Fish } from "lucide-react"
import type { WeatherData } from "@/types/fishing-types"

interface RouteOptimizationProps {
  currentPosition: [number, number] | null
  weatherData: WeatherData | null
}

interface Waypoint {
  id: string
  name: string
  lat: number
  lng: number
}

export default function RouteOptimization({ currentPosition, weatherData }: RouteOptimizationProps) {
  const [activeTab, setActiveTab] = useState("planning")
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [waypointName, setWaypointName] = useState("")
  const [offlineMapsDownloaded, setOfflineMapsDownloaded] = useState(false)

  const addWaypoint = () => {
    if (!currentPosition) return

    const newWaypoint: Waypoint = {
      id: Date.now().toString(),
      name: waypointName || `Waypoint ${waypoints.length + 1}`,
      lat: currentPosition[0],
      lng: currentPosition[1],
    }

    setWaypoints([...waypoints, newWaypoint])
    setWaypointName("")
  }

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id))
  }

  const downloadOfflineMaps = () => {
    // In a real app, this would trigger the download of map tiles
    setOfflineMapsDownloaded(true)
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="planning">Route Planning</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="offline">Offline Maps</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Add Waypoint</CardTitle>
              <CardDescription>Add waypoints to create your fishing route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waypoint-name">Waypoint Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="waypoint-name"
                      value={waypointName}
                      onChange={(e) => setWaypointName(e.target.value)}
                      placeholder="Enter waypoint name"
                    />
                    <Button onClick={addWaypoint} disabled={!currentPosition}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Current Waypoints</h3>
                  {waypoints.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No waypoints added yet.</p>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {waypoints.map((waypoint, index) => (
                          <div key={waypoint.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div>
                              <p className="font-medium">{waypoint.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeWaypoint(waypoint.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {waypoints.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Route Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm">Total Distance:</p>
                    <p className="text-sm font-medium">24.5 km</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Estimated Travel Time:</p>
                    <p className="text-sm font-medium">1h 45m</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Estimated Fuel Usage:</p>
                    <p className="text-sm font-medium">12.3 L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Route Optimization</CardTitle>
              <CardDescription>Find the most efficient route to fishing grounds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Suggested Fishing Grounds</h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Fishing Hotspot {i}</p>
                          <p className="text-xs text-muted-foreground">Distance: {(i * 5.2).toFixed(1)} km</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {90 - i * 10}% Match
                          </div>
                          <Button variant="outline" size="sm">
                            <Navigation className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Expected catch: Bass, Trout, Bluegill</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on current weather and fish movement patterns
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Optimization Factors</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Fuel Efficiency</p>
                      <p className="text-xs text-muted-foreground">Minimize fuel usage</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Fish className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Catch Potential</p>
                      <p className="text-xs text-muted-foreground">Maximize expected catch</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Offline Maps</CardTitle>
              <CardDescription>Download map areas for offline use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Area</h3>
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Your Location</p>
                      {currentPosition && (
                        <p className="text-xs text-muted-foreground">
                          {currentPosition[0].toFixed(4)}, {currentPosition[1].toFixed(4)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant={offlineMapsDownloaded ? "outline" : "default"}
                      onClick={downloadOfflineMaps}
                      disabled={offlineMapsDownloaded || !currentPosition}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {offlineMapsDownloaded ? "Downloaded" : "Download"}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">Area: 20km radius around current position</p>
                    <p className="text-sm">Size: ~45MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Downloaded Maps</h3>
                {!offlineMapsDownloaded ? (
                  <p className="text-sm text-muted-foreground">No offline maps downloaded yet.</p>
                ) : (
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Area</p>
                        <p className="text-xs text-muted-foreground">Downloaded on {new Date().toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

