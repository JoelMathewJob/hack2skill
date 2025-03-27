"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fish, Sun, Moon, Sunrise, Sunset } from "lucide-react"
import type { WeatherData } from "@/types/fishing-types"

interface FishMovementPredictorProps {
  weatherData: WeatherData | null;
}

export default function FishMovementPredictor({ weatherData }: FishMovementPredictorProps) {
  const [timeOfDay, setTimeOfDay] = useState("morning")

  // Get the current hour to determine default time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 10) {
      setTimeOfDay("morning")
    } else if (hour >= 10 && hour < 16) {
      setTimeOfDay("midday")
    } else if (hour >= 16 && hour < 20) {
      setTimeOfDay("evening")
    } else {
      setTimeOfDay("night")
    }
  }, [])

  // Generate predictions based on weather and time of day
  const getPredictions = () => {
    const predictions = {
      morning: {
        activity: weatherData?.temperature < 20 ? "High" : "Moderate",
        depth: weatherData?.temperature < 20 ? "Shallow to mid-depth" : "Mid-depth",
        location: weatherData?.conditions.includes("Rain") ? "Near structure and cover" : "Near shorelines and vegetation",
        species: weatherData?.temperature < 20 ? ["Bass", "Trout", "Crappie"] : ["Bass", "Bluegill", "Catfish"],
      },
      midday: {
        activity: weatherData?.temperature > 25 ? "Low" : "Moderate",
        depth: weatherData?.temperature > 25 ? "Deep water" : "Mid-depth",
        location: weatherData?.conditions.includes("Sunny")
          ? "Near deep structure and shade"
          : "Various depths around structure",
        species:
          weatherData?.temperature > 25 ? ["Catfish", "Bass (deep)", "Crappie (deep)"] : ["Bass", "Bluegill", "Crappie"],
      },
      evening: {
        activity: "High",
        depth: "Shallow to mid-depth",
        location: "Near shorelines, points, and feeding areas",
        species: ["Bass", "Trout", "Crappie", "Walleye"],
      },
      night: {
        activity: weatherData?.conditions.includes("Clear") ? "Moderate" : "Low",
        depth: "Varies by species",
        location: "Near shorelines and shallow structure",
        species: ["Catfish", "Walleye", "Bass", "Crappie"],
      },
    }

    return predictions
  }

  const predictions = getPredictions()

  // Icons for time of day
  const timeIcons = {
    morning: <Sunrise className="h-5 w-5" />,
    midday: <Sun className="h-5 w-5" />,
    evening: <Sunset className="h-5 w-5" />,
    night: <Moon className="h-5 w-5" />,
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Fish movement predictions based on current conditions:</p>

      <Tabs defaultValue={timeOfDay} value={timeOfDay} onValueChange={setTimeOfDay}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="morning" className="flex items-center gap-1">
            <Sunrise className="h-4 w-4" />
            <span className="hidden sm:inline">Morning</span>
          </TabsTrigger>
          <TabsTrigger value="midday" className="flex items-center gap-1">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Midday</span>
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex items-center gap-1">
            <Sunset className="h-4 w-4" />
            <span className="hidden sm:inline">Evening</span>
          </TabsTrigger>
          <TabsTrigger value="night" className="flex items-center gap-1">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Night</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(predictions).map(([time, data]) => (
          <TabsContent key={time} value={time} className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {timeIcons[time as keyof typeof timeIcons]}
                  <CardTitle className="text-base capitalize">{time} Fishing Forecast</CardTitle>
                </div>
                <CardDescription>
                  Based on current weather: {weatherData?.temperature}°C, {weatherData?.conditions}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Fish Activity</h4>
                    <p className="text-sm">{data.activity}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Likely Depth</h4>
                    <p className="text-sm">{data.depth}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Where to Look</h4>
                  <p className="text-sm">{data.location}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Active Species</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.species.map((species, index) => (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
                        <Fish className="h-3 w-3" />
                        {species}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

