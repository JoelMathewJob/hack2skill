"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  notes: string
  dateAdded: string
}

interface MapComponentProps {
  center: [number, number]
  markers?: Location[]
  selectedLocation: Location | null
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (location: Location) => void
  boundaries?: any[]
  routes?: any[]
  predictedFishLocations?: any[]
}

export default function MapComponent({
  center,
  markers = [],
  selectedLocation,
  onMapClick,
  onMarkerClick,
  boundaries = [],
  routes = [],
  predictedFishLocations = [],
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const boundariesLayerRef = useRef<L.LayerGroup | null>(null)
  const routesLayerRef = useRef<L.LayerGroup | null>(null)
  const fishLocationsLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    // Fix default icon issue with a URL-based approach instead of imports
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    })
    L.Marker.prototype.options.icon = DefaultIcon

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(center, 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Create a layer group for markers
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current)

      // Add click event to map
      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng
        onMapClick(lat, lng)
      })
    } else {
      // Update center if it changes
      mapRef.current.setView(center)
    }

    return () => {
      // Clean up map on component unmount
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, onMapClick])

  // Update markers when they change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Add markers for each location
    markers.forEach((location) => {
      const isSelected = selectedLocation?.id === location.id

      // Create custom marker using divIcon (no external images needed)
      const markerIcon = L.divIcon({
        className: "custom-marker",
        html: `<div class="${isSelected ? "text-primary" : "text-gray-700"}" style="transform: translate(-50%, -100%);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="${isSelected ? "w-8 h-8" : "w-6 h-6"}">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${isSelected ? `<div class="bg-white text-xs px-1 py-0.5 rounded shadow text-center whitespace-nowrap" style="position: absolute; left: 50%; transform: translateX(-50%);">${location.name}</div>` : ""}
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([location.lat, location.lng], { icon: markerIcon })
        .addTo(markersLayerRef.current!)
        .on("click", () => {
          onMarkerClick(location)
        })

      // If this is the selected location, pan to it
      if (isSelected && mapRef.current) {
        mapRef.current.panTo([location.lat, location.lng])
      }
    })

    // If there's a selected location that's not in markers (new unsaved location)
    if (selectedLocation && !markers.find((m) => m.id === selectedLocation.id)) {
      const tempMarkerIcon = L.divIcon({
        className: "custom-marker",
        html: `<div class="text-primary" style="transform: translate(-50%, -100%);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-8 h-8">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div class="bg-white text-xs px-1 py-0.5 rounded shadow text-center whitespace-nowrap" style="position: absolute; left: 50%; transform: translateX(-50%);">New Location</div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      L.marker([selectedLocation.lat, selectedLocation.lng], { icon: tempMarkerIcon }).addTo(markersLayerRef.current!)

      if (mapRef.current) {
        mapRef.current.panTo([selectedLocation.lat, selectedLocation.lng])
      }
    }
  }, [markers, selectedLocation, onMarkerClick])

  // Update maritime boundaries
  useEffect(() => {
    if (!mapRef.current || !boundariesLayerRef.current || !boundaries.length) return

    boundariesLayerRef.current.clearLayers()

    // Add maritime boundaries
    boundaries.forEach((boundary) => {
      // This is a simplified example - in real app, these would come from GeoJSON data
      const boundaryPolygon = L.polygon(boundary.coordinates, {
        color: "#FF5733",
        weight: 2,
        opacity: 0.7,
        fillColor: "#FF5733",
        fillOpacity: 0.1,
      }).addTo(boundariesLayerRef.current!)

      boundaryPolygon.bindTooltip(boundary.name)
    })
  }, [boundaries])

  // Update routes
  useEffect(() => {
    if (!mapRef.current || !routesLayerRef.current || !routes.length) return

    routesLayerRef.current.clearLayers()

    // Add routes
    routes.forEach((route) => {
      const routeLine = L.polyline(route.coordinates, {
        color: "#3388FF",
        weight: 4,
        opacity: 0.7,
      }).addTo(routesLayerRef.current!)

      routeLine.bindTooltip(route.name)
    })
  }, [routes])

  // Update predicted fish locations
  useEffect(() => {
    if (!mapRef.current || !fishLocationsLayerRef.current || !predictedFishLocations.length) return

    fishLocationsLayerRef.current.clearLayers()

    // Add fish location markers
    predictedFishLocations.forEach((location) => {
      // Use a fish icon for fish locations
      const fishIcon = L.divIcon({
        className: "custom-fish-marker",
        html: `<div style="transform: translate(-50%, -50%);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${location.confidenceColor}" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 12.5a.5.5 0 1 0-.5-.5.5.5 0 0 0 .5.5"></path>
                  <path d="M14.5 9.5 9 6l1 3-1 3 5.5-3.5"></path>
                  <path d="M4 12h.78c1.15 0 2.09.8 2.82 1.54C8.83 14.77 10.18 16 12 16h6.14a2 2 0 0 0 1.77-2.9L18 10"></path>
                  <path d="M18 8c-.4 0-.79.13-1.14.36"></path>
                  <path d="M6.04 14.87A5.39 5.39 0 0 1 4 10.5c0-3.6 2.5-5.5 7-5.5p3a2 2 0 0 1 1.73 1.07L18 10"></path>
                </svg>
                <div class="bg-white text-xs px-1 py-0.5 rounded shadow whitespace-nowrap" style="position: absolute; left: 50%; transform: translateX(-50%);">${location.species}</div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const fishMarker = L.marker([location.lat, location.lng], { icon: fishIcon }).addTo(
        fishLocationsLayerRef.current!,
      )

      fishMarker.bindTooltip(`${location.species}<br>Confidence: ${location.confidence}%`)
    })
  }, [predictedFishLocations])

  return <div id="map" className="h-full w-full z-0" />
}

