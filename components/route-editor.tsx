"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, RouteIcon } from "lucide-react"

interface RoutePoint {
  id: string
  name: string
  lat: number
  lng: number
}

interface RouteProps {
  id: string
  name: string
  description: string
  coordinates: [number, number][]
  createdAt: string
  estimatedFuel: number
  estimatedTime: string
}

interface RouteEditorProps {
  route: RouteProps | null
  currentPosition: [number, number] | null
  onSave: (route: RouteProps) => void
  onCancel: () => void
}

export default function RouteEditor({ route, currentPosition, onSave, onCancel }: RouteEditorProps) {
  const [routeName, setRouteName] = useState(route?.name || "")
  const [routeDescription, setRouteDescription] = useState(route?.description || "")
  const [waypoints, setWaypoints] = useState<RoutePoint[]>([])
  const [newWaypointName, setNewWaypointName] = useState("")

  // Initialize waypoints from route coordinates if available
  useEffect(() => {
    if (route && route.coordinates.length > 0) {
      const points = route.coordinates.map((coord, index) => ({
        id: `wp-${index}`,
        name: `Waypoint ${index + 1}`,
        lat: coord[0],
        lng: coord[1],
      }))
      setWaypoints(points)
    } else if (currentPosition) {
      // Start with current position if no route
      setWaypoints([
        {
          id: "wp-start",
          name: "Starting Point",
          lat: currentPosition[0],
          lng: currentPosition[1],
        },
      ])
    }
  }, [route, currentPosition])

  const addWaypoint = () => {
    if (!currentPosition) return

    const newWaypoint: RoutePoint = {
      id: `wp-${Date.now()}`,
      name: newWaypointName || `Waypoint ${waypoints.length + 1}`,
      lat: currentPosition[0],
      lng: currentPosition[1],
    }

    setWaypoints([...waypoints, newWaypoint])
    setNewWaypointName("")
  }

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id))
  }

  const handleSave = () => {
    if (waypoints.length < 2) {
      alert("A route must have at least 2 waypoints.")
      return
    }

    const coordinates: [number, number][] = waypoints.map((wp) => [wp.lat, wp.lng])

    // Calculate estimated fuel and time (simplified)
    const distance = calculateRouteDistance(coordinates)
    const estimatedFuel = Math.round(distance * 0.5) // 0.5L per km (simplified)
    const estimatedTime = formatTime(distance)

    const savedRoute: RouteProps = {
      id: route?.id || `route-${Date.now()}`,
      name: routeName || "Unnamed Route",
      description: routeDescription,
      coordinates,
      createdAt: route?.createdAt || new Date().toISOString(),
      estimatedFuel,
      estimatedTime,
    }

    onSave(savedRoute)
  }

  // Helper function to calculate route distance in kilometers
  const calculateRouteDistance = (coordinates: [number, number][]): number => {
    if (coordinates.length < 2) return 0

    let distance = 0
    for (let i = 0; i < coordinates.length - 1; i++) {
      const lat1 = coordinates[i][0]
      const lon1 = coordinates[i][1]
      const lat2 = coordinates[i + 1][0]
      const lon2 = coordinates[i + 1][1]

      // Haversine formula
      const R = 6371 // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1)
      const dLon = deg2rad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c // Distance in km
      distance += d
    }

    return distance
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  // Format time based on distance (simplified)
  const formatTime = (distance: number): string => {
    // Assume average speed of 10 km/h
    const hours = Math.floor(distance / 10)
    const minutes = Math.round((distance / 10 - hours) * 60)

    if (hours === 0) {
      return `${minutes}m`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{route ? "Edit Route" : "Create New Route"}</h2>
      </div>

      <div className="space-y-4 flex-1 overflow-auto">
        <div>
          <Label htmlFor="route-name">Route Name</Label>
          <Input
            id="route-name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Enter a name for this route"
          />
        </div>

        <div>
          <Label htmlFor="route-description">Description (optional)</Label>
          <Textarea
            id="route-description"
            value={routeDescription}
            onChange={(e) => setRouteDescription(e.target.value)}
            placeholder="Add notes about this route..."
            className="h-20"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Waypoints</Label>
            <div className="text-sm text-muted-foreground">
              {waypoints.length} points | {calculateRouteDistance(waypoints.map((wp) => [wp.lat, wp.lng])).toFixed(1)}{" "}
              km
            </div>
          </div>

          <ScrollArea className="h-[200px] border rounded-md p-2">
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id} className="flex items-center justify-between p-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{waypoint.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWaypoint(waypoint.id)}
                  disabled={waypoints.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <Label htmlFor="waypoint-name">Add Waypoint</Label>
          <div className="flex gap-2">
            <Input
              id="waypoint-name"
              value={newWaypointName}
              onChange={(e) => setNewWaypointName(e.target.value)}
              placeholder="Waypoint name (optional)"
            />
            <Button onClick={addWaypoint} disabled={!currentPosition}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Adds a waypoint at your current location</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={waypoints.length < 2 || !routeName}>
          <RouteIcon className="h-4 w-4 mr-2" />
          Save Route
        </Button>
      </div>
    </div>
  )
}

