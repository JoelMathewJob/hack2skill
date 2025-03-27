"use client"

import { Button } from "@/components/ui/button"
import { Fish, Menu, X, Waves } from "lucide-react"

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  language?: string
}

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen, language = "en" }: HeaderProps) {
  const title = language === "ta" ? "மத்ஸ்யமித்ரா" : "MatsyaMitra";
  const subtitle = language === "ta" ? "மீனவர் நண்பன்" : "Fisher's Friend";
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Fish className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center">
              {title}
              {/* <Waves className="h-4 w-4 ml-1 text-blue-200" /> */}
            </h1>
            {/* <p className="text-xs text-blue-100">{subtitle}</p> */}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </header>
  )
}

