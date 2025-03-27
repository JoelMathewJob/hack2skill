"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

interface MarketData {
  id: string
  marketName: string
  location: string
  species: string
  price: number
  unit: string
  date: string
}

interface MarketPricesProps {
  marketData: MarketData[]
  isLoading?: boolean
}

export default function MarketPrices({ marketData, isLoading = false }: MarketPricesProps) {
  const [activeTab, setActiveTab] = useState("prices")
  const [filterSpecies, setFilterSpecies] = useState<string>("")
  const [filterMarket, setFilterMarket] = useState<string>("")

  // Get unique species and markets for filters
  const uniqueSpecies = Array.from(new Set(marketData.map((item) => item.species)))
  const uniqueMarkets = Array.from(new Set(marketData.map((item) => item.marketName)))

  // Filter market data based on selected filters
  const filteredData = marketData.filter((item) => {
    if (filterSpecies && item.species !== filterSpecies) return false
    if (filterMarket && item.marketName !== filterMarket) return false
    return true
  })

  // Sort by price (lowest first)
  const sortedData = [...filteredData].sort((a, b) => a.price - b.price)

  // Use a stable date format that will be consistent between server and client
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="prices">Current Prices</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filter Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterSpecies("")
                  setFilterMarket("")
                }}
                className="h-8 text-xs"
              >
                Clear Filters
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Select value={filterSpecies} onValueChange={setFilterSpecies}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Species</SelectItem>
                    {uniqueSpecies.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterMarket} onValueChange={setFilterMarket}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Markets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Markets</SelectItem>
                    {uniqueMarkets.map((market) => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <p>Loading market data...</p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-medium">Current Market Prices</h3>
              <ScrollArea className="h-[550px]">
                <div className="space-y-2">
                  {sortedData.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No market data available for the selected filters.
                    </p>
                  ) : (
                    sortedData.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-base flex justify-between items-center">
                            <span>{item.species}</span>
                            <span className="text-lg font-bold">
                              ₹{item.price}/{item.unit}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-2">
                          <div className="flex justify-between items-center text-sm">
                            <div className="text-muted-foreground">{item.marketName}</div>
                            <div className="text-xs">{formatDate(item.date)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Market Trends</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Price trend analysis will be available in the next update. This feature will show price changes over time
              to help you make better selling decisions.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

