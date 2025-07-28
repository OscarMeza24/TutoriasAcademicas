"use client"

import type React from "react"
import { useState } from "react"
import { AccessibleInput } from "@/components/ui/accessible-input"
import { AccessibleButton } from "@/components/ui/accessible-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Announce validation errors to screen readers
      const errorCount = Object.keys(errors).length
      toast({
        title: "Form validation failed",
        description: `Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} before submitting.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
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
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Have questions or need help? Send us a message and we'll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name Field */}
          <AccessibleInput
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
            autoComplete="name"
          />

          {/* Email Field */}
          <AccessibleInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            required
            autoComplete="email"
            helperText="We'll use this to respond to your message"
          />

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger
                id="category"
                className={errors.category ? "border-red-500" : ""}
                aria-invalid={errors.category ? "true" : "false"}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="tutoring">Tutoring Services</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p id="category-error" className="text-sm text-red-600" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <AccessibleInput
            label="Subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            error={errors.subject}
            required
            helperText="Brief description of your inquiry"
          />

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Please provide details about your inquiry..."
              rows={5}
              className={errors.message ? "border-red-500" : ""}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error message-helper" : "message-helper"}
              required
            />
            <p id="message-helper" className="text-sm text-muted-foreground">
              Minimum 10 characters required
            </p>
            {errors.message && (
              <p id="message-error" className="text-sm text-red-600" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <AccessibleButton type="submit" loading={isSubmitting} loadingText="Sending message..." className="w-full">
            Send Message
          </AccessibleButton>
        </form>
      </CardContent>
    </Card>
  )
}
