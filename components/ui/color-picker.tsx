"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label: string
  presets?: string[]
}

const defaultPresets = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffa500",
  "#800080",
  "#008000",
  "#000080",
  "#800000",
  "#808080",
  "#c0c0c0",
]

export function ColorPicker({ color, onChange, label, presets = defaultPresets }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color || "#000000")

  // Sync input value with prop
  useEffect(() => {
    setInputValue(color || "#000000")
  }, [color])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value)
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent"
            aria-label={`Select ${label.toLowerCase()}`}
          >
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: color || "#000000" }}
              aria-hidden="true"
            />
            <span>{color || "#000000"}</span>
            <Palette className="w-4 h-4 ml-auto" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            {/* Color Input */}
            <div>
              <Label htmlFor="color-input" className="text-sm font-medium">
                Hex Color
              </Label>
              <Input
                id="color-input"
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#000000"
                className="mt-1"
              />
            </div>

            {/* Native Color Picker */}
            <div>
              <Label htmlFor="color-picker" className="text-sm font-medium">
                Color Picker
              </Label>
              <input
                id="color-picker"
                type="color"
                value={color || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full h-10 rounded border border-input cursor-pointer"
              />
            </div>

            {/* Preset Colors */}
            <div>
              <Label className="text-sm font-medium">Preset Colors</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onChange(preset)}
                    className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      color === preset ? "border-primary" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: preset }}
                    aria-label={`Select color ${preset}`}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onChange("#ffffff")} className="flex-1">
                Reset to White
              </Button>
              <Button variant="outline" size="sm" onClick={() => onChange("#000000")} className="flex-1">
                Reset to Black
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
