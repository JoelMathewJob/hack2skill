"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, Send, Star, Calendar } from "lucide-react"

interface ForumPost {
  id: string
  author: {
    name: string
    avatar?: string
  }
  title: string
  content: string
  date: string
  likes: number
  comments: number
  tags: string[]
}

interface FishingSpotRating {
  id: string
  location: string
  coordinates: [number, number]
  rating: number
  author: string
  date: string
  comment: string
}

export default function CommunityForum() {
  const [activeTab, setActiveTab] = useState("discussions")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")

  // Mock forum posts
  const mockPosts: ForumPost[] = [
    {
      id: "post-1",
      author: {
        name: "FisherKing",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Best time to catch Kingfish near Chennai?",
      content:
        "I've been trying to catch Kingfish for weeks with no luck. Any suggestions on the best time of day and bait to use in the Chennai coastal area?",
      date: "2023-05-15T10:30:00Z",
      likes: 12,
      comments: 8,
      tags: ["Kingfish", "Chennai", "Bait"],
    },
    {
      id: "post-2",
      author: {
        name: "SeaExplorer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Warning: Strong currents near Kanyakumari",
      content:
        "Just a heads up to everyone fishing near Kanyakumari this week. The currents are unusually strong due to the recent weather patterns. Be extra cautious and make sure your boat is equipped with proper safety gear.",
      date: "2023-05-20T14:15:00Z",
      likes: 24,
      comments: 5,
      tags: ["Safety", "Kanyakumari", "Weather"],
    },
    {
      id: "post-3",
      author: {
        name: "NetMaster",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "New regulations for fishing in protected areas",
      content:
        "The Fisheries Department has announced new regulations for fishing in marine protected areas. Make sure you're aware of the updated rules to avoid fines.",
      date: "2023-05-18T09:45:00Z",
      likes: 18,
      comments: 12,
      tags: ["Regulations", "Protected Areas", "Legal"],
    },
  ]

  // Mock fishing spot ratings
  const mockRatings: FishingSpotRating[] = [
    {
      id: "rating-1",
      location: "Rameshwaram Coral Reef Edge",
      coordinates: [9.2876, 79.3129],
      rating: 4.5,
      author: "DeepSeaFisher",
      date: "2023-05-10T08:20:00Z",
      comment:
        "Excellent spot for reef fishing. Caught several Red Snappers and Groupers. Water is clear and currents are manageable.",
    },
    {
      id: "rating-2",
      location: "Chennai Harbor North Side",
      coordinates: [13.1322, 80.3271],
      rating: 3.5,
      author: "CoastalCaptain",
      date: "2023-05-12T16:40:00Z",
      comment:
        "Decent spot for Mackerel. Some pollution near the harbor, but fishing improves as you move further out.",
    },
    {
      id: "rating-3",
      location: "Gulf of Mannar Islands",
      coordinates: [9.127, 79.4089],
      rating: 5.0,
      author: "IslandHopper",
      date: "2023-05-08T07:15:00Z",
      comment:
        "One of the best fishing spots I've found. Amazing biodiversity and plenty of large fish. Worth the journey!",
    },
  ]

  const handlePostSubmit = () => {
    if (!newPostTitle || !newPostContent) return

    // In a real app, this would send the post to a backend
    alert("Post submitted! In a real app, this would be saved to a database.")

    // Reset form
    setNewPostTitle("")
    setNewPostContent("")
  }

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-muted-foreground" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />)
    }

    return <div className="flex">{stars}</div>
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="spots">Fishing Spots</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Community Discussions</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("create")} className="text-xs h-8">
              New Post
            </Button>
          </div>

          <ScrollArea className="h-[350px]">
            <div className="space-y-3">
              {mockPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{post.author.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-base mt-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span className="text-xs">{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="text-xs">{post.comments}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      View Discussion
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="spots" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Fishing Spot Ratings</h3>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Rate a Spot
            </Button>
          </div>

          <ScrollArea className="h-[350px]">
            <div className="space-y-3">
              {mockRatings.map((rating) => (
                <Card key={rating.id}>
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{rating.location}</CardTitle>
                      {renderStars(rating.rating)}
                    </div>
                    <CardDescription className="text-xs">
                      {rating.coordinates[0].toFixed(4)}, {rating.coordinates[1].toFixed(4)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <p className="text-sm">{rating.comment}</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(rating.date).toLocaleDateString()}</span>
                    </div>
                    <span>By {rating.author}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="create" className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">Create New Post</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Post Title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Share your fishing experience, ask questions, or provide tips..."
                className="min-h-[150px]"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveTab("discussions")}>
                Cancel
              </Button>
              <Button onClick={handlePostSubmit} disabled={!newPostTitle || !newPostContent}>
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

