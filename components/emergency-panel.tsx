"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, LifeBuoy, Phone } from "lucide-react"

interface EmergencyPanelProps {
  position: [number, number] | null
  onCancel: () => void
}

export default function EmergencyPanel({ position, onCancel }: EmergencyPanelProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isSending, setIsSending] = useState(true)

  // Simulate sending SOS signals
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    // Simulate signal sent after 3 seconds
    const signalTimer = setTimeout(() => {
      setIsSending(false)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(signalTimer)
    }
  }, [])

  // Format elapsed time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-4 h-full flex flex-col bg-red-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
          <LifeBuoy className="h-6 w-6" />
          Emergency Mode Active
        </h2>
        <div className="text-red-700 font-mono font-bold">{formatTime(elapsedTime)}</div>
      </div>

      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>SOS Signal Active</AlertTitle>
        <AlertDescription>
          Emergency services have been notified of your situation and location.
          {position && (
            <p className="mt-1">
              Your coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-4 flex-1">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Coast Guard:</span>
                <span className={isSending ? "text-amber-500" : "text-green-500"}>
                  {isSending ? "Sending..." : "Notified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Emergency Contacts:</span>
                <span className={isSending ? "text-amber-500" : "text-green-500"}>
                  {isSending ? "Sending..." : "Notified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>GPS Location:</span>
                <span className="text-green-500">Transmitting</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Coast Guard</p>
                  <p className="text-sm text-muted-foreground">1-800-555-0000</p>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Marine Rescue</p>
                  <p className="text-sm text-muted-foreground">1-800-555-0001</p>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 pt-4 border-t border-red-200">
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancel Emergency Mode
        </Button>
        <p className="text-xs text-center mt-2 text-red-600">
          Only cancel if your emergency situation has been resolved.
        </p>
      </div>
    </div>
  )
}

