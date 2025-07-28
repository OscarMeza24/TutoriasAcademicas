"use client"

import type React from "react"
import { forwardRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
  showLabel?: boolean
  characterCount?: boolean
  maxLength?: number
  minLength?: number
  autoResize?: boolean
}

const EnhancedTextarea = forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showLabel = true,
      characterCount = false,
      maxLength,
      minLength,
      autoResize = false,
      id,
      value = "",
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${textareaId}-error` : undefined
    const helperId = helperText ? `${textareaId}-helper` : undefined
    const countId = characterCount ? `${textareaId}-count` : undefined

    const currentLength = String(value).length
    const isOverLimit = maxLength && currentLength > maxLength
    const isUnderLimit = minLength && currentLength < minLength

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = "auto"
        e.target.style.height = `${e.target.scrollHeight}px`
      }
      onChange?.(e)
    }

    return (
      <div className="space-y-2">
        <Label
          htmlFor={textareaId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            showLabel ? "block" : "sr-only",
            isFocused && "text-primary",
          )}
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-label="required field">
              *
            </span>
          )}
        </Label>

        <Textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={handleChange}
          className={cn(
            "transition-all duration-200 resize-none",
            // Enhanced focus styles
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            // Error styles
            error && "border-red-500 focus-visible:ring-red-500",
            // High contrast support
            "high-contrast:border-2 high-contrast:border-current",
            // Focus state styling
            isFocused && "ring-2 ring-offset-2 ring-primary/20",
            // Auto resize
            autoResize && "overflow-hidden",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(errorId, helperId, countId).trim() || undefined}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          maxLength={maxLength}
          minLength={minLength}
          {...props}
        />

        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            {helperText && (
              <p id={helperId} className="text-sm text-muted-foreground">
                {helperText}
              </p>
            )}
            {error && (
              <p id={errorId} className="text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
          </div>

          {characterCount && (maxLength || minLength) && (
            <div className="text-right">
              {maxLength && (
                <p
                  id={countId}
                  className={cn(
                    "text-xs tabular-nums",
                    currentLength > maxLength * 0.9 ? "text-yellow-600" : "text-muted-foreground",
                    isOverLimit && "text-red-600",
                  )}
                  aria-live="polite"
                >
                  {currentLength}/{maxLength}
                </p>
              )}
              {minLength && isUnderLimit && (
                <p className="text-xs text-yellow-600" aria-live="polite">
                  Minimum {minLength} characters
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
)

EnhancedTextarea.displayName = "EnhancedTextarea"

export { EnhancedTextarea }
