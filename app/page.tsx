"use client"
import { Header } from "@/components/layout/header"
import { EnhancedContactForm } from "@/components/forms/enhanced-contact-form"
import { AccessibleButton } from "@/components/ui/accessible-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

// Crear un componente cliente para manejar las traducciones
function HomePageContent() {
  const { t } = useLanguage()

  const features = [
    {
      icon: BookOpen,
      title: t("features.expertTutors"),
      description: t("features.expertTutors.desc"),
    },
    {
      icon: Users,
      title: t("features.personalizedLearning"),
      description: t("features.personalizedLearning.desc"),
    },
    {
      icon: Calendar,
      title: t("features.flexibleScheduling"),
      description: t("features.flexibleScheduling.desc"),
    },
    {
      icon: Star,
      title: t("features.qualityAssured"),
      description: t("features.qualityAssured.desc"),
    },
    {
      icon: Shield,
      title: t("features.safeSecure"),
      description: t("features.safeSecure.desc"),
    },
    {
      icon: Zap,
      title: t("features.instantSupport"),
      description: t("features.instantSupport.desc"),
    },
  ]

  return (
    <main id="main-content" className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">{t("home.hero.title")}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">{t("home.hero.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AccessibleButton size="lg" asChild>
              <Link href="/auth/signup">{t("home.hero.getStarted")}</Link>
            </AccessibleButton>
            <AccessibleButton variant="outline" size="lg" asChild>
              <Link href="/search">{t("home.hero.findTutors")}</Link>
            </AccessibleButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("home.features.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("home.features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-card border-border">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Statement */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">{t("home.accessibility.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">{t("home.accessibility.subtitle")}</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-foreground">Screen Reader Support</h3>
              <p className="text-sm text-muted-foreground">
                Full compatibility with screen readers and assistive technologies
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-foreground">Keyboard Navigation</h3>
              <p className="text-sm text-muted-foreground">Complete keyboard navigation support for all features</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-foreground">Visual Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                High contrast modes, adjustable fonts, and color-blind support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("home.contact.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("home.contact.subtitle")}</p>
          </div>
          <EnhancedContactForm />
        </div>
      </section>
    </main>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomePageContent />
      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
                <span className="font-bold text-lg text-foreground">TutorHub</span>
              </div>
              <p className="text-sm text-muted-foreground">Making quality education accessible to everyone.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                    Find Tutors
                  </Link>
                </li>
                <li>
                  <Link href="/subjects" className="text-muted-foreground hover:text-foreground transition-colors">
                    Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TutorHub. All rights reserved. Built with accessibility in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
