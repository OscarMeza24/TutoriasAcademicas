"use client"
import { forwardRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface EnhancedSelectProps {
  label: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  showLabel?: boolean
  className?: string
  id?: string
}

const EnhancedSelect = forwardRef<HTMLButtonElement, EnhancedSelectProps>(
  (
    {
      label,
      placeholder = "Select an option",
      options,
      value,
      onValueChange,
      error,
      helperText,
      required = false,
      disabled = false,
      showLabel = true,
      className,
      id,
    },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${selectId}-error` : undefined
    const helperId = helperText ? `${selectId}-helper` : undefined

    return (
      <div className="space-y-2">
        <Label
          htmlFor={selectId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            showLabel ? "block" : "sr-only",
          )}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required field">
              *
            </span>
          )}
        </Label>

        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            id={selectId}
            className={cn(
              "transition-all duration-200",
              // Enhanced focus styles
              "focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              // Error styles
              error && "border-red-500 focus:ring-red-500",
              // High contrast support
              "high-contrast:border-2 high-contrast:border-current",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(errorId, helperId).trim() || undefined}
          >
            <SelectValue placeholder={placeholder} />
            <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
          </SelectTrigger>

          <SelectContent className="max-h-60">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
    )
  },
)

EnhancedSelect.displayName = "EnhancedSelect"

export { EnhancedSelect }
