"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ColorPicker } from "@/components/ui/color-picker"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/hooks/use-language"
import {
  Eye,
  EyeOff,
  Minus,
  Plus,
  Settings,
  X,
  Globe,
  Palette,
  Volume2,
  VolumeX,
  Keyboard,
  Play,
  Square,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"general" | "colors" | "speech" | "shortcuts">("general")

  const {
    settings,
    toggleHighContrast,
    toggleReducedMotion,
    increaseFontSize,
    decreaseFontSize,
    updateSettings,
    setLanguage,
    setCustomColors,
    speak,
    stopSpeaking,
  } = useAccessibility()

  const { theme, setTheme, actualTheme } = useTheme()
  const { t } = useLanguage()

  // Ensure customColors has default values
  const customColors = {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#3b82f6",
    secondary: "#6b7280",
    ...settings.customColors,
  }

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "speech", label: "Speech", icon: Volume2 },
    { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
  ]

  const keyboardShortcuts = [
    { key: "Alt + 1", action: t("shortcuts.skipMain") },
    { key: "Alt + 2", action: t("shortcuts.skipNav") },
    { key: "Alt + 3", action: t("shortcuts.skipSearch") },
    { key: "Alt + H", action: t("shortcuts.toggleContrast") },
    { key: "Alt + M", action: t("shortcuts.toggleMotion") },
    { key: "Alt + +", action: t("shortcuts.increaseFontSize") },
    { key: "Alt + -", action: t("shortcuts.decreaseFontSize") },
    { key: "Alt + A", action: t("shortcuts.openAccessibility") },
    { key: "Esc", action: "Close dialogs and menus" },
    { key: "Tab", action: "Navigate forward" },
    { key: "Shift + Tab", action: "Navigate backward" },
    { key: "Enter/Space", action: "Activate buttons and links" },
  ]

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      case "system":
        return "System"
    }
  }

  return (
    <>
      {/* Accessibility toolbar toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed top-4 right-4 z-50 bg-background shadow-lg border-2",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          "hover:bg-accent hover:text-accent-foreground transition-colors",
        )}
        onClick={() => {
          setIsOpen(!isOpen)
          speak(isOpen ? "Accessibility menu closed" : "Accessibility menu opened")
        }}
        aria-label={isOpen ? "Close accessibility toolbar" : "Open accessibility toolbar"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
      </Button>

      {/* Accessibility toolbar panel */}
      {isOpen && (
        <Card className="fixed top-16 right-4 z-40 w-96 shadow-xl max-h-[80vh] overflow-hidden border-2">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="text-lg font-semibold">Accessibility Options</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b bg-muted/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    speak(`${tab.label} tab selected`)
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  aria-pressed={activeTab === tab.id}
                >
                  <tab.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* General Tab */}
              {activeTab === "general" && (
                <>
                  {/* Theme Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setTheme("light")
                          speak("Light theme enabled")
                        }}
                        className="flex-1"
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setTheme("dark")
                          speak("Dark theme enabled")
                        }}
                        className="flex-1"
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setTheme("system")
                          speak("System theme enabled")
                        }}
                        className="flex-1"
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        Auto
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current: {getThemeLabel()} {theme === "system" && `(${actualTheme})`}
                    </p>
                  </div>

                  {/* High Contrast Toggle */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="high-contrast" className="text-sm font-medium">
                      {t("a11y.highContrast")}
                    </label>
                    <Button
                      id="high-contrast"
                      variant={settings.highContrast ? "default" : "outline"}
                      size="sm"
                      onClick={toggleHighContrast}
                      aria-pressed={settings.highContrast}
                      className="flex items-center gap-2"
                    >
                      {settings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      {settings.highContrast ? t("common.on") : t("common.off")}
                    </Button>
                  </div>

                  {/* Reduced Motion Toggle */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="reduced-motion" className="text-sm font-medium">
                      {t("a11y.reduceMotion")}
                    </label>
                    <Button
                      id="reduced-motion"
                      variant={settings.reducedMotion ? "default" : "outline"}
                      size="sm"
                      onClick={toggleReducedMotion}
                      aria-pressed={settings.reducedMotion}
                    >
                      {settings.reducedMotion ? t("common.on") : t("common.off")}
                    </Button>
                  </div>

                  {/* Font Size Controls */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("a11y.fontSize")}</label>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseFontSize}
                        disabled={settings.fontSize === "small"}
                        aria-label="Decrease font size"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm capitalize px-4 font-medium">{settings.fontSize}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseFontSize}
                        disabled={settings.fontSize === "extra-large"}
                        aria-label="Increase font size"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-2">
                    <label htmlFor="language-select" className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" aria-hidden="true" />
                      {t("a11y.language")}
                    </label>
                    <select
                      id="language-select"
                      value={settings.language || "en"}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </>
              )}

              {/* Colors Tab */}
              {activeTab === "colors" && (
                <>
                  {/* Color Blind Mode */}
                  <div className="space-y-2">
                    <label htmlFor="colorblind-mode" className="text-sm font-medium">
                      {t("a11y.colorVision")}
                    </label>
                    <select
                      id="colorblind-mode"
                      value={settings.colorBlindMode || "none"}
                      onChange={(e) => {
                        updateSettings({ colorBlindMode: e.target.value as any })
                        speak(`Color vision mode changed to ${e.target.value}`)
                      }}
                      className="w-full p-2 border rounded-md text-sm bg-background"
                    >
                      <option value="none">Normal Vision</option>
                      <option value="protanopia">Protanopia</option>
                      <option value="deuteranopia">Deuteranopia</option>
                      <option value="tritanopia">Tritanopia</option>
                    </select>
                  </div>

                  {/* Custom Colors */}
                  {!settings.highContrast && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">{t("a11y.customColors")}</h3>

                      <ColorPicker
                        label="Background Color"
                        color={customColors.background}
                        onChange={(color) => setCustomColors({ background: color })}
                      />

                      <ColorPicker
                        label="Text Color"
                        color={customColors.foreground}
                        onChange={(color) => setCustomColors({ foreground: color })}
                      />

                      <ColorPicker
                        label="Primary Color"
                        color={customColors.primary}
                        onChange={(color) => setCustomColors({ primary: color })}
                      />

                      <ColorPicker
                        label="Secondary Color"
                        color={customColors.secondary}
                        onChange={(color) => setCustomColors({ secondary: color })}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCustomColors({
                            background: "#ffffff",
                            foreground: "#000000",
                            primary: "#3b82f6",
                            secondary: "#6b7280",
                          })
                          speak("Colors reset to default")
                        }}
                        className="w-full"
                      >
                        Reset to Default Colors
                      </Button>
                    </div>
                  )}

                  {settings.highContrast && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Custom colors are disabled when high contrast mode is active.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Speech Tab */}
              {activeTab === "speech" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t("a11y.speechSettings")}</h3>

                    {/* Screen Reader Mode */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Text-to-Speech</span>
                      <Button
                        variant={settings.screenReaderMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          updateSettings({ screenReaderMode: !settings.screenReaderMode })
                          speak(settings.screenReaderMode ? "Text to speech disabled" : "Text to speech enabled")
                        }}
                        aria-pressed={settings.screenReaderMode}
                      >
                        {settings.screenReaderMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        {settings.screenReaderMode ? t("common.on") : t("common.off")}
                      </Button>
                    </div>

                    {/* Speech Rate */}
                    <div className="space-y-2">
                      <label htmlFor="speech-rate" className="text-sm font-medium">
                        Speech Rate: {settings.speechRate || 1}x
                      </label>
                      <input
                        id="speech-rate"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.speechRate || 1}
                        onChange={(e) => updateSettings({ speechRate: Number.parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Speech Volume */}
                    <div className="space-y-2">
                      <label htmlFor="speech-volume" className="text-sm font-medium">
                        Speech Volume: {Math.round((settings.speechVolume || 1) * 100)}%
                      </label>
                      <input
                        id="speech-volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.speechVolume || 1}
                        onChange={(e) => updateSettings({ speechVolume: Number.parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Test Speech */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => speak("This is a test of the text to speech functionality.")}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Test Speech
                      </Button>
                      <Button variant="outline" size="sm" onClick={stopSpeaking} className="flex-1 bg-transparent">
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Shortcuts Tab */}
              {activeTab === "shortcuts" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t("a11y.keyboardShortcuts")}</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {keyboardShortcuts.map((shortcut, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs">{shortcut.key}</kbd>
                          <span className="text-muted-foreground flex-1 ml-2">{shortcut.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="p-4 border-t bg-muted/20">
              <h3 className="text-sm font-medium mb-2">Quick Navigation</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    document.getElementById("main-content")?.focus()
                    setIsOpen(false)
                    speak("Navigated to main content")
                  }}
                >
                  Main Content
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    document.getElementById("main-navigation")?.focus()
                    setIsOpen(false)
                    speak("Navigated to navigation")
                  }}
                >
                  Navigation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
