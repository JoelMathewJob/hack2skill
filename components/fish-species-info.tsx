"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FishSpecies {
  name: string
  scientificName: string
  description: string
  habitat: string
  bestBait: string[]
  bestTime: string
  image: string
}

interface FishSpeciesInfoProps {
  currentPosition: [number, number] | null
}

export default function FishSpeciesInfo({ currentPosition }: FishSpeciesInfoProps) {
  const [region, setRegion] = useState("freshwater")

  // Mock fish species data - in a real app, this would come from an API based on location
  const fishSpecies: Record<string, FishSpecies[]> = {
    freshwater: [
      {
        name: "Largemouth Bass",
        scientificName: "Micropterus salmoides",
        description: "A popular game fish known for its aggressive strikes and fighting ability.",
        habitat: "Lakes, ponds, and slow-moving rivers with vegetation and structure.",
        bestBait: ["Plastic worms", "Crankbaits", "Topwater lures", "Live minnows"],
        bestTime: "Early morning and late evening, especially during summer.",
        image: "/placeholder.svg?height=150&width=300",
      },
      {
        name: "Rainbow Trout",
        scientificName: "Oncorhynchus mykiss",
        description: "A beautiful fish with distinctive coloring and a reputation for being a good fighter.",
        habitat: "Cold, clear streams, rivers, and lakes with plenty of oxygen.",
        bestBait: ["Small spinners", "Flies", "Powerbait", "Worms"],
        bestTime: "Early morning and late evening, best in spring and fall.",
        image: "/placeholder.svg?height=150&width=300",
      },
      {
        name: "Bluegill",
        scientificName: "Lepomis macrochirus",
        description: "A small but feisty panfish that's great for beginners and experienced anglers alike.",
        habitat: "Ponds, lakes, and slow-moving streams with vegetation and structure.",
        bestBait: ["Worms", "Crickets", "Small jigs", "Bread balls"],
        bestTime: "Midday during spring and fall, early morning and late evening during summer.",
        image: "/bass.png",
      },
    ],
    saltwater: [
      {
        name: "Striped Bass",
        scientificName: "Morone saxatilis",
        description: "A powerful, migratory fish that can grow to impressive sizes.",
        habitat: "Coastal waters, estuaries, and tidal rivers.",
        bestBait: ["Live eels", "Bunker chunks", "Swimming plugs", "Bucktail jigs"],
        bestTime: "Dawn and dusk, especially during spring and fall migrations.",
        image: "/placeholder.svg?height=150&width=300",
      },
      {
        name: "Red Drum",
        scientificName: "Sciaenops ocellatus",
        description: "Also known as redfish, these copper-colored fish have a distinctive spot on their tail.",
        habitat: "Shallow coastal waters, estuaries, and tidal flats.",
        bestBait: ["Live shrimp", "Cut mullet", "Gold spoons", "Soft plastic jigs"],
        bestTime: "Year-round, but especially good during fall.",
        image: "/placeholder.svg?height=150&width=300",
      },
      {
        name: "Flounder",
        scientificName: "Paralichthys spp.",
        description: "A flat, bottom-dwelling fish with both eyes on one side of its body.",
        habitat: "Sandy or muddy bottoms in coastal waters and estuaries.",
        bestBait: ["Live minnows", "Soft plastic jigs", "Strip baits", "Gulp! baits"],
        bestTime: "Best during fall migration, especially on outgoing tides.",
        image: "/placeholder.svg?height=150&width=300",
      },
    ],
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="freshwater" value={region} onValueChange={setRegion}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="freshwater">Freshwater</TabsTrigger>
          <TabsTrigger value="saltwater">Saltwater</TabsTrigger>
        </TabsList>
        <TabsContent value="freshwater" className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">Common freshwater species in your area:</p>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {fishSpecies.freshwater.map((fish, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{fish.name}</CardTitle>
                    <CardDescription className="text-xs italic">{fish.scientificName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex gap-4 items-start">
                      <img
                        src={fish.image || "/placeholder.svg"}
                        alt={fish.name}
                        className="w-24 h-16 object-cover rounded-md"
                      />
                      <div className="text-xs">
                        <p>{fish.description}</p>
                        <p className="mt-1">
                          <span className="font-medium">Habitat:</span> {fish.habitat}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <p className="font-medium">Best Baits:</p>
                      <ul className="list-disc pl-5">
                        {fish.bestBait.map((bait, i) => (
                          <li key={i}>{bait}</li>
                        ))}
                      </ul>
                      <p className="mt-1">
                        <span className="font-medium">Best Time:</span> {fish.bestTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="saltwater" className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">Common saltwater species in your area:</p>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {fishSpecies.saltwater.map((fish, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{fish.name}</CardTitle>
                    <CardDescription className="text-xs italic">{fish.scientificName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex gap-4 items-start">
                      <img
                        src={fish.image || "/placeholder.svg"}
                        alt={fish.name}
                        className="w-24 h-16 object-cover rounded-md"
                      />
                      <div className="text-xs">
                        <p>{fish.description}</p>
                        <p className="mt-1">
                          <span className="font-medium">Habitat:</span> {fish.habitat}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <p className="font-medium">Best Baits:</p>
                      <ul className="list-disc pl-5">
                        {fish.bestBait.map((bait, i) => (
                          <li key={i}>{bait}</li>
                        ))}
                      </ul>
                      <p className="mt-1">
                        <span className="font-medium">Best Time:</span> {fish.bestTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

