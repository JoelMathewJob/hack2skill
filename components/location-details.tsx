"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash2 } from "lucide-react"
import BaitSuggestions from "@/components/bait-suggestions"
import type { Location, WeatherData } from "@/types/fishing-types"

interface LocationDetailsProps {
  selectedLocation: Location
  weatherData: WeatherData | null
  handleEditLocation: () => void
  handleDeleteLocation: (id: string) => void
}

export default function LocationDetails({
  selectedLocation,
  weatherData,
  handleEditLocation,
  handleDeleteLocation,
}: LocationDetailsProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{selectedLocation.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleEditLocation}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleDeleteLocation(selectedLocation.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-2">
        Added on {new Date(selectedLocation.dateAdded).toLocaleDateString()}
      </div>
      <Separator className="my-2" />
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {selectedLocation.notes ? (
            <div>
              <h3 className="font-medium mb-1">Notes</h3>
              <p className="text-sm whitespace-pre-line">{selectedLocation.notes}</p>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm italic">No notes added yet. Click edit to add notes.</div>
          )}

          {weatherData && (
            <div>
              <h3 className="font-medium mb-1">Fishing Conditions</h3>
              <BaitSuggestions weather={weatherData} location={selectedLocation} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

