"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
// import LocationEditor from "@/components/location/location-editor"
// import LocationDetails from "@/components/location/location-details"
import InfoTabs from "@/components/tabs/info-tabs"
import type { Location, WeatherData, Route, CatchReport } from "@/types/fishing-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
import { Droplets, Wind, Trash2, Edit, X, Download, Route as RouteIcon, LifeBuoy, DollarSign, Compass, Clock, ArrowLeft, Plus, FileText, Calendar } from "lucide-react"
// import CatchReportForm from "@/components/catch-report-form"
// import EmergencyPanel from "@/components/emergency-panel"
// import RouteEditor from "@/components/route-editor"
import { useToast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import MobileMapLayout from "@/components/mobile-map-layout"
import MobileTabs from "@/components/mobile-tabs"
import { Cloud, Fish, Map, Anchor, ShoppingCart, Leaf, BarChart, Users } from "lucide-react"
// import FishSpeciesInfo from "@/components/fish-species-info"
import MarketPrices from "@/components/market-prices"
import SustainabilityTools from "@/components/sustainability-tools"
// import RouteOptimization from "@/components/route-optimization"
import FishMovementPredictor from "@/components/fish-movement-predictor"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center">Loading Map...</div>,
})

// Types
interface MaritimeBoundary {
  id: string
  name: string
  type: string
  coordinates: [number, number][]
}

interface PredictedFishLocation {
  id: string
  lat: number
  lng: number
  species: string
  confidence: number
  confidenceColor: string
  bestTime: string
  bestGear: string[]
  estimatedCatch: { min: number; max: number; unit: string }
}

interface FuelReport {
  id: string
  date: string
  amount: number
  cost: number
  tripId?: string
}

interface MarketData {
  id: string
  marketName: string
  location: string
  species: string
  price: number
  unit: string
  date: string
}

export default function FishingApp() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null >(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toast } = useToast()
  const [maritimeBoundaries, setMaritimeBoundaries] = useState<MaritimeBoundary[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [isEditingRoute, setIsEditingRoute] = useState(false)
  const [fishLocations, setFishLocations] = useState<PredictedFishLocation[]>([])
  const [catchReports, setCatchReports] = useState<CatchReport[]>([])
  const [fuelReports, setFuelReports] = useState<FuelReport[]>([])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [showOfflineMapDialog, setShowOfflineMapDialog] = useState(false)
  const [offlineAreas, setOfflineAreas] = useState<string[]>([])
  const [isDownloadingMap, setIsDownloadingMap] = useState(false)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [boundaryAlertRadius, setBoundaryAlertRadius] = useState(1000) // in meters
  const [areBoundaryAlertsEnabled, setAreBoundaryAlertsEnabled] = useState(true)
  const [areWeatherAlertsEnabled, setAreWeatherAlertsEnabled] = useState(true)
  const [language, setLanguage] = useState("en") // en, ta, etc.
  const [mapView, setMapView] = useState("standard") // standard, satellite, nautical
  const [showSustainabilityScore, setShowSustainabilityScore] = useState(true)
  const [sustainabilityScore, setSustainabilityScore] = useState(85) // 0-100
  const [activeTab, setActiveTab] = useState("weather")
  const [currentScreen, setCurrentScreen] = useState("main") // "main" or "secondary"
  const [secondaryScreen, setSecondaryScreen] = useState("")
  const [notes, setNotes] = useState<Array<{id: string, title: string, content: string, date: string}>>([])
  const [newNote, setNewNote] = useState({title: "", content: ""})
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({})
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])
  
  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Tamil translations for tab labels
  const translations = {
    en: {
      weather: "Weather",
      routes: "Routes",
      fish: "Fish",
      safety: "Safety",
      baitGuide: "Bait Guide",
      fishMovement: "Fish Movement",
      boundaries: "Boundaries",
      community: "Community",
      market: "Market",
      sustainability: "Sustainability",
      reports: "Reports",
      more: "More Options",
      language: "Language",
      english: "English",
      tamil: "Tamil",
      back: "Back",
      notes: "Notes",
      addNote: "Add Note",
      editNote: "Edit Note",
      deleteNote: "Delete Note",
      saveNote: "Save Note",
      noteTitle: "Title",
      noteContent: "Content",
      cancel: "Cancel",
      myNotes: "My Notes",
      noNotes: "No notes yet. Add your first note!",
      date: "Date"
    },
    ta: {
      weather: "வானிலை",
      routes: "பாதைகள்",
      fish: "மீன்",
      safety: "பாதுகாப்பு",
      baitGuide: "இரை வழிகாட்டி",
      fishMovement: "மீன் நகர்வு",
      boundaries: "எல்லைகள்",
      community: "சமூகம்",
      market: "சந்தை",
      sustainability: "நிலைத்தன்மை",
      reports: "அறிக்கைகள்",
      more: "மேலும் விருப்பங்கள்",
      language: "மொழி",
      english: "ஆங்கிலம்",
      tamil: "தமிழ்",
      back: "பின்",
      notes: "குறிப்புகள்",
      addNote: "குறிப்பு சேர்க்க",
      editNote: "குறிப்பு திருத்த",
      deleteNote: "குறிப்பு நீக்க",
      saveNote: "குறிப்பு சேமிக்க",
      noteTitle: "தலைப்பு",
      noteContent: "உள்ளடக்கம்",
      cancel: "ரத்து செய்",
      myNotes: "எனது குறிப்புகள்",
      noNotes: "இதுவரை குறிப்புகள் இல்லை. உங்கள் முதல் குறிப்பைச் சேர்க்கவும்!",
      date: "தேதி"
    }
  };

  // Get translated text
  const t = (key: keyof typeof translations.en) => {
    return translations[language as keyof typeof translations][key] || translations.en[key];
  };

  // Essential tabs for bottom navigation with translations
  const primaryTabs = [
    { id: "weather", label: t("weather"), icon: <Cloud className="h-4 w-4" /> },
    { id: "routes", label: t("routes"), icon: <RouteIcon className="h-4 w-4" /> },
    { id: "species", label: t("fish"), icon: <Fish className="h-4 w-4" /> },
    { id: "emergency", label: t("safety"), icon: <LifeBuoy className="h-4 w-4" /> },
  ];

  // Secondary tabs for sidebar
  const secondaryTabs = [
    { id: "notes", label: t("notes"), icon: <FileText className="h-4 w-4" /> },
    { id: "bait", label: t("baitGuide"), icon: <Fish className="h-4 w-4" /> },
    { id: "predictions", label: t("fishMovement"), icon: <Map className="h-4 w-4" /> },
    { id: "boundaries", label: t("boundaries"), icon: <Compass className="h-4 w-4" /> },
    { id: "community", label: t("community"), icon: <Users className="h-4 w-4" /> },
    { id: "market", label: t("market"), icon: <ShoppingCart className="h-4 w-4" /> },
    { id: "sustainability", label: t("sustainability"), icon: <Leaf className="h-4 w-4" /> },
    { id: "reports", label: t("reports"), icon: <BarChart className="h-4 w-4" /> },
  ];

  // Data loading flags
  const [isLoadingBoundaries, setIsLoadingBoundaries] = useState(true)
  const [isLoadingFishLocations, setIsLoadingFishLocations] = useState(true)
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(true)

  // Location tracking references
  const watchIdRef = useRef<number | null>(null)
  const lastReportedPositionRef = useRef<[number, number] | null>(null)

  // Add this function definition before your useEffect
  const checkBoundaryCrossings = (newPosition: [number, number]) => {
    if (!lastReportedPositionRef.current) return;
    
    // Check each boundary
    for (const boundary of maritimeBoundaries) {
      // Simple check: if we're inside a boundary now but weren't before (or vice versa)
      const wasInside = isPointInPolygon(lastReportedPositionRef.current, boundary.coordinates);
      const isInside = isPointInPolygon(newPosition, boundary.coordinates);
      
      if (wasInside !== isInside) {
        // Boundary crossing detected
        if (isInside) {
          console.log(`Entered ${boundary.name}`);
          // Use toast if available
          if (toast) {
            toast({
              title: `Entered ${boundary.type} zone`,
              description: `You have entered ${boundary.name}`,
              variant: boundary.type === "protected" ? "destructive" : "default",
            });
          }
        } else {
          console.log(`Exited ${boundary.name}`);
          // Use toast if available
          if (toast) {
            toast({
              title: `Exited ${boundary.type} zone`,
              description: `You have left ${boundary.name}`,
              variant: "default",
            });
          }
        }
      }
    }
  };

  // Helper function to check if a point is inside a polygon
  const isPointInPolygon = (point: [number, number], polygon: [number, number][]) => {
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Get user's current location on component mount
  useEffect(() => {
    const fetchDataForLocation = (latitude: number, longitude: number) => {
      fetchMockWeatherData(latitude, longitude);
      fetchMockMaritimeBoundaries(latitude, longitude);
      fetchMockFishLocations(latitude, longitude);
      fetchMockMarketData();
    };
  
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          setCurrentPosition(newPosition);
          lastReportedPositionRef.current = newPosition;
          fetchDataForLocation(newPosition[0], newPosition[1]);
        },
        (error) => {
          console.error("Geolocation error:", {
            code: error?.code ?? "UNKNOWN",
            message: error?.message ?? "No message available",
            details: error ? JSON.stringify(error) : "Error object is undefined",
          });
  
          alert("Could not determine location. Using default location (Tamil Nadu).");
  
          const defaultPosition: [number, number] = [8.0883, 77.5385]; // Coastal Tamil Nadu
          setCurrentPosition(defaultPosition);
          lastReportedPositionRef.current = defaultPosition;
          fetchDataForLocation(defaultPosition[0], defaultPosition[1]);
        },
        { 
          enableHighAccuracy: false, 
          maximumAge: 30000, 
          timeout: 15000,
        }
      );
  
      // Start tracking user's position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          setCurrentPosition(newPosition);
  
          // Check if boundary alerts are enabled before processing
          if (areBoundaryAlertsEnabled && lastReportedPositionRef.current && maritimeBoundaries.length > 0) {
            checkBoundaryCrossings(newPosition);
          }
  
          lastReportedPositionRef.current = newPosition;
        },
        (error) => console.error("Error tracking location:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }
  
    // Load saved data from localStorage
    const loadSavedData = (key: string, setter: (value: any) => void) => {
      const savedData = localStorage.getItem(key);
      if (savedData) setter(JSON.parse(savedData));
    };
  
    loadSavedData("fishingLocations", setLocations);
    loadSavedData("fishingRoutes", setRoutes);
    loadSavedData("catchReports", setCatchReports);
    loadSavedData("fuelReports", setFuelReports);
    loadSavedData("offlineMapAreas", setOfflineAreas);
  
    return () => {
      // Ensure location tracking cleanup
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [areBoundaryAlertsEnabled]);
  

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fishingLocations", JSON.stringify(locations))
  }, [locations])

  useEffect(() => {
    localStorage.setItem("fishingRoutes", JSON.stringify(routes))
  }, [routes])

  useEffect(() => {
    localStorage.setItem("catchReports", JSON.stringify(catchReports))
  }, [catchReports])

  useEffect(() => {
    localStorage.setItem("fuelReports", JSON.stringify(fuelReports))
  }, [fuelReports])

  useEffect(() => {
    localStorage.setItem("offlineMapAreas", JSON.stringify(offlineAreas))
  }, [offlineAreas])

  // Mock function to fetch weather data
  const fetchMockWeatherData = (lat: number, lng: number) => {
    setIsLoadingWeather(true)
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would be an API call to a weather service
      const mockWeather: WeatherData = {
        temperature: Math.round(25 + Math.random() * 10), // 25-35°C (typical Tamil Nadu temperatures)
        conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Thunderstorm"][Math.floor(Math.random() * 5)],
        windSpeed: Math.round(Math.random() * 20), // 0-20 km/h
        humidity: Math.round(60 + Math.random() * 30), // 60-90% (higher humidity for coastal areas)
        pressure: Math.round(1000 + Math.random() * 30), // 1000-1030 hPa
        icon: ["Sun", "Cloud", "CloudRain", "CloudLightning"][Math.floor(Math.random() * 4)],
        waveHeight: Math.round(10 + Math.random() * 190) / 100, // 0.1-2.0m
        wavePeriod: Math.round(3 + Math.random() * 9), // 3-12s
        waterTemperature: Math.round(22 + Math.random() * 8), // 22-30°C (Bay of Bengal temperatures)
        salinity: Math.round(30 + Math.random() * 5), // 30-35 ppt
        tides: [
          { time: "04:12", height: 0.8, type: "low" },
          { time: "10:36", height: 2.3, type: "high" },
          { time: "16:48", height: 0.7, type: "low" },
          { time: "23:00", height: 2.1, type: "high" },
        ],
      }
      setWeatherData(mockWeather)
      setIsLoadingWeather(false)

      // Check for severe weather and show alert if needed
      if (
        areWeatherAlertsEnabled &&
        (mockWeather.conditions === "Thunderstorm" || mockWeather.windSpeed > 15 || mockWeather.waveHeight! > 1.5)
      ) {
        // toast({
        //   title: "Weather Alert",
        //   description: `Challenging conditions detected: ${mockWeather.conditions}, Wind: ${mockWeather.windSpeed} km/h, Waves: ${mockWeather.waveHeight}m`,
        //   variant: "destructive",
        // })
      }
    }, 1000)
  }

  // Mock function to fetch maritime boundaries
  const fetchMockMaritimeBoundaries = (lat: number, lng: number) => {
    setIsLoadingBoundaries(true)
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would fetch GeoJSON data from a service
      // For demonstration, create boundaries near the current position
      const mockBoundaries: MaritimeBoundary[] = [
        {
          id: "boundary-1",
          name: "Territorial Waters Boundary",
          type: "national",
          coordinates: generatePolygonAround([lat, lng], 0.1, 8),
        },
        {
          id: "boundary-2",
          name: "International Maritime Border",
          type: "international",
          coordinates: generatePolygonAround([lat + 0.2, lng + 0.1], 0.08, 6),
        },
        {
          id: "boundary-3",
          name: "Marine Protected Area",
          type: "protected",
          coordinates: generatePolygonAround([lat - 0.1, lng - 0.15], 0.05, 10),
        },
      ]

      setMaritimeBoundaries(mockBoundaries)
      setIsLoadingBoundaries(false)
    }, 1500)
  }

  // Helper function to generate polygon coordinates around a center point
  const generatePolygonAround = (center: [number, number], radius: number, points: number): [number, number][] => {
    const coordinates: [number, number][] = []
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const x = center[0] + radius * Math.cos(angle)
      const y = center[1] + radius * Math.sin(angle)
      coordinates.push([x, y])
    }
    // Close the polygon
    coordinates.push(coordinates[0])
    return coordinates
  }

  // Mock function to fetch predicted fish locations
  const fetchMockFishLocations = (lat: number, lng: number) => {
    setIsLoadingFishLocations(true)
    // Simulate API delay
    setTimeout(() => {
      // Create mock fish locations near the current position
      const fishSpecies = [
        "Tuna",
        "Mackerel",
        "Swordfish",
        "Sardines",
        "Red Snapper",
        "Grouper",
        "Barracuda",
        "Kingfish",
      ]

      const gearTypes = [
        "Gill nets",
        "Hook and line",
        "Trawl nets",
        "Purse seine",
        "Long lines",
        "Traps",
        "Cast nets",
        "Trolling",
      ]

      const mockLocations: PredictedFishLocation[] = []

      // Generate 5-10 fish locations
      const numLocations = Math.floor(5 + Math.random() * 6)

      for (let i = 0; i < numLocations; i++) {
        // Random offset from current position
        const latOffset = (Math.random() - 0.5) * 0.2
        const lngOffset = (Math.random() - 0.5) * 0.2

        // Random confidence between 60-95%
        const confidence = Math.floor(60 + Math.random() * 36)

        // Color based on confidence
        let confidenceColor = "#FF0000" // red for low confidence
        if (confidence > 80) {
          confidenceColor = "#00FF00" // green for high confidence
        } else if (confidence > 70) {
          confidenceColor = "#FFFF00" // yellow for medium confidence
        }

        // Random species
        const species = fishSpecies[Math.floor(Math.random() * fishSpecies.length)]

        // Random best time
        const hours = ["Early morning", "Late morning", "Midday", "Afternoon", "Evening", "Night"]
        const bestTime = hours[Math.floor(Math.random() * hours.length)]

        // Random gear recommendations (2-3)
        const numGear = Math.floor(2 + Math.random() * 2)
        const bestGear: string[] = []
        for (let j = 0; j < numGear; j++) {
          const gear = gearTypes[Math.floor(Math.random() * gearTypes.length)]
          if (!bestGear.includes(gear)) {
            bestGear.push(gear)
          }
        }

        // Random estimated catch
        const minCatch = Math.floor(10 + Math.random() * 20)
        const maxCatch = minCatch + Math.floor(10 + Math.random() * 30)

        mockLocations.push({
          id: `fish-${i}`,
          lat: lat + latOffset,
          lng: lng + lngOffset,
          species: species,
          confidence: confidence,
          confidenceColor: confidenceColor,
          bestTime: bestTime,
          bestGear: bestGear,
          estimatedCatch: {
            min: minCatch,
            max: maxCatch,
            unit: "kg",
          },
        })
      }

      setFishLocations(mockLocations)
      setIsLoadingFishLocations(false)
    }, 2000)
  }

  // Mock function to fetch market data
  const fetchMockMarketData = () => {
    setIsLoadingMarketData(true)
    // Simulate API delay
    setTimeout(() => {
      const fishSpecies = [
        "Tuna",
        "Mackerel",
        "Swordfish",
        "Sardines",
        "Red Snapper",
        "Grouper",
        "Barracuda",
        "Kingfish",
      ]

      const markets = [
        "Chennai Harbor Fish Market",
        "Kanyakumari Port Market",
        "Rameshwaram Seafood Exchange",
        "Tuticorin Fisheries Hub",
      ]

      const mockMarketData: MarketData[] = []

      // Generate market data
      for (let i = 0; i < markets.length; i++) {
        for (let j = 0; j < 3; j++) {
          // 3 random species per market
          const species = fishSpecies[Math.floor(Math.random() * fishSpecies.length)]
          const price = Math.floor(100 + Math.random() * 900) // 100-1000 rupees

          mockMarketData.push({
            id: `market-${i}-${j}`,
            marketName: markets[i],
            location: `Location ${i + 1}`,
            species: species,
            price: price,
            unit: "kg",
            date: new Date().toISOString(),
          })
        }
      }

      setMarketData(mockMarketData)
      setIsLoadingMarketData(false)
    }, 1500)
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation(null)
    setIsEditing(true)
    setEditName("")
    setEditNotes("")
    setSelectedLocation({
      id: Date.now().toString(),
      name: "",
      lat,
      lng,
      notes: "",
      dateAdded: new Date().toISOString(),
      fishCaught: [],
    })
  }

  const handleSaveLocation = () => {
    if (!selectedLocation) return

    const updatedLocation = {
      ...selectedLocation,
      name: editName || `Location ${locations.length + 1}`,
      notes: editNotes,
    }

    const existingIndex = locations.findIndex((loc) => loc.id === updatedLocation.id)

    if (existingIndex >= 0) {
      // Update existing location
      const updatedLocations = [...locations]
      updatedLocations[existingIndex] = updatedLocation
      setLocations(updatedLocations)
    } else {
      // Add new location
      setLocations([...locations, updatedLocation])
    }

    setSelectedLocation(updatedLocation)
    setIsEditing(false)

    toast({
      title: existingIndex >= 0 ? "Location Updated" : "Location Saved",
      description: `${updatedLocation.name} has been saved to your locations.`,
    })
  }

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id))
    if (selectedLocation && selectedLocation.id === id) {
      setSelectedLocation(null)
    }

    toast({
      title: "Location Deleted",
      description: "The location has been removed from your saved locations.",
    })
  }

  const handleEditLocation = () => {
    if (!selectedLocation) return
    setEditName(selectedLocation.name)
    setEditNotes(selectedLocation.notes)
    setIsEditing(true)
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setIsEditing(false)
    setIsMobileMenuOpen(false)
  }

  // Handle route creation/editing
  const handleSaveRoute = (route: Route) => {
    const existingIndex = routes.findIndex((r) => r.id === route.id)

    if (existingIndex >= 0) {
      // Update existing route
      const updatedRoutes = [...routes]
      updatedRoutes[existingIndex] = route
      setRoutes(updatedRoutes)
    } else {
      // Add new route
      setRoutes([...routes, route])
    }

    setSelectedRoute(route)
    setIsEditingRoute(false)

    toast({
      title: existingIndex >= 0 ? "Route Updated" : "Route Created",
      description: `${route.name} has been saved to your routes.`,
    })
  }

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id))
    if (selectedRoute && selectedRoute.id === id) {
      setSelectedRoute(null)
    }

    toast({
      title: "Route Deleted",
      description: "The route has been removed from your saved routes.",
    })
  }

  // Handle catch reporting
  const handleCatchReport = (report: CatchReport) => {
    setCatchReports([...catchReports, report])

    toast({
      title: "Catch Reported",
      description: `Your catch of ${report.quantity} ${report.unit} of ${report.species} has been recorded.`,
    })

    // Update sustainability score
    updateSustainabilityScore()
  }

  // Handle fuel reporting
  const handleFuelReport = (report: FuelReport) => {
    setFuelReports([...fuelReports, report])

    toast({
      title: "Fuel Consumption Recorded",
      description: `Your fuel consumption of ${report.amount} liters has been recorded.`,
    })
  }

  // Simulate downloading an offline map area
  const handleDownloadMapArea = (areaName: string) => {
    setIsDownloadingMap(true)

    // Simulate download delay
    setTimeout(() => {
      setOfflineAreas([...offlineAreas, areaName])
      setIsDownloadingMap(false)
      setShowOfflineMapDialog(false)

      toast({
        title: "Map Downloaded",
        description: `The map area "${areaName}" has been downloaded for offline use.`,
      })
    }, 3000)
  }

  // Update sustainability score based on catch reports and behaviors
  const updateSustainabilityScore = () => {
    // In a real app, this would be a complex calculation
    // For this demo, we'll use a simplified approach

    // Start with a base score
    let score = 75

    // Recent catch reports impact score
    const recentReports = catchReports.slice(-5)

    // Varied species is good for sustainability
    const uniqueSpecies = new Set(recentReports.map((report) => report.species)).size
    score += uniqueSpecies * 2

    // Excessive catches reduce score
    const totalCatch = recentReports.reduce((sum, report) => sum + report.quantity, 0)
    if (totalCatch > 100) {
      score -= 10
    }

    // Limit to 0-100 range
    score = Math.max(0, Math.min(100, score))

    setSustainabilityScore(score)
  }

  // Handle emergency mode toggle
  const handleEmergencyModeToggle = () => {
    setIsEmergencyMode(!isEmergencyMode)

    if (!isEmergencyMode) {
      // Entering emergency mode
      toast({
        title: "Emergency Mode Activated",
        description: "SOS signals are being sent with your location data.",
        variant: "destructive",
      })
    } else {
      // Exiting emergency mode
      toast({
        title: "Emergency Mode Deactivated",
        description: "SOS signals have been stopped.",
      })
    }
  }

  // Handle navigation to secondary screen
  const navigateToSecondary = (screenId: string) => {
    setNavigationHistory([...navigationHistory, "main"])
    setSecondaryScreen(screenId)
    setCurrentScreen("secondary")
    setIsMobileMenuOpen(false)
  }

  // Handle back navigation
  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const lastScreen = navigationHistory.pop()
      const newHistory = [...navigationHistory]
      setNavigationHistory(newHistory)
      
      if (lastScreen === "main") {
        setCurrentScreen("main")
        setIsMobileMenuOpen(true) // Open the sidebar when going back
      } else {
        // If we're navigating between secondary screens
        setSecondaryScreen(lastScreen || "")
      }
    } else {
      // Fallback if no history
      setCurrentScreen("main")
    }
  }

  // Add this function to handle adding a new note
  const handleAddNote = () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") return;
    
    const newNoteItem = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toLocaleDateString()
    };
    
    setNotes([...notes, newNoteItem]);
    setNewNote({title: "", content: ""});
    setIsAddingNote(false);
  };

  // Add this function to handle editing a note
  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (!noteToEdit) return;
    
    setNewNote({title: noteToEdit.title, content: noteToEdit.content});
    setEditingNoteId(id);
    setIsAddingNote(true);
  };

  // Add this function to handle saving an edited note
  const handleSaveEditedNote = () => {
    if (!editingNoteId) return;
    
    const updatedNotes = notes.map(note => 
      note.id === editingNoteId 
        ? {...note, title: newNote.title, content: newNote.content} 
        : note
    );
    
    setNotes(updatedNotes);
    setNewNote({title: "", content: ""});
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  // Add this function to handle deleting a note
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Update the language switching logic
  useEffect(() => {
    // When language changes, translate all necessary content
    const translateContent = async () => {
      if (language === "en") {
        // Reset translations when switching to English
        setTranslatedContent({});
        return;
      }
      
      // Collect all text that needs translation
      const textsToTranslate: Record<string, string> = {};
      
      // Add dynamic content that needs translation
      notes.forEach(note => {
        textsToTranslate[`note_title_${note.id}`] = note.title;
        textsToTranslate[`note_content_${note.id}`] = note.content;
      });
      
      // Add other dynamic content
      // ...
      
      // Translate all collected texts
      const translations: Record<string, string> = {};
      for (const [key, text] of Object.entries(textsToTranslate)) {
        translations[key] = await translateText(text, language);
      }
      
      setTranslatedContent(translations);
    };
    
    translateContent();
  }, [language, notes]);

  // Helper function to get translated content
  const getTranslatedText = (key: string, originalText: string) => {
    if (language === "en") return originalText;
    return translatedContent[key] || originalText;
  };

  // Render secondary screen content
  const renderSecondaryScreen = () => {
    const screenTitle = secondaryTabs.find(tab => tab.id === secondaryScreen)?.label || "";
    
    return (
      <div className="flex flex-col h-screen">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          language={language} 
        />
        <div className="border-b p-3 flex items-center bg-background">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={navigateBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-medium">{screenTitle}</h2>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-background">
          {secondaryScreen === "notes" && (
            <div className="space-y-4">
              {isAddingNote ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingNoteId ? t("editNote") : t("addNote")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input 
                        placeholder={t("noteTitle")}
                        value={newNote.title}
                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Textarea 
                        placeholder={t("noteContent")}
                        value={newNote.content}
                        onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                        className="min-h-[150px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingNote(false);
                        setEditingNoteId(null);
                        setNewNote({title: "", content: ""});
                      }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button 
                      onClick={editingNoteId ? handleSaveEditedNote : handleAddNote}
                    >
                      {editingNoteId ? t("saveNote") : t("addNote")}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t("myNotes")}</h2>
                    <Button onClick={() => setIsAddingNote(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("addNote")}
                    </Button>
                  </div>
                  
                  {notes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {t("noNotes")}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notes.map(note => (
                        <Card key={note.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle>{note.title}</CardTitle>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditNote(note.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteNote(note.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription className="flex items-center text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {note.date}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="whitespace-pre-wrap">{note.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {secondaryScreen === "bait" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Bait Guide</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Sardine", type: "Live Bait", bestFor: ["Tuna", "Mackerel", "Kingfish"], image: "https://placehold.co/100x100/png" },
                  { name: "Squid", type: "Live/Cut Bait", bestFor: ["Snapper", "Grouper", "Cobia"], image: "https://placehold.co/100x100/png" },
                  { name: "Shrimp", type: "Live/Dead Bait", bestFor: ["Redfish", "Trout", "Flounder"], image: "https://placehold.co/100x100/png" },
                  { name: "Crab", type: "Live/Cut Bait", bestFor: ["Drum", "Sheepshead", "Permit"], image: "https://placehold.co/100x100/png" },
                  { name: "Mullet", type: "Live/Cut Bait", bestFor: ["Snook", "Tarpon", "Barracuda"], image: "https://placehold.co/100x100/png" },
                  { name: "Artificial Lure", type: "Jig/Spoon", bestFor: ["Various Species"], image: "https://placehold.co/100x100/png" },
                ].map((bait, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-[100px] h-[100px] bg-muted flex-shrink-0">
                        <img src={bait.image} alt={bait.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{bait.name}</h3>
                        <p className="text-sm text-muted-foreground">{bait.type}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium">Best for:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {bait.bestFor.map((fish, i) => (
                              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {fish}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {secondaryScreen === "predictions" && (
            <FishMovementPredictor weatherData={weatherData} />
          )}
          
          {secondaryScreen === "boundaries" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Fishing Boundaries</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tamil Nadu Coastal Fishing Zones</CardTitle>
                  <CardDescription>Important boundaries and regulations for fishing in Tamil Nadu waters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md overflow-hidden border h-[300px] bg-muted flex items-center justify-center">
                    <div className="text-center p-4">
                      <Map className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Boundary Map Visualization</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Territorial Waters (12 Nautical Miles)</h3>
                      <p className="text-sm text-muted-foreground">
                        Small-scale and traditional fishing vessels are permitted within this zone. 
                        Mechanized vessels have restrictions.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Exclusive Economic Zone (200 Nautical Miles)</h3>
                      <p className="text-sm text-muted-foreground">
                        Licensed fishing vessels can operate within this zone. 
                        Foreign vessels are prohibited without special permission.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-yellow-50">
                      <h3 className="font-medium mb-2">Restricted Areas</h3>
                      <p className="text-sm text-muted-foreground">
                        Gulf of Mannar Marine National Park, Palk Bay, and certain coastal areas 
                        have specific restrictions during breeding seasons.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {secondaryScreen === "community" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Fishing Community</h2>
              
              <Tabs defaultValue="discussions">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>
                
                <TabsContent value="discussions" className="mt-4 space-y-4">
                  {[
                    { 
                      title: "Best fishing spots near Rameswaram?", 
                      author: "Rajesh K.", 
                      replies: 12, 
                      time: "2 hours ago",
                      tags: ["Spots", "Rameswaram"]
                    },
                    { 
                      title: "Weather forecast for next week", 
                      author: "Priya S.", 
                      replies: 8, 
                      time: "5 hours ago",
                      tags: ["Weather", "Forecast"]
                    },
                    { 
                      title: "New regulations for Palk Bay", 
                      author: "Muthu R.", 
                      replies: 23, 
                      time: "1 day ago",
                      tags: ["Regulations", "Palk Bay"]
                    },
                  ].map((discussion, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{discussion.title}</CardTitle>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            {discussion.replies} replies
                          </span>
                        </div>
                        <CardDescription className="flex justify-between">
                          <span>{discussion.author}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {discussion.time}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <div className="flex gap-1">
                          {discussion.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="events" className="mt-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Fishermen's Day Celebration</CardTitle>
                        <CardDescription>June 15, 2023 • Chennai</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Annual celebration of the fishing community with cultural programs and competitions.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">View Details</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Sustainable Fishing Workshop</CardTitle>
                        <CardDescription>July 8, 2023 • Thoothukudi</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Learn about sustainable fishing practices and new technologies.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">View Details</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="help" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Need Assistance?</CardTitle>
                      <CardDescription>Connect with the fishing community for help</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Emergency Contacts</h3>
                        <p className="text-sm">Coast Guard: 1554</p>
                        <p className="text-sm">Fisheries Department: 044-2434-1256</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Technical Support</h3>
                        <p className="text-sm">App Support: support@matsyamitra.in</p>
                        <p className="text-sm">Equipment Help: 1800-425-1556</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {secondaryScreen === "market" && (
            <MarketPrices marketData={marketData} />
          )}
          
          {secondaryScreen === "sustainability" && (
            <SustainabilityTools sustainabilityScore={75} />
          )}
          
          {secondaryScreen === "reports" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Fishing Reports</h2>
              
              <Tabs defaultValue="my-reports">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="my-reports">My Reports</TabsTrigger>
                  <TabsTrigger value="community-reports">Community Reports</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-reports" className="mt-4">
                  <div className="flex justify-end mb-4">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Report
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {catchReports.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No reports yet. Create your first fishing report!
                      </div>
                    ) : (
                      catchReports.map((report, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>{report.species}</CardTitle>
                            <CardDescription>{new Date(report.date).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm text-muted-foreground">{report.location.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Weight</p>
                                <p className="text-sm text-muted-foreground">{report.weight} kg</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Bait Used</p>
                                <p className="text-sm text-muted-foreground">{report.bait}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Weather</p>
                                <p className="text-sm text-muted-foreground">{report.weather}</p>
                              </div>
                            </div>
                            {report.notes && (
                              <div className="mt-4">
                                <p className="text-sm font-medium">Notes</p>
                                <p className="text-sm text-muted-foreground">{report.notes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="community-reports" className="mt-4">
                  <div className="space-y-4">
                    {[
                      {
                        species: "Yellowfin Tuna",
                        date: "2023-06-10",
                        location: "Gulf of Mannar",
                        weight: 18,
                        bait: "Squid",
                        weather: "Sunny",
                        fisher: "Rajan M."
                      },
                      {
                        species: "Indian Mackerel",
                        date: "2023-06-08",
                        location: "Palk Bay",
                        weight: 2.5,
                        bait: "Artificial Lure",
                        weather: "Partly Cloudy",
                        fisher: "Lakshmi P."
                      }
                    ].map((report, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <CardTitle>{report.species}</CardTitle>
                            <span className="text-sm text-muted-foreground">{report.fisher}</span>
                          </div>
                          <CardDescription>{new Date(report.date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{report.location}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Weight</p>
                              <p className="text-sm text-muted-foreground">{report.weight} kg</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Bait Used</p>
                              <p className="text-sm text-muted-foreground">{report.bait}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Weather</p>
                              <p className="text-sm text-muted-foreground">{report.weather}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render main screen with map and bottom tabs
  const renderMainScreen = () => {
    const bottomComponent = (
      <div className="flex flex-col h-full">
        <MobileTabs tabs={primaryTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto p-4">
          <InfoTabs 
            weatherData={weatherData} 
            currentPosition={currentPosition} 
            activeTab={activeTab}
            showTabs={false} 
          />
        </div>
      </div>
    );

    return (
      <div className="flex flex-col h-screen">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          language={language} 
        />
        <div className="flex-1 relative">
          {isMobileMenuOpen && (
            <div className="absolute inset-0 z-20 bg-background">
              <div className="p-4">
                {/* Language selector */}
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-sm font-medium mb-2">{t("language")}</h3>
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-2 rounded-md text-sm ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setLanguage('en')}
                    >
                      English
                    </button>
                    <button
                      className={`px-3 py-2 rounded-md text-sm ${language === 'ta' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setLanguage('ta')}
                    >
                      தமிழ்
                    </button>
                  </div>
                </div>
                
                {/* Secondary tabs */}
                {secondaryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className="flex items-center gap-3 w-full p-3 mb-2 rounded-md hover:bg-muted text-left"
                    onClick={() => navigateToSecondary(tab.id)}
                  >
                    <span className="bg-primary/10 p-2 rounded-md text-primary">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <MobileMapLayout
            mapComponent={
              <MapComponent 
                center={currentPosition || [11.1271, 78.6569]} // Center of Tamil Nadu
                markers={locations}
                selectedLocation={selectedLocation}
                onMapClick={handleMapClick}
                onMarkerClick={handleLocationSelect}
                routes={routes}
              />
            }
            bottomComponent={bottomComponent}
            initialBottomHeight="40vh"
          />
        </div>
      </div>
    );
  };

  // Mobile view with screen navigation
  if (isMobile) {
    return currentScreen === "main" ? renderMainScreen() : renderSecondaryScreen();
  }
  
  // Desktop view rendering
  return (
    <div className="flex flex-col h-screen">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          locations={locations}
          currentPosition={currentPosition}
          weatherData={weatherData}
          selectedLocation={selectedLocation}
          handleMapClick={handleMapClick}
          handleLocationSelect={handleLocationSelect}
          handleDeleteLocation={handleDeleteLocation}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <MapComponent
              center={currentPosition || [11.1271, 78.6569]}
              markers={locations}
              selectedLocation={selectedLocation}
              onMapClick={handleMapClick}
              onMarkerClick={handleLocationSelect}
              routes={routes}
            />
          </div>
          <div className="h-1/3 border-t">
            <InfoTabs weatherData={weatherData} currentPosition={currentPosition} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Add a function to translate text using Google Translate API
const translateText = async (text: string, targetLanguage: string) => {
  try {
    // In a real implementation, you would call the Google Translate API here
    // For now, we'll simulate the API call
    console.log(`Translating: "${text}" to ${targetLanguage}`);
    
    // This would be replaced with actual API call in production
    // const response = await fetch(`https://translation-api.example.com/translate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text, targetLanguage })
    // });
    // const data = await response.json();
    // return data.translatedText;
    
    // For demo purposes, return the original text
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};

