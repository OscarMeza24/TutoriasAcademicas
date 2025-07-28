"use client"

import type React from "react"
import { useState } from "react"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Send, Mail, User } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

const categoryOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "billing", label: "Billing Question" },
  { value: "tutoring", label: "Tutoring Services" },
  { value: "accessibility", label: "Accessibility Support" },
  { value: "feedback", label: "Feedback & Suggestions" },
]

export function EnhancedContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const { toast } = useToast()

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        return undefined

      case "email":
        if (!value.trim()) return "Email address is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Please enter a valid email address"
        return undefined

      case "subject":
        if (!value.trim()) return "Subject is required"
        if (value.trim().length < 5) return "Subject must be at least 5 characters"
        return undefined

      case "category":
        if (!value) return "Please select a category"
        return undefined

      case "message":
        if (!value.trim()) return "Message is required"
        if (value.trim().length < 10) return "Message must be at least 10 characters"
        if (value.trim().length > 1000) return "Message must be less than 1000 characters"
        return undefined

      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof ContactFormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (name: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation after first submit attempt
    if (submitAttempted) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!validateForm()) {
      const errorCount = Object.keys(errors).length
      toast({
        title: "Form validation failed",
        description: `Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} before submitting.`,
        variant: "destructive",
      })

      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(`input-${firstErrorField}`) || document.getElementById(firstErrorField)
      element?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })
      setErrors({})
      setSubmitAttempted(false)

      // Announce success to screen readers
      const successMessage = document.createElement("div")
      successMessage.setAttribute("aria-live", "polite")
      successMessage.setAttribute("aria-atomic", "true")
      successMessage.className = "sr-only"
      successMessage.textContent = "Contact form submitted successfully. We will respond within 24 hours."
      document.body.appendChild(successMessage)
      setTimeout(() => document.body.removeChild(successMessage), 1000)
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact us directly at support@tutorhub.com",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getValidationState = (fieldName: keyof ContactFormData) => {
    if (errors[fieldName]) return "error"
    if (submitAttempted && formData[fieldName] && !errors[fieldName]) return "success"
    return undefined
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          Contact Us
        </CardTitle>
        <CardDescription className="text-base">
          Have questions or need help? Send us a message and we'll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name Field */}
          <EnhancedInput
            id="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
            required
            autoComplete="name"
            leftIcon={<User className="h-4 w-4" />}
            validationState={getValidationState("name")}
            helperText="Enter your first and last name"
            maxLength={100}
            characterCount
          />

          {/* Email Field */}
          <EnhancedInput
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            validationState={getValidationState("email")}
            helperText="We'll use this to respond to your message"
          />

          {/* Category Field */}
          <EnhancedSelect
            id="category"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            value={formData.category}
            onValueChange={(value) => handleFieldChange("category", value)}
            error={errors.category}
            required
            helperText="Choose the category that best describes your inquiry"
          />

          {/* Subject Field */}
          <EnhancedInput
            id="subject"
            label="Subject"
            type="text"
            value={formData.subject}
            onChange={(e) => handleFieldChange("subject", e.target.value)}
            error={errors.subject}
            required
            validationState={getValidationState("subject")}
            helperText="Brief description of your inquiry"
            maxLength={200}
            characterCount
          />

          {/* Message Field */}
          <EnhancedTextarea
            id="message"
            label="Message"
            value={formData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            error={errors.message}
            required
            rows={6}
            autoResize
            maxLength={1000}
            minLength={10}
            characterCount
            helperText="Please provide details about your inquiry. Be as specific as possible to help us assist you better."
            placeholder="Please describe your question or concern in detail..."
          />

          {/* Submit Button */}
          <EnhancedButton
            type="submit"
            loading={isSubmitting}
            loadingText="Sending message..."
            leftIcon={<Send className="h-4 w-4" />}
            fullWidth
            className="mt-8"
          >
            Send Message
          </EnhancedButton>

          {/* Additional Help Text */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>
              Need immediate assistance? Call us at{" "}
              <a href="tel:+1-555-0123" className="text-primary hover:underline font-medium">
                +1 (555) 012-3456
              </a>
            </p>
            <p className="mt-1">
              Or email us directly at{" "}
              <a href="mailto:support@tutorhub.com" className="text-primary hover:underline font-medium">
                support@tutorhub.com
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
