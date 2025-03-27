"use client"

import { Cloud, CloudRain, CloudLightning, Sun, Wind, Droplets, ThermometerSun, Waves } from "lucide-react"

interface WeatherData {
  temperature: number
  conditions: string
  windSpeed: number
  humidity: number
  pressure: number
  icon: string
  waveHeight?: number
  wavePeriod?: number
  waterTemperature?: number
  salinity?: number
  tides?: {
    time: string
    height: number
    type: string
  }[]
}

interface WeatherDisplayProps {
  weather: WeatherData
  detailed?: boolean
}

export default function WeatherDisplay({ weather, detailed = false }: WeatherDisplayProps) {
  // Function to render the appropriate weather icon
  const renderWeatherIcon = () => {
    switch (weather.icon) {
      case "Sun":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "Cloud":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "CloudRain":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "CloudLightning":
        return <CloudLightning className="h-6 w-6 text-purple-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Current Weather</h3>

      <div className="flex items-center gap-3">
        {renderWeatherIcon()}
        <div>
          <div className="font-medium">{weather.temperature}°C</div>
          <div className="text-sm text-muted-foreground">{weather.conditions}</div>
        </div>
      </div>

      {detailed && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Wind: {weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Humidity: {weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Pressure: {weather.pressure} hPa</span>
            </div>
            {weather.waveHeight && (
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Waves: {weather.waveHeight} m</span>
              </div>
            )}
          </div>

          {weather.waterTemperature && (
            <div>
              <h4 className="text-sm font-medium mb-1">Ocean Conditions</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Water: {weather.waterTemperature}°C</span>
                </div>
                {weather.salinity && (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Salinity: {weather.salinity} ppt</span>
                  </div>
                )}
                {weather.wavePeriod && (
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Wave Period: {weather.wavePeriod} s</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {weather.tides && weather.tides.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Tide Information</h4>
              <div className="grid grid-cols-2 gap-2">
                {weather.tides.map((tide, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Waves className={`h-4 w-4 ${tide.type === "high" ? "text-blue-500" : "text-amber-500"}`} />
                    <span className="text-sm">
                      {tide.type === "high" ? "High" : "Low"}: {tide.time} ({tide.height}m)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

