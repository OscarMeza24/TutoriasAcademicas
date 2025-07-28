"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: "small" | "medium" | "large" | "extra-large"
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia"
  screenReaderMode: boolean
  language: "en" | "es" | "fr" | "de" | "pt"
  customColors: {
    background: string
    foreground: string
    primary: string
    secondary: string
  }
  speechRate: number
  speechVolume: number
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
  setLanguage: (language: AccessibilitySettings["language"]) => void
  setCustomColors: (colors: Partial<AccessibilitySettings["customColors"]>) => void
  speak: (text: string) => void
  stopSpeaking: () => void
  executeKeyboardShortcut: (shortcut: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: "medium",
  colorBlindMode: "none",
  screenReaderMode: false,
  language: "en",
  customColors: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#3b82f6",
    secondary: "#6b7280",
  },
  speechRate: 1,
  speechVolume: 1,
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({
          ...defaultSettings,
          ...parsed,
          customColors: {
            ...defaultSettings.customColors,
            ...(parsed.customColors || {}),
          },
        })
      } catch (error) {
        console.error("Error parsing accessibility settings:", error)
        setSettings(defaultSettings)
      }
    }

    // Check for system preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setSettings((prev) => ({ ...prev, reducedMotion: true }))
    }

    // Setup keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case "1":
            event.preventDefault()
            executeKeyboardShortcut("skip-main")
            break
          case "2":
            event.preventDefault()
            executeKeyboardShortcut("skip-nav")
            break
          case "3":
            event.preventDefault()
            executeKeyboardShortcut("skip-search")
            break
          case "h":
            event.preventDefault()
            executeKeyboardShortcut("toggle-contrast")
            break
          case "m":
            event.preventDefault()
            executeKeyboardShortcut("toggle-motion")
            break
          case "=":
          case "+":
            event.preventDefault()
            executeKeyboardShortcut("increase-font")
            break
          case "-":
            event.preventDefault()
            executeKeyboardShortcut("decrease-font")
            break
          case "a":
            event.preventDefault()
            executeKeyboardShortcut("open-accessibility")
            break
        }
      }

      if (event.key === "Escape") {
        executeKeyboardShortcut("close-modals")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))

    // Apply CSS classes and custom properties to document
    const root = document.documentElement

    // High contrast (diferente del modo oscuro)
    root.classList.toggle("high-contrast", settings.highContrast)

    // Reduced motion
    root.classList.toggle("reduced-motion", settings.reducedMotion)

    // Font size
    root.classList.remove("font-small", "font-medium", "font-large", "font-extra-large")
    root.classList.add(`font-${settings.fontSize}`)

    // Color blind mode
    root.classList.remove("protanopia", "deuteranopia", "tritanopia")
    if (settings.colorBlindMode !== "none") {
      root.classList.add(settings.colorBlindMode)
    }

    // Apply custom colors globally (solo si no está en alto contraste)
    if (settings.customColors && !settings.highContrast) {
      root.style.setProperty("--background", `${hexToHsl(settings.customColors.background)}`)
      root.style.setProperty("--foreground", `${hexToHsl(settings.customColors.foreground)}`)
      root.style.setProperty("--primary", `${hexToHsl(settings.customColors.primary)}`)
      root.style.setProperty("--secondary", `${hexToHsl(settings.customColors.secondary)}`)
    }

    // Language attribute
    root.setAttribute("lang", settings.language)
  }, [settings])

  // Helper function to convert hex to HSL for CSS custom properties
  const hexToHsl = (hex: string): string => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
    speak(settings.highContrast ? "High contrast disabled" : "High contrast enabled")
  }

  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }))
    speak(settings.reducedMotion ? "Motion enabled" : "Motion reduced")
  }

  const increaseFontSize = () => {
    const sizes: AccessibilitySettings["fontSize"][] = ["small", "medium", "large", "extra-large"]
    const currentIndex = sizes.indexOf(settings.fontSize)
    if (currentIndex < sizes.length - 1) {
      setSettings((prev) => ({ ...prev, fontSize: sizes[currentIndex + 1] }))
      speak(`Font size increased to ${sizes[currentIndex + 1]}`)
    }
  }

  const decreaseFontSize = () => {
    const sizes: AccessibilitySettings["fontSize"][] = ["small", "medium", "large", "extra-large"]
    const currentIndex = sizes.indexOf(settings.fontSize)
    if (currentIndex > 0) {
      setSettings((prev) => ({ ...prev, fontSize: sizes[currentIndex - 1] }))
      speak(`Font size decreased to ${sizes[currentIndex - 1]}`)
    }
  }

  const setLanguage = (language: AccessibilitySettings["language"]) => {
    setSettings((prev) => ({ ...prev, language }))
    const languageNames = {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
    }
    speak(`Language changed to ${languageNames[language]}`)
  }

  const setCustomColors = (colors: Partial<AccessibilitySettings["customColors"]>) => {
    setSettings((prev) => ({
      ...prev,
      customColors: {
        ...defaultSettings.customColors,
        ...prev.customColors,
        ...colors,
      },
    }))
  }

  const speak = (text: string) => {
    if (speechSynthesis && settings.screenReaderMode) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = settings.speechRate
      utterance.volume = settings.speechVolume
      utterance.lang = settings.language === "en" ? "en-US" : settings.language
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
  }

  const executeKeyboardShortcut = (shortcut: string) => {
    switch (shortcut) {
      case "skip-main":
        document.getElementById("main-content")?.focus()
        speak("Skipped to main content")
        break
      case "skip-nav":
        document.getElementById("main-navigation")?.focus()
        speak("Skipped to navigation")
        break
      case "skip-search":
        document.querySelector('input[type="search"], input[placeholder*="search" i]')?.focus()
        speak("Skipped to search")
        break
      case "toggle-contrast":
        toggleHighContrast()
        break
      case "toggle-motion":
        toggleReducedMotion()
        break
      case "increase-font":
        increaseFontSize()
        break
      case "decrease-font":
        decreaseFontSize()
        break
      case "open-accessibility":
        speak("Opening accessibility menu")
        break
      case "close-modals":
        const modals = document.querySelectorAll('[role="dialog"], [aria-modal="true"]')
        modals.forEach((modal) => {
          const closeButton = modal.querySelector('[aria-label*="close" i], [data-close]')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        })
        break
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        toggleHighContrast,
        toggleReducedMotion,
        increaseFontSize,
        decreaseFontSize,
        setLanguage,
        setCustomColors,
        speak,
        stopSpeaking,
        executeKeyboardShortcut,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
