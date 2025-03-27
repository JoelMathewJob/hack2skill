"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WeatherData {
  temperature: number
  conditions: string
  windSpeed: number
  humidity: number
  pressure: number
  icon: string
}

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  notes: string
  dateAdded: string
}

interface BaitSuggestionsProps {
  weather: WeatherData
  location?: Location
  detailed?: boolean
}

export default function BaitSuggestions({ weather, location, detailed = false }: BaitSuggestionsProps) {
  const [activeTab, setActiveTab] = useState("lures")

  // Determine bait suggestions based on weather conditions
  const getBaitSuggestions = () => {
    const suggestions = {
      lures: [] as string[],
      live: [] as string[],
      techniques: [] as string[],
    }

    // Lures based on weather
    if (weather.conditions.includes("Sunny")) {
      suggestions.lures.push("Reflective spoons", "Crankbaits", "Topwater plugs")
      suggestions.live.push("Minnows", "Worms", "Crickets")
      suggestions.techniques.push("Cast into shaded areas", "Fish deeper water", "Early morning/late evening fishing")
    } else if (weather.conditions.includes("Cloudy")) {
      suggestions.lures.push("Spinners", "Jigs", "Soft plastic worms")
      suggestions.live.push("Nightcrawlers", "Leeches", "Crayfish")
      suggestions.techniques.push("Cover more water", "Vary retrieve speeds", "Focus on structure")
    } else if (weather.conditions.includes("Rain")) {
      suggestions.lures.push("Dark-colored jigs", "Spinnerbaits", "Plastic worms")
      suggestions.live.push("Worms", "Cut bait", "Stinkbait")
      suggestions.techniques.push("Fish near runoff areas", "Slow presentation", "Focus on cover")
    }

    // Adjust for temperature
    if (weather.temperature < 15) {
      suggestions.lures.push("Small jigs", "Slow-moving baits")
      suggestions.live.push("Mealworms", "Small minnows")
      suggestions.techniques.push("Slow retrieves", "Fish deeper water")
    } else if (weather.temperature > 25) {
      suggestions.lures.push("Topwater lures", "Fast-moving spinners")
      suggestions.live.push("Larger minnows", "Crayfish")
      suggestions.techniques.push("Early morning/late evening fishing", "Target shaded areas")
    }

    // Adjust for wind
    if (weather.windSpeed > 15) {
      suggestions.lures.push("Heavier jigs", "Spinnerbaits")
      suggestions.techniques.push("Cast into the wind", "Fish windward shorelines")
    }

    return suggestions
  }

  const baitSuggestions = getBaitSuggestions()

  return (
    <div className="space-y-4">
      {detailed ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="lures">Lures</TabsTrigger>
            <TabsTrigger value="live">Live Bait</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
          </TabsList>
          <TabsContent value="lures" className="space-y-2 mt-2">
            <h3 className="font-medium text-sm">Recommended Lures</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {baitSuggestions.lures.map((lure, index) => (
                <li key={index}>{lure}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="live" className="space-y-2 mt-2">
            <h3 className="font-medium text-sm">Recommended Live Bait</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {baitSuggestions.live.map((bait, index) => (
                <li key={index}>{bait}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="techniques" className="space-y-2 mt-2">
            <h3 className="font-medium text-sm">Recommended Techniques</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {baitSuggestions.techniques.map((technique, index) => (
                <li key={index}>{technique}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Top Bait Recommendations:</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {baitSuggestions.lures.slice(0, 2).map((lure, index) => (
              <li key={`lure-${index}`}>{lure}</li>
            ))}
            {baitSuggestions.live.slice(0, 1).map((bait, index) => (
              <li key={`live-${index}`}>{bait}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

