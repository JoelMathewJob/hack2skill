export interface Location {
  id: string
  name: string
  lat: number
  lng: number
  notes: string
  dateAdded: string
  fishCaught?: string[]
}

export interface WeatherData {
  temperature: number
  conditions: string
  windSpeed: number
  humidity: number
  pressure: number
  icon: string
}

export interface Route {
  id: string
  name: string
  waypoints: {
    lat: number
    lng: number
    name: string
  }[]
  distance: number
  estimatedTime: number
  estimatedFuel: number
}

export interface CatchReport {
  id: string
  date: string
  location: {
    lat: number
    lng: number
    name: string
  }
  species: string[]
  quantity: number
  weight?: number
  notes?: string
}

export interface FuelReport {
  id: string
  date: string
  amount: number
  cost: number
  tripId?: string
}

export interface ExpenseReport {
  id: string
  date: string
  category: string
  amount: number
  description: string
  tripId?: string
}

