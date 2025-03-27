"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Plus, Trash2 } from "lucide-react"
import WeatherDisplay from "@/components/weather-display"
import type { Location, WeatherData } from "@/types/fishing-types"

interface SidebarProps {
  locations: Location[]
  currentPosition: [number, number] | null
  weatherData: WeatherData | null
  selectedLocation: Location | null
  handleMapClick: (lat: number, lng: number) => void
  handleLocationSelect: (location: Location) => void
  handleDeleteLocation: (id: string) => void
  isMobileMenuOpen: boolean
}

export default function Sidebar({
  locations,
  currentPosition,
  weatherData,
  selectedLocation,
  handleMapClick,
  handleLocationSelect,
  handleDeleteLocation,
  isMobileMenuOpen,
}: SidebarProps) {
  return (
    <aside
      className={`${isMobileMenuOpen ? "block" : "hidden"} md:block w-full md:w-80 bg-white border-r p-4 overflow-hidden flex flex-col`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Saved Locations</h2>
        {currentPosition && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMapClick(currentPosition[0], currentPosition[1])}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {locations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No saved locations yet</p>
            <p className="text-sm">Click on the map to add your fishing spots</p>
          </div>
        ) : (
          <div className="space-y-2">
            {locations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedLocation?.id === location.id ? "border-primary" : ""}`}
                onClick={() => handleLocationSelect(location)}
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span className="truncate">{location.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteLocation(location.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(location.dateAdded).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Weather display in sidebar */}
      {weatherData && (
        <div className="mt-4 pt-4 border-t">
          <WeatherDisplay weather={weatherData} />
        </div>
      )}
    </aside>
  )
}

