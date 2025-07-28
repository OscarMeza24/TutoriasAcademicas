"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AccessibleInput } from "@/components/ui/accessible-input"
import { AccessibleButton } from "@/components/ui/accessible-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface SignInFormData {
  email: string
  password: string
}

interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  role: "student" | "tutor"
}

export function SignInForm() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<SignInFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<SignInFormData> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AccessibleInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            required
            autoComplete="email"
          />

          <AccessibleInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <AccessibleButton type="submit" loading={isSubmitting} loadingText="Signing in..." className="w-full">
            Sign In
          </AccessibleButton>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              href="/auth/signup"
              className="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function SignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "student",
  })
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName, formData.role)

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        })
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join our tutoring platform to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AccessibleInput
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            error={errors.fullName}
            required
            autoComplete="name"
          />

          <AccessibleInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            required
            autoComplete="email"
          />

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              I want to join as{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value: "student" | "tutor") => setFormData((prev) => ({ ...prev, role: value }))}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="cursor-pointer">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tutor" id="tutor" />
                <Label htmlFor="tutor" className="cursor-pointer">
                  Tutor
                </Label>
              </div>
            </RadioGroup>
          </div>

          <AccessibleInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            error={errors.password}
            required
            autoComplete="new-password"
            helperText="Must be at least 8 characters long"
          />

          <AccessibleInput
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <AccessibleButton type="submit" loading={isSubmitting} loadingText="Creating account..." className="w-full">
            Create Account
          </AccessibleButton>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/auth/signin"
              className="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
