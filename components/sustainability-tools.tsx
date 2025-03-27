"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Leaf, AlertTriangle, Info, Award, ExternalLink } from "lucide-react"

interface SustainabilityToolsProps {
  sustainabilityScore?: number
}

export default function SustainabilityTools({ sustainabilityScore = 75 }: SustainabilityToolsProps) {
  const [activeTab, setActiveTab] = useState("score")

  // Get color based on sustainability score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
  }

  // Get progress color based on sustainability score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  // Mock fish species data for identification guide
  const fishSpecies = [
    {
      name: "Indian Mackerel",
      scientificName: "Rastrelliger kanagurta",
      description: "Metallic blue-green back with dark bands, silver belly. Common in coastal waters.",
      status: "Sustainable",
      minSize: "20cm",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      name: "Oil Sardine",
      scientificName: "Sardinella longiceps",
      description: "Small, silver fish with blue-green back. Forms large schools in coastal waters.",
      status: "Sustainable",
      minSize: "15cm",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      name: "Malabar Trevally",
      scientificName: "Carangoides malabaricus",
      description: "Silver body with yellow fins. Found in coastal reefs and sandy bottoms.",
      status: "Moderate Concern",
      minSize: "25cm",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      name: "Barramundi",
      scientificName: "Lates calcarifer",
      description: "Large, silver fish with compressed body. Can live in fresh and saltwater.",
      status: "Sustainable",
      minSize: "40cm",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      name: "Bluefin Tuna",
      scientificName: "Thunnus thynnus",
      description: "Large, powerful fish with metallic blue top and silver sides.",
      status: "Overfished",
      minSize: "70cm",
      image: "/placeholder.svg?height=100&width=200",
    },
  ]

  // Mock overfishing alerts
  const overfishingAlerts = [
    {
      species: "Bluefin Tuna",
      area: "Bay of Bengal",
      description: "Populations have declined by 60% in the last decade. Consider alternative target species.",
    },
    {
      species: "Hilsa",
      area: "Coastal Tamil Nadu",
      description: "Seasonal fishing restrictions in place to allow population recovery during spawning season.",
    },
    {
      species: "Sharks (all species)",
      area: "All regions",
      description: "Many shark species are threatened. Avoid targeting and release any accidental catches.",
    },
  ]

  // Mock sustainable practices
  const sustainablePractices = [
    {
      title: "Use Selective Fishing Gear",
      description: "Choose gear that minimizes bycatch and allows juvenile fish to escape.",
    },
    {
      title: "Respect Size Limits",
      description: "Release undersized fish to allow them to reproduce at least once before harvest.",
    },
    {
      title: "Avoid Spawning Aggregations",
      description: "Avoid fishing in areas where fish gather to spawn, especially during breeding seasons.",
    },
    {
      title: "Report Illegal Fishing",
      description: "Report any observed illegal fishing activities to local authorities.",
    },
    {
      title: "Reduce Plastic Waste",
      description: "Properly dispose of fishing line, nets, and other gear to prevent ghost fishing.",
    },
  ]

  // Mock educational resources
  const educationalResources = [
    {
      title: "Marine Conservation India",
      description: "Information on marine protected areas and conservation efforts in India.",
      url: "https://example.com/marine-conservation",
    },
    {
      title: "Sustainable Fishing Practices Guide",
      description: "Comprehensive guide to sustainable fishing methods for small-scale fishers.",
      url: "https://example.com/sustainable-fishing",
    },
    {
      title: "Fish Species Identification App",
      description: "Mobile app to help identify fish species and learn about their conservation status.",
      url: "https://example.com/fish-id-app",
    },
  ]

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="score">My Score</TabsTrigger>
          <TabsTrigger value="guide"> Guide</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="practices">Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="score" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Sustainability Score</CardTitle>
              <CardDescription>Based on your fishing patterns and reported catches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className={`text-4xl font-bold ${getScoreColor(sustainabilityScore)}`}>
                  {sustainabilityScore}
                </span>
                <span className="text-4xl font-bold text-muted-foreground">/100</span>
              </div>

              <Progress value={sustainabilityScore} className={getProgressColor(sustainabilityScore)} />

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Score Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Species Diversity:</span>
                    <span className="font-medium">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Catch Size Compliance:</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protected Species Avoidance:</span>
                    <span className="font-medium">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seasonal Compliance:</span>
                    <span className="font-medium">Moderate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sustainability Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <Leaf className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Consider targeting more abundant species like Mackerel and Sardines during your next trips.</p>
                </div>
                <div className="flex gap-2">
                  <Leaf className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Your catch reporting helps improve fishery management. Keep up the good work!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">Species Identification Guide</h3>

          <ScrollArea className="h-[550px]">
            <div className="space-y-4">
              {fishSpecies.map((species) => (
                <Card key={species.name}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                      <img
                        src={species.image || "/placeholder.svg"}
                        alt={species.name}
                        className="w-full h-32 object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                      />
                    </div>
                    <div className="sm:w-2/3 p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{species.name}</h4>
                          <p className="text-xs italic text-muted-foreground">{species.scientificName}</p>
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            species.status === "Sustainable"
                              ? "bg-green-100 text-green-800"
                              : species.status === "Moderate Concern"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {species.status}
                        </div>
                      </div>
                      <p className="text-sm mt-2">{species.description}</p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Minimum Size: </span>
                        {species.minSize}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">Overfishing Alerts</h3>

          <div className="space-y-3">
            {overfishingAlerts.map((alert, index) => (
              <Card key={index} className="border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {alert.species}
                  </CardTitle>
                  <CardDescription>{alert.area}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">{alert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-sm font-medium mt-6">Sustainable Fishing Practices</h3>

          <div className="space-y-3">
            {sustainablePractices.map((practice, index) => (
              <Card key={index}>
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    {practice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-sm">{practice.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practices" className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">Educational Resources</h3>

          <div className="space-y-3">
            {educationalResources.map((resource, index) => (
              <Card key={index}>
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-sm mb-2">{resource.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Visit Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Sustainable Fishing Certification
              </CardTitle>
              <CardDescription>Get recognized for your sustainable fishing practices</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Maintain a sustainability score above 80 for three months to qualify for the Sustainable Fisher
                certification. This can help you access premium markets and support conservation efforts.
              </p>
              <Button className="w-full">Learn More About Certification</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

