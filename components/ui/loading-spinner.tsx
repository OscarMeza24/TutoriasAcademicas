"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-live="polite">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          "reduced-motion:animate-none reduced-motion:border-primary",
          sizeClasses[size],
          className,
        )}
        aria-hidden="true"
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      <span className="sr-only">{text || "Loading..."}</span>
    </div>
  )
}
