"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2 } from "lucide-react"

export default function FullScreenProvider({ children }: { children: React.ReactNode }) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    // Only show the prompt on mobile devices
    if (isMobile) {
      // Wait a moment before showing the prompt
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    
    // Listen for fullscreen changes
    const handleFullScreenChange = () => {
      setIsFullScreen(
        !!(document.fullscreenElement || 
          (document as any).webkitFullscreenElement || 
          (document as any).mozFullScreenElement || 
          (document as any).msFullscreenElement)
      )
    }
    
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange)
    document.addEventListener('mozfullscreenchange', handleFullScreenChange)
    document.addEventListener('MSFullscreenChange', handleFullScreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange)
    }
  }, [])

  const enterFullScreen = () => {
    const docEl = document.documentElement
    
    const requestFullScreen = 
      docEl.requestFullscreen || 
      (docEl as any).mozRequestFullScreen || 
      (docEl as any).webkitRequestFullscreen || 
      (docEl as any).msRequestFullscreen
    
    if (requestFullScreen) {
      requestFullScreen.call(docEl)
      setShowPrompt(false)
    }
  }

  return (
    <>
      {children}
      
      {showPrompt && !isFullScreen && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-md bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">Get the full experience</p>
            <p className="opacity-90">Use MatsyaMitra in full screen mode</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-1.5" 
            onClick={enterFullScreen}
          >
            <Maximize2 className="h-4 w-4" />
            <span>Full Screen</span>
          </Button>
        </div>
      )}
    </>
  )
} 