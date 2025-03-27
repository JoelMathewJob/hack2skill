"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface MobileMapLayoutProps {
  mapComponent: React.ReactNode
  bottomComponent: React.ReactNode
  initialBottomHeight: string
}

export default function MobileMapLayout({
  mapComponent,
  bottomComponent,
  initialBottomHeight = "80vh",
}: MobileMapLayoutProps) {
  const [bottomHeight, setBottomHeight] = useState(initialBottomHeight)
  const [isExpanded, setIsExpanded] = useState(false)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)
  const startHeightRef = useRef<number | null>(null)
  const isDraggingRef = useRef<boolean>(false)

  // Toggle between collapsed, default and expanded states
  const toggleBottomPanel = () => {
    if (isExpanded) {
      // If expanded, collapse to initial height
      setBottomHeight(initialBottomHeight)
      setIsExpanded(false)
    } else {
      // If at initial height, expand to 80vh
      setBottomHeight("70vh")
      setIsExpanded(true)
    }
  }

  // Set up drag handlers
  useEffect(() => {
    const dragHandle = dragHandleRef.current
    if (!dragHandle) return

    // Separate click handler for mobile
    const handleClick = (e: MouseEvent | TouchEvent) => {
      // Only handle as click if we didn't drag
      if (!isDraggingRef.current) {
        toggleBottomPanel()
      }
      // Reset dragging state
      isDraggingRef.current = false
    }

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      // Don't prevent default on touchstart to allow click events
      if ('touches' in e) {
        // For touch events, we'll set dragging in move
      } else {
        e.preventDefault()
      }
      
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      startYRef.current = clientY
      startHeightRef.current = parseInt(bottomHeight)
      
      document.addEventListener('mousemove', handleDragMove, { passive: false })
      document.addEventListener('touchmove', handleDragMove, { passive: false })
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchend', handleDragEnd)
    }

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (startYRef.current === null || startHeightRef.current === null) return
      
      // Set dragging flag to prevent click
      isDraggingRef.current = true
      
      // Now prevent default to stop scrolling during drag
      e.preventDefault()
      
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const deltaY = startYRef.current - clientY
      const windowHeight = window.innerHeight
      
      // Calculate new height as percentage of viewport height
      const newHeightVh = startHeightRef.current + (deltaY / windowHeight * 100)
      
      // Constrain between 20vh and 90vh
      const constrainedHeight = Math.max(20, Math.min(90, newHeightVh))
      setBottomHeight(`${constrainedHeight}vh`)
      
      // Update expanded state based on height
      setIsExpanded(constrainedHeight > parseInt(initialBottomHeight))
    }

    const handleDragEnd = () => {
      startYRef.current = null
      startHeightRef.current = null
      
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('touchmove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
      
      // Keep dragging flag for a short time to prevent click
      setTimeout(() => {
        isDraggingRef.current = false
      }, 300)
    }

    // Add both click and drag handlers
    dragHandle.addEventListener('click', handleClick)
    dragHandle.addEventListener('mousedown', handleDragStart)
    dragHandle.addEventListener('touchstart', handleDragStart)

    return () => {
      dragHandle.removeEventListener('click', handleClick)
      dragHandle.removeEventListener('mousedown', handleDragStart)
      dragHandle.removeEventListener('touchstart', handleDragStart)
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('touchmove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    }
  }, [bottomHeight, initialBottomHeight, toggleBottomPanel])

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Map area - takes remaining space */}
      <div className="flex-1 relative" style={{ height: `calc(100% - ${bottomHeight})` }}>
        {mapComponent}
      </div>

      {/* Bottom panel - draggable */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-lg transition-all duration-300 ease-in-out"
        style={{ height: bottomHeight }}
      >
        {/* Drag handle - increased touch target */}
        <div 
          ref={dragHandleRef}
          className="h-8 w-full flex items-center justify-center cursor-grab active:cursor-grabbing border-b"
          // onClick removed - now handled in useEffect
        >
          <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
          {isExpanded ? 
            <ChevronDown className="absolute right-3 h-4 w-4 text-muted-foreground" /> : 
            <ChevronUp className="absolute right-3 h-4 w-4 text-muted-foreground" />
          }
        </div>

        {/* Content area */}
        <div className="overflow-auto h-[calc(100%-2rem)]">
          {bottomComponent}
        </div>
      </div>
    </div>
  )
}

