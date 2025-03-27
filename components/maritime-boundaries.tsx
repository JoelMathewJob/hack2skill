"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, MapPin } from "lucide-react"

interface MaritimeBoundariesProps {
  currentPosition: [number, number] | null
}

export default function MaritimeBoundaries({ currentPosition }: MaritimeBoundariesProps) {
  const [alertRadius, setAlertRadius] = useState(5) // km
  const [boundaryAlertsEnabled, setBoundaryAlertsEnabled] = useState(true)
  const [showAllBoundaries, setShowAllBoundaries] = useState(true)

  // Mock boundary data - in a real app, this would come from a GeoJSON file or API
  const mockBoundaryDistance = 12.3 // km
  const mockBoundaryName = "National Maritime Boundary"
  const isNearBoundary = mockBoundaryDistance <= alertRadius

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Maritime Boundaries</h2>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Boundary Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="boundary-alerts">Boundary Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts when approaching boundaries</p>
            </div>
            <Switch id="boundary-alerts" checked={boundaryAlertsEnabled} onCheckedChange={setBoundaryAlertsEnabled} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="alert-radius">Alert Radius: {alertRadius} km</Label>
            </div>
            <Slider
              id="alert-radius"
              min={1}
              max={20}
              step={1}
              value={[alertRadius]}
              onValueChange={(value) => setAlertRadius(value[0])}
              disabled={!boundaryAlertsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-boundaries">Show All Boundaries</Label>
              <p className="text-sm text-muted-foreground">Display all maritime boundaries on map</p>
            </div>
            <Switch id="show-boundaries" checked={showAllBoundaries} onCheckedChange={setShowAllBoundaries} />
          </div>
        </CardContent>
      </Card>

      {currentPosition ? (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Nearest Boundary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{mockBoundaryName}</p>
                  <p className="text-sm text-muted-foreground">Distance: {mockBoundaryDistance} km</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {isNearBoundary && boundaryAlertsEnabled && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Boundary Alert</AlertTitle>
              <AlertDescription>
                You are approaching {mockBoundaryName}. Current distance: {mockBoundaryDistance} km.
              </AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>Waiting for location data...</p>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Boundary Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Maritime boundaries define the areas where different maritime laws and regulations apply. Staying aware of
            these boundaries is crucial for legal fishing operations.
          </p>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            <li>National waters typically extend 12 nautical miles from shore</li>
            <li>Exclusive Economic Zones (EEZ) extend up to 200 nautical miles</li>
            <li>Special fishing zones may have specific regulations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

