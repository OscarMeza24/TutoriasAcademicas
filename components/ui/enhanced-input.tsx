"use client"

import type React from "react"
import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  showLabel?: boolean
  showPasswordToggle?: boolean
  validationState?: "error" | "success" | "warning" | "info"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  characterCount?: boolean
  maxLength?: number
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showLabel = true,
      showPasswordToggle = false,
      validationState,
      leftIcon,
      rightIcon,
      characterCount = false,
      maxLength,
      type = "text",
      id,
      value = "",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined
    const countId = characterCount ? `${inputId}-count` : undefined

    const currentLength = String(value).length
    const isPasswordType = type === "password" || showPasswordToggle
    const inputType = isPasswordType && showPassword ? "text" : type

    const getValidationIcon = () => {
      switch (validationState) {
        case "error":
          return <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
        case "success":
          return <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
        case "warning":
          return <AlertCircle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
        case "info":
          return <Info className="h-4 w-4 text-blue-500" aria-hidden="true" />
        default:
          return null
      }
    }

    const getValidationColor = () => {
      if (error) return "border-red-500 focus-visible:ring-red-500"
      switch (validationState) {
        case "success":
          return "border-green-500 focus-visible:ring-green-500"
        case "warning":
          return "border-yellow-500 focus-visible:ring-yellow-500"
        case "info":
          return "border-blue-500 focus-visible:ring-blue-500"
        default:
          return "border-input focus-visible:ring-ring"
      }
    }

    return (
      <div className="space-y-2">
        <Label
          htmlFor={inputId}
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

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{leftIcon}</div>
          )}

          <Input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            className={cn(
              "transition-all duration-200",
              // Enhanced focus styles
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              // Validation colors
              getValidationColor(),
              // High contrast support
              "high-contrast:border-2 high-contrast:border-current",
              // Padding adjustments for icons
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || getValidationIcon()) && "pr-10",
              // Focus state styling
              isFocused && "ring-2 ring-offset-2 ring-primary/20",
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
            {...props}
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {getValidationIcon()}
            {rightIcon && !showPasswordToggle && rightIcon}
            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
        </div>

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

          {characterCount && maxLength && (
            <p
              id={countId}
              className={cn(
                "text-xs tabular-nums",
                currentLength > maxLength * 0.9 ? "text-yellow-600" : "text-muted-foreground",
                currentLength >= maxLength && "text-red-600",
              )}
              aria-live="polite"
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  },
)

EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
