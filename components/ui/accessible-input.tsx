"use client"

import type React from "react"
import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  showLabel?: boolean
}

const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ className, label, error, helperText, showLabel = true, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined

    return (
      <div className="space-y-2">
        <Label
          htmlFor={inputId}
          className={cn(
            showLabel ? "block" : "sr-only",
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          )}
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </Label>

        <Input
          ref={ref}
          id={inputId}
          className={cn(
            // Enhanced focus styles
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
            // Error styles
            error && "border-red-500 focus-visible:ring-red-500",
            // High contrast support
            "high-contrast:border-2 high-contrast:border-current",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(errorId, helperId).trim() || undefined}
          {...props}
        />

        {helperText && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

AccessibleInput.displayName = "AccessibleInput"

export { AccessibleInput }
