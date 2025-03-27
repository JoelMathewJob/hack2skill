"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import type { Location } from "@/types/fishing-types"

interface LocationEditorProps {
  selectedLocation: Location | null
  editName: string
  editNotes: string
  setEditName: (name: string) => void
  setEditNotes: (notes: string) => void
  handleSaveLocation: () => void
  setIsEditing: (isEditing: boolean) => void
}

export default function LocationEditor({
  selectedLocation,
  editName,
  editNotes,
  setEditName,
  setEditNotes,
  handleSaveLocation,
  setIsEditing,
}: LocationEditorProps) {
  if (!selectedLocation) return null

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Edit Location</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 flex-1">
        <div>
          <Label htmlFor="location-name">Location Name</Label>
          <Input
            id="location-name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter a name for this location"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="location-notes">Notes</Label>
          <Textarea
            id="location-notes"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Add notes about this fishing spot..."
            className="h-[calc(100%-2rem)]"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button onClick={handleSaveLocation}>Save</Button>
      </div>
    </div>
  )
}

