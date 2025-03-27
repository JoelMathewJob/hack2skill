"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Cloud, Fish, MapPin, Anchor, LifeBuoy, Compass } from "lucide-react"
import WeatherDisplay from "@/components/weather-display"
import BaitSuggestions from "@/components/bait-suggestions"
import FishSpeciesInfo from "@/components/fish-species-info"
import FishMovementPredictor from "@/components/fish-movement-predictor"
import MaritimeBoundaries from "@/components/maritime-boundaries"
import RouteOptimization from "@/components/route-optimization"
import EmergencyFeatures from "@/components/emergency-features"
import type { WeatherData } from "@/types/fishing-types"

interface InfoTabsProps {
  weatherData: WeatherData | null
  currentPosition: [number, number] | null
  activeTab?: string
  showTabs?: boolean
}

export default function InfoTabs({ 
  weatherData, 
  currentPosition, 
  activeTab = "weather",
  showTabs = true 
}: InfoTabsProps) {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
      {showTabs && (
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="bait">Bait Guide</TabsTrigger>
          <TabsTrigger value="species">Species</TabsTrigger>
          <TabsTrigger value="predictions">Movement</TabsTrigger>
          <TabsTrigger value="boundaries">Boundaries</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>
      )}
      
      <ScrollArea className="h-full">
        <TabsContent value="weather" className="p-4 m-0">
          {weatherData ? (
            <div className="space-y-4">
              <WeatherDisplay weather={weatherData} detailed />
              <div>
                <h3 className="font-medium mb-2">Fishing Forecast</h3>
                <p className="text-sm">
                  {weatherData.conditions === "Sunny"
                    ? "Clear skies are great for sight fishing. Fish may be deeper during midday."
                    : weatherData.conditions === "Partly Cloudy"
                      ? "Ideal fishing conditions with good visibility and comfortable temperatures."
                      : weatherData.conditions === "Cloudy"
                        ? "Overcast conditions can bring fish closer to the surface."
                        : weatherData.conditions.includes("Rain")
                          ? "Rain can increase feeding activity as insects get washed into the water."
                          : "Challenging conditions. Fish may be less active."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Loading weather data...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bait" className="p-4 m-0">
          {weatherData ? (
            <BaitSuggestions weather={weatherData} detailed />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Loading bait suggestions...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="species" className="p-4 m-0">
          <FishSpeciesInfo currentPosition={currentPosition} />
        </TabsContent>

        <TabsContent value="predictions" className="p-4 m-0">
          {weatherData && currentPosition ? (
            <FishMovementPredictor weather={weatherData} currentPosition={currentPosition} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Loading predictions...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="boundaries" className="p-4 m-0">
          <MaritimeBoundaries currentPosition={currentPosition} />
        </TabsContent>

        <TabsContent value="routes" className="p-4 m-0">
          <RouteOptimization currentPosition={currentPosition} weatherData={weatherData} />
        </TabsContent>

        <TabsContent value="emergency" className="p-4 m-0">
          <EmergencyFeatures currentPosition={currentPosition} />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

