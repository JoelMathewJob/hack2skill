"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import type { Location } from "@/types/fishing-types"

interface CatchReportFormProps {
  onSubmit: (report: any) => void
  currentPosition: [number, number] | null
  locations: Location[]
}

export default function CatchReportForm({ onSubmit, currentPosition, locations }: CatchReportFormProps) {
  const [species, setSpecies] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("kg")
  const [method, setMethod] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("current")

  const handleSubmit = () => {
    if (!species || !quantity) return

    let location
    if (selectedLocation === "current") {
      location = {
        lat: currentPosition?.[0] || 0,
        lng: currentPosition?.[1] || 0,
      }
    } else {
      const loc = locations.find((l) => l.id === selectedLocation)
      if (loc) {
        location = {
          lat: loc.lat,
          lng: loc.lng,
          name: loc.name,
        }
      } else {
        location = {
          lat: currentPosition?.[0] || 0,
          lng: currentPosition?.[1] || 0,
        }
      }
    }

    const report = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      location,
      species,
      quantity: Number.parseFloat(quantity),
      unit,
      method,
      notes,
    }

    onSubmit(report)

    // Reset form
    setSpecies("")
    setQuantity("")
    setUnit("kg")
    setMethod("")
    setNotes("")
    setSelectedLocation("current")
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="catch-location">Location</Label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger id="catch-location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Location</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="catch-species">Fish Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger id="catch-species">
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tuna">Tuna</SelectItem>
            <SelectItem value="Mackerel">Mackerel</SelectItem>
            <SelectItem value="Swordfish">Swordfish</SelectItem>
            <SelectItem value="Sardines">Sardines</SelectItem>
            <SelectItem value="Red Snapper">Red Snapper</SelectItem>
            <SelectItem value="Grouper">Grouper</SelectItem>
            <SelectItem value="Barracuda">Barracuda</SelectItem>
            <SelectItem value="Kingfish">Kingfish</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="catch-quantity">Quantity</Label>
          <Input
            id="catch-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="catch-unit">Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="catch-unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
              <SelectItem value="count">Count (number)</SelectItem>
              <SelectItem value="lb">Pounds (lb)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="catch-method">Fishing Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger id="catch-method">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Gill nets">Gill nets</SelectItem>
            <SelectItem value="Hook and line">Hook and line</SelectItem>
            <SelectItem value="Trawl nets">Trawl nets</SelectItem>
            <SelectItem value="Purse seine">Purse seine</SelectItem>
            <SelectItem value="Long lines">Long lines</SelectItem>
            <SelectItem value="Traps">Traps</SelectItem>
            <SelectItem value="Cast nets">Cast nets</SelectItem>
            <SelectItem value="Trolling">Trolling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="catch-notes">Notes (optional)</Label>
        <Textarea
          id="catch-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional information about your catch"
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            const dialog = document.getElementById("catch-report-dialog") as HTMLDialogElement
            if (dialog) {
              dialog.close()
            }
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!species || !quantity}>
          Save Report
        </Button>
      </DialogFooter>
    </div>
  )
}

