"use client"

import type React from "react"
import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    { className, variant = "default", size = "default", loading = false, loadingText, children, disabled, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        className={cn(
          // Enhanced focus styles for accessibility
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
          // High contrast mode support
          "high-contrast:border-2 high-contrast:border-current",
          // Reduced motion support
          "reduced-motion:transition-none",
          className,
        )}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">{loadingText || "Loading..."}</span>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    )
  },
)

AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton }
