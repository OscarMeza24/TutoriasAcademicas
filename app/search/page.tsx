"use client"

import { Header } from "@/components/layout/header"
import { SearchForm } from "@/components/forms/search-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, DollarSign, MessageCircle, Calendar } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

// Mock tutor data
const mockTutors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=64&width=64",
    subjects: ["Mathematics", "Physics"],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 45,
    location: "Online & Boston, MA",
    experience: "8 years",
    languages: ["English", "Spanish"],
    availability: "Weekdays 2-8 PM",
    bio: "PhD in Mathematics with extensive experience in calculus, algebra, and physics tutoring.",
    verified: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=64&width=64",
    subjects: ["Computer Science", "Python"],
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 55,
    location: "Online Only",
    experience: "5 years",
    languages: ["English", "Mandarin"],
    availability: "Flexible",
    bio: "Software engineer turned educator, specializing in programming and computer science fundamentals.",
    verified: true,
  },
  {
    id: "3",
    name: "Prof. Maria Rodriguez",
    avatar: "/placeholder.svg?height=64&width=64",
    subjects: ["Spanish", "Literature"],
    rating: 5.0,
    reviewCount: 203,
    hourlyRate: 40,
    location: "Online & Miami, FL",
    experience: "12 years",
    languages: ["Spanish", "English"],
    availability: "Evenings & Weekends",
    bio: "Native Spanish speaker and literature professor with passion for language education.",
    verified: true,
  },
]

export default function SearchPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="flex-1 py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20"
      >
        <div className="container mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("search.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("search.subtitle")}</p>
          </div>

          {/* Search Form */}
          <SearchForm />

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{t("search.results")}</h2>
              <p className="text-muted-foreground">
                {mockTutors.length} {t("search.tutorsFound")}
              </p>
            </div>

            {/* Tutor Cards */}
            <div className="grid gap-6">
              {mockTutors.map((tutor) => (
                <Card
                  key={tutor.id}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border-border"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar and Basic Info */}
                      <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {tutor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {tutor.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="sr-only">Verified tutor</span>
                            </div>
                          )}
                        </div>

                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold text-card-foreground">{tutor.name}</h3>
                          <div className="flex items-center gap-1 justify-center md:justify-start">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                            <span className="font-medium text-card-foreground">{tutor.rating}</span>
                            <span className="text-muted-foreground">({tutor.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 space-y-4">
                        {/* Subjects */}
                        <div>
                          <h4 className="font-medium mb-2 text-card-foreground">Subjects</h4>
                          <div className="flex flex-wrap gap-2">
                            {tutor.subjects.map((subject) => (
                              <Badge key={subject} variant="secondary">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-muted-foreground">{tutor.bio}</p>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" aria-hidden="true" />
                            <span className="font-medium text-card-foreground">${tutor.hourlyRate}/hour</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            <span className="text-card-foreground">{tutor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" aria-hidden="true" />
                            <span className="text-card-foreground">{tutor.availability}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-card-foreground">Experience:</span>
                            <span className="text-card-foreground">{tutor.experience}</span>
                          </div>
                        </div>

                        {/* Languages */}
                        <div>
                          <span className="font-medium text-sm text-card-foreground">Languages: </span>
                          <span className="text-sm text-muted-foreground">{tutor.languages.join(", ")}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 md:w-48">
                        <EnhancedButton
                          leftIcon={<Calendar className="h-4 w-4" />}
                          fullWidth
                          aria-label={`Book session with ${tutor.name}`}
                        >
                          {t("search.bookSession")}
                        </EnhancedButton>
                        <EnhancedButton
                          variant="outline"
                          leftIcon={<MessageCircle className="h-4 w-4" />}
                          fullWidth
                          aria-label={`Send message to ${tutor.name}`}
                        >
                          {t("search.sendMessage")}
                        </EnhancedButton>
                        <EnhancedButton variant="ghost" fullWidth aria-label={`View ${tutor.name}'s full profile`}>
                          {t("search.viewProfile")}
                        </EnhancedButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
              <EnhancedButton variant="outline" size="lg">
                {t("search.loadMore")}
              </EnhancedButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
