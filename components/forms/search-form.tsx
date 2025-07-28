"use client"

import type React from "react"
import { useState } from "react"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Filter, X, MapPin, DollarSign, Star } from "lucide-react"

interface SearchFilters {
  query: string
  subject: string
  priceRange: [number, number]
  availability: string
  rating: number
  location: string
  experience: string
  language: string
}

const subjectOptions = [
  { value: "all", label: "All Subjects" }, // Cambiar de "" a "all"
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "computer-science", label: "Computer Science" },
  { value: "english", label: "English Literature" },
  { value: "history", label: "History" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
]

const availabilityOptions = [
  { value: "any", label: "Any Time" }, // Cambiar de "" a "any"
  { value: "morning", label: "Morning (6AM - 12PM)" },
  { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { value: "evening", label: "Evening (6PM - 10PM)" },
  { value: "weekend", label: "Weekends Only" },
]

const experienceOptions = [
  { value: "any", label: "Any Experience" }, // Cambiar de "" a "any"
  { value: "beginner", label: "New Tutor (< 1 year)" },
  { value: "intermediate", label: "Experienced (1-3 years)" },
  { value: "advanced", label: "Expert (3+ years)" },
]

const languageOptions = [
  { value: "any", label: "Any Language" }, // Cambiar de "" a "any"
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "mandarin", label: "Mandarin" },
  { value: "arabic", label: "Arabic" },
]

export function SearchForm() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    subject: "all", // Cambiar de "" a "all"
    priceRange: [10, 100],
    availability: "any", // Cambiar de "" a "any"
    rating: 0,
    location: "",
    experience: "any", // Cambiar de "" a "any"
    language: "any", // Cambiar de "" a "any"
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    updateActiveFilters({ ...filters, [key]: value })
  }

  const updateActiveFilters = (currentFilters: SearchFilters) => {
    const active: string[] = []

    if (currentFilters.query) active.push(`Search: "${currentFilters.query}"`)
    if (currentFilters.subject && currentFilters.subject !== "all") {
      const subject = subjectOptions.find((s) => s.value === currentFilters.subject)
      if (subject) active.push(`Subject: ${subject.label}`)
    }
    if (currentFilters.priceRange[0] > 10 || currentFilters.priceRange[1] < 100) {
      active.push(`Price: $${currentFilters.priceRange[0]}-$${currentFilters.priceRange[1]}/hr`)
    }
    if (currentFilters.availability && currentFilters.availability !== "any") {
      const availability = availabilityOptions.find((a) => a.value === currentFilters.availability)
      if (availability) active.push(`Time: ${availability.label}`)
    }
    if (currentFilters.rating > 0) {
      active.push(`Rating: ${currentFilters.rating}+ stars`)
    }
    if (currentFilters.location) active.push(`Location: ${currentFilters.location}`)
    if (currentFilters.experience && currentFilters.experience !== "any") {
      const experience = experienceOptions.find((e) => e.value === currentFilters.experience)
      if (experience) active.push(`Experience: ${experience.label}`)
    }
    if (currentFilters.language && currentFilters.language !== "any") {
      const language = languageOptions.find((l) => l.value === currentFilters.language)
      if (language) active.push(`Language: ${language.label}`)
    }

    setActiveFilters(active)
  }

  const clearFilter = (filterText: string) => {
    const newFilters = { ...filters }

    if (filterText.startsWith("Search:")) newFilters.query = ""
    else if (filterText.startsWith("Subject:")) newFilters.subject = "all"
    else if (filterText.startsWith("Price:")) newFilters.priceRange = [10, 100]
    else if (filterText.startsWith("Time:")) newFilters.availability = "any"
    else if (filterText.startsWith("Rating:")) newFilters.rating = 0
    else if (filterText.startsWith("Location:")) newFilters.location = ""
    else if (filterText.startsWith("Experience:")) newFilters.experience = "any"
    else if (filterText.startsWith("Language:")) newFilters.language = "any"

    setFilters(newFilters)
    updateActiveFilters(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      subject: "all",
      priceRange: [10, 100],
      availability: "any",
      rating: 0,
      location: "",
      experience: "any",
      language: "any",
    }
    setFilters(clearedFilters)
    setActiveFilters([])
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    try {
      // Simulate search API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Searching with filters:", filters)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" aria-hidden="true" />
          Find Your Perfect Tutor
        </CardTitle>
        <CardDescription>
          Search through our network of qualified tutors using advanced filters to find the perfect match for your
          learning needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6" noValidate>
          {/* Main Search */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <EnhancedInput
                id="search-query"
                label="Search for tutors, subjects, or topics"
                showLabel={false}
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                placeholder="e.g., 'Calculus tutor', 'Spanish conversation', 'SAT prep'..."
                leftIcon={<Search className="h-4 w-4" />}
                helperText="Enter keywords to search for specific tutors or subjects"
              />
            </div>
            <EnhancedSelect
              id="search-subject"
              label="Subject"
              showLabel={false}
              placeholder="Select subject"
              options={subjectOptions}
              value={filters.subject}
              onValueChange={(value) => handleFilterChange("subject", value)}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              leftIcon={<Filter className="h-4 w-4" />}
              aria-expanded={showAdvancedFilters}
              aria-controls="advanced-filters"
            >
              {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
            </EnhancedButton>

            {activeFilters.length > 0 && (
              <EnhancedButton
                type="button"
                variant="ghost"
                onClick={clearAllFilters}
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear All Filters
              </EnhancedButton>
            )}
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <button
                      type="button"
                      onClick={() => clearFilter(filter)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      aria-label={`Remove ${filter} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div id="advanced-filters" className="space-y-6 p-4 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold">Advanced Search Options</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" aria-hidden="true" />
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]} per hour
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    max={200}
                    min={5}
                    step={5}
                    className="w-full"
                    aria-label="Price range slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$5/hr</span>
                    <span>$200/hr</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" aria-hidden="true" />
                    Minimum Rating: {filters.rating > 0 ? `${filters.rating} stars` : "Any rating"}
                  </Label>
                  <Slider
                    value={[filters.rating]}
                    onValueChange={(value) => handleFilterChange("rating", value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                    aria-label="Minimum rating slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Any</span>
                    <span>5 stars</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <EnhancedSelect
                  id="availability-filter"
                  label="Availability"
                  placeholder="Select availability"
                  options={availabilityOptions}
                  value={filters.availability}
                  onValueChange={(value) => handleFilterChange("availability", value)}
                  helperText="When do you prefer to have sessions?"
                />

                <EnhancedInput
                  id="location-filter"
                  label="Location"
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  placeholder="City, state, or 'online'"
                  leftIcon={<MapPin className="h-4 w-4" />}
                  helperText="Enter location or 'online' for remote sessions"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <EnhancedSelect
                  id="experience-filter"
                  label="Experience Level"
                  placeholder="Select experience"
                  options={experienceOptions}
                  value={filters.experience}
                  onValueChange={(value) => handleFilterChange("experience", value)}
                  helperText="Preferred tutor experience level"
                />

                <EnhancedSelect
                  id="language-filter"
                  label="Language"
                  placeholder="Select language"
                  options={languageOptions}
                  value={filters.language}
                  onValueChange={(value) => handleFilterChange("language", value)}
                  helperText="Preferred tutoring language"
                />
              </div>
            </div>
          )}

          {/* Search Button */}
          <EnhancedButton
            type="submit"
            loading={isSearching}
            loadingText="Searching tutors..."
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
            className="mt-6"
          >
            Search Tutors
          </EnhancedButton>

          {/* Search Tips */}
          <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Search Tips:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use specific keywords like "AP Calculus" or "conversational Spanish"</li>
              <li>Filter by availability to find tutors who match your schedule</li>
              <li>Set a price range that fits your budget</li>
              <li>Check tutor ratings and reviews for quality assurance</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
