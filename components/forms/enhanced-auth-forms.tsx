"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/hooks/use-language"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export function EnhancedSignInForm() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<SignInFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  const validateField = (name: keyof SignInFormData, value: string): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim()) return `${t("form.email")} is required`
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Please enter a valid email address"
        return undefined

      case "password":
        if (!value) return `${t("form.password")} is required`
        return undefined

      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<SignInFormData> = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof SignInFormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (name: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (submitAttempted) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        let errorMessage = "Invalid email or password. Please try again."

        // Handle specific error cases
        if (error.message?.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before signing in."
        } else if (error.message?.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        }

        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("msg.welcome"),
          description: t("msg.signInSuccess"),
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: t("msg.error"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getValidationState = (fieldName: keyof SignInFormData) => {
    if (errors[fieldName]) return "error"
    if (submitAttempted && formData[fieldName] && !errors[fieldName]) return "success"
    return undefined
  }

  const roleOptions = [
    { value: "student", label: `${t("nav.dashboard")} - I want to learn` },
    { value: "tutor", label: "Tutor - I want to teach" },
  ]

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <LogIn className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("form.signIn")}
        </CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <EnhancedInput
            id="signin-email"
            label={t("form.email")}
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            validationState={getValidationState("email")}
            helperText="Enter the email address associated with your account"
          />

          <EnhancedInput
            id="signin-password"
            label={t("form.password")}
            type="password"
            value={formData.password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            error={errors.password}
            required
            autoComplete="current-password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            validationState={getValidationState("password")}
          />

          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded"
            >
              Forgot your password?
            </Link>
          </div>

          <EnhancedButton
            type="submit"
            loading={isSubmitting}
            loadingText={t("form.signingIn")}
            leftIcon={<LogIn className="h-4 w-4" />}
            fullWidth
          >
            {t("form.signIn")}
          </EnhancedButton>

          <div className="text-center text-sm border-t pt-4">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              href="/auth/signup"
              className="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded font-medium"
            >
              {t("nav.signUp")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function EnhancedSignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "student",
  })
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()

  const roleOptions = [
    { value: "student", label: "Student - I want to learn" },
    { value: "tutor", label: "Tutor - I want to teach" },
  ]

  const validateField = (name: keyof SignUpFormData, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return `${t("form.fullName")} is required`
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        return undefined

      case "email":
        if (!value.trim()) return `${t("form.email")} is required`
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Please enter a valid email address"
        return undefined

      case "password":
        if (!value) return `${t("form.password")} is required`
        if (value.length < 8) return "Password must be at least 8 characters long"
        if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
        if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
        if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number"
        return undefined

      case "confirmPassword":
        if (!value) return "Please confirm your password"
        if (value !== formData.password) return "Passwords do not match"
        return undefined

      case "role":
        if (!value) return "Please select your role"
        return undefined

      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof SignUpFormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (name: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (submitAttempted) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))

      // Also revalidate confirm password if password changes
      if (name === "password" && formData.confirmPassword) {
        const confirmError = validateField("confirmPassword", formData.confirmPassword)
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName, formData.role)

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message || "Unable to create account. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: t("msg.accountCreated"),
          description: t("msg.emailNotConfirmed"),
        })
        // Reset form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          role: "student",
        })
        setErrors({})
        setSubmitAttempted(false)
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: t("msg.error"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getValidationState = (fieldName: keyof SignUpFormData) => {
    if (errors[fieldName]) return "error"
    if (submitAttempted && formData[fieldName] && !errors[fieldName]) return "success"
    return undefined
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/(?=.*[a-z])/.test(password)) strength++
    if (/(?=.*[A-Z])/.test(password)) strength++
    if (/(?=.*\d)/.test(password)) strength++
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++

    return {
      score: strength,
      label: ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength] || "Very Weak",
      color: ["red", "orange", "yellow", "blue", "green"][strength] || "red",
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
          {t("form.signUp")}
        </CardTitle>
        <CardDescription>Join our tutoring platform to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <EnhancedInput
            id="signup-fullname"
            label={t("form.fullName")}
            type="text"
            value={formData.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            error={errors.fullName}
            required
            autoComplete="name"
            leftIcon={<User className="h-4 w-4" />}
            validationState={getValidationState("fullName")}
            helperText="Enter your first and last name"
          />

          <EnhancedInput
            id="signup-email"
            label={t("form.email")}
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            validationState={getValidationState("email")}
            helperText="We'll use this for your account and notifications"
          />

          <EnhancedSelect
            id="signup-role"
            label="I want to join as"
            options={roleOptions}
            value={formData.role}
            onValueChange={(value) => handleFieldChange("role", value as "student" | "tutor")}
            error={errors.role}
            required
            helperText="Choose your primary role on the platform"
          />

          <div className="space-y-2">
            <EnhancedInput
              id="signup-password"
              label={t("form.password")}
              type="password"
              value={formData.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              error={errors.password}
              required
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" />}
              showPasswordToggle
              validationState={getValidationState("password")}
              helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
            />

            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <EnhancedInput
            id="signup-confirm-password"
            label={t("form.confirmPassword")}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            validationState={getValidationState("confirmPassword")}
            helperText="Re-enter your password to confirm"
          />

          <EnhancedButton
            type="submit"
            loading={isSubmitting}
            loadingText={t("form.creatingAccount")}
            leftIcon={<UserPlus className="h-4 w-4" />}
            fullWidth
          >
            {t("form.signUp")}
          </EnhancedButton>

          <div className="text-center text-sm border-t pt-4">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/auth/signin"
              className="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded font-medium"
            >
              {t("nav.signIn")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
