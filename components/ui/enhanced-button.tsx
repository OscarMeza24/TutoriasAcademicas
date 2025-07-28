"use client"

import type React from "react"
import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  fullWidth?: boolean
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <Button
        ref={ref}
        className={cn(
          // Enhanced focus styles for accessibility
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          // High contrast mode support
          "high-contrast:border-2 high-contrast:border-current",
          // Reduced motion support
          "reduced-motion:transition-none",
          // Loading state
          loading && "cursor-wait",
          // Full width option
          fullWidth && "w-full",
          // Enhanced hover and active states
          "transition-all duration-200 ease-in-out",
          "hover:scale-[1.02] active:scale-[0.98]",
          "reduced-motion:hover:scale-100 reduced-motion:active:scale-100",
          className,
        )}
        variant={variant}
        size={size}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Loading...</span>
              {loadingText || children}
            </>
          ) : (
            <>
              {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
              {children}
              {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
            </>
          )}
        </div>
      </Button>
    )
  },
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }
