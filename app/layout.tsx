import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { AccessibilityToolbar } from "@/components/layout/accessibility-toolbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TutorHub - Academic Tutoring Platform",
  description:
    "Connect with qualified tutors for personalized academic support. Accessible, inclusive, and designed for everyone.",
  keywords: "tutoring, education, academic support, accessibility, inclusive learning",
  authors: [{ name: "TutorHub Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AccessibilityProvider>
            <AuthProvider>
              {/* Skip to main content link for screen readers */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
              >
                Skip to main content
              </a>

              <div className="min-h-screen bg-background transition-colors duration-300">{children}</div>

              <AccessibilityToolbar />
              <Toaster />
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
