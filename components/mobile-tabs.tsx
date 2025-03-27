"use client"

import { useRef, useEffect } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

interface MobileTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function MobileTabs({ tabs, activeTab, onTabChange }: MobileTabsProps) {
  const activeTabRef = useRef<HTMLButtonElement>(null)
  
  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeTab])

  return (
    <div className="border-b bg-background">
      <ScrollArea className="w-full" type="scroll">
        <div className="flex justify-around px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={tab.id === activeTab ? activeTabRef : null}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 text-xs rounded-md transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.icon}
              <span className="mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  )
}

