"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, User, MapPin, AlertCircle, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"

interface BookingFormProps {
  tutor: {
    id: string
    name: string
    hourly_rate: number
    specializations: string[]
    availability: string[]
    rating: number
    total_sessions: number
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function BookingForm({ tutor, onSuccess, onCancel }: BookingFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    time: "",
    duration: "60",
    type: "online",
    location: "",
    description: "",
    special_requests: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const durationOptions = [
    { value: "30", label: "30 minutos" },
    { value: "60", label: "1 hora" },
    { value: "90", label: "1.5 horas" },
    { value: "120", label: "2 horas" },
  ]

  const typeOptions = [
    { value: "online", label: "Sesión En Línea" },
    { value: "in_person", label: "Sesión Presencial" },
  ]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ]

  const subjectOptions = [
    { value: "mathematics", label: "Matemáticas" },
    { value: "physics", label: "Física" },
    { value: "chemistry", label: "Química" },
    { value: "biology", label: "Biología" },
    { value: "computer_science", label: "Ciencias de la Computación" },
    { value: "english", label: "Inglés" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Francés" },
    { value: "history", label: "Historia" },
    { value: "geography", label: "Geografía" },
    { value: "economics", label: "Economía" },
    { value: "psychology", label: "Psicología" },
    { value: "philosophy", label: "Filosofía" },
    { value: "art", label: "Arte" },
    { value: "music", label: "Música" },
    { value: "literature", label: "Literatura" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.subject) newErrors.subject = "Por favor selecciona una materia"
    if (!formData.date) newErrors.date = "Por favor selecciona una fecha"
    if (!formData.time) newErrors.time = "Por favor selecciona una hora"
    if (!formData.description.trim()) newErrors.description = "Por favor describe qué te gustaría aprender"

    // Validate date is not in the past
    if (formData.date && formData.time) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`)
      if (selectedDateTime < new Date()) {
        newErrors.date = "Por favor selecciona una fecha y hora futura"
      }
    }

    if (formData.type === "in_person" && !formData.location.trim()) {
      newErrors.location = "Por favor especifica la ubicación para la sesión presencial"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotal = () => {
    const duration = Number.parseInt(formData.duration)
    const hours = duration / 60
    return tutor.hourly_rate * hours
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Autenticación Requerida",
        description: "Por favor inicia sesión para reservar una sesión.",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Errores en el Formulario",
        description: "Por favor corrige los errores antes de continuar.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const bookingData = {
        tutor_id: tutor.id,
        student_id: user.id,
        subject: formData.subject,
        date: formData.date,
        time: formData.time,
        duration: Number.parseInt(formData.duration),
        type: formData.type,
        location: formData.location,
        description: formData.description,
        special_requests: formData.special_requests,
        price: calculateTotal(),
        status: "pending",
      }

      console.log("Datos de reserva:", bookingData)

      toast({
        title: "¡Sesión Reservada!",
        description:
          "Tu sesión de tutoría ha sido reservada exitosamente. Recibirás un correo de confirmación en breve.",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error en la Reserva",
        description: "Hubo un error al reservar tu sesión. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.subject && formData.date && formData.time && formData.description.trim()
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">{t("booking.title")}</CardTitle>
        <CardDescription>Programa una sesión de tutoría con {tutor.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tutor Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-card-foreground">{tutor.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">€{tutor.hourly_rate}/hora</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">
                  ⭐ {tutor.rating} ({tutor.total_sessions} sesiones)
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {tutor.specializations.slice(0, 3).map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {subjectOptions.find((s) => s.value === spec)?.label || spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <EnhancedSelect
            label="Materia"
            required
            options={subjectOptions.filter((opt) => tutor.specializations.includes(opt.value))}
            value={formData.subject}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
            placeholder="Seleccionar materia"
            error={errors.subject}
          />

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <EnhancedInput
              label="Fecha"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
              leftIcon={<Calendar className="h-4 w-4" />}
              error={errors.date}
            />
            <EnhancedSelect
              label="Hora"
              required
              options={timeSlots.map((time) => ({ value: time, label: time }))}
              value={formData.time}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
              placeholder="Seleccionar hora"
              error={errors.time}
            />
          </div>

          {/* Duration and Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <EnhancedSelect
              label="Duración"
              required
              options={durationOptions}
              value={formData.duration}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
            />
            <EnhancedSelect
              label="Tipo de Sesión"
              required
              options={typeOptions}
              value={formData.type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            />
          </div>

          {/* Location (if in-person) */}
          {formData.type === "in_person" && (
            <EnhancedInput
              label="Ubicación"
              placeholder="Ingresa el lugar de encuentro"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              leftIcon={<MapPin className="h-4 w-4" />}
              helperText="Por favor especifica dónde te gustaría encontrarte"
              error={errors.location}
              required
            />
          )}

          {/* Description */}
          <EnhancedTextarea
            label="Descripción de la Sesión"
            required
            placeholder="Describe en qué te gustaría trabajar en esta sesión..."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            helperText="Sé específico sobre los temas que quieres cubrir o problemas con los que necesitas ayuda"
            error={errors.description}
            maxLength={500}
            characterCount
          />

          {/* Special Requests */}
          <EnhancedTextarea
            label="Solicitudes Especiales (Opcional)"
            placeholder="Cualquier acomodación especial o solicitudes..."
            value={formData.special_requests}
            onChange={(e) => setFormData((prev) => ({ ...prev, special_requests: e.target.value }))}
            rows={2}
            maxLength={300}
            characterCount
          />

          {/* Availability Notice */}
          {tutor.availability.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-300">Disponibilidad del Tutor</p>
                <p className="text-blue-600 dark:text-blue-400">
                  {tutor.name} está típicamente disponible: {tutor.availability.join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Duración:</span>
              <span className="text-card-foreground">{formData.duration} minutos</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Tarifa:</span>
              <span className="text-card-foreground">€{tutor.hourly_rate}/hora</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-card-foreground">Total:</span>
              <span className="text-card-foreground">€{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Session Type Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {formData.type === "online" ? (
                <Video className="h-4 w-4 text-primary" />
              ) : (
                <MapPin className="h-4 w-4 text-primary" />
              )}
              <span className="font-medium text-card-foreground">
                {formData.type === "online" ? "Sesión En Línea" : "Sesión Presencial"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formData.type === "online"
                ? "Recibirás un enlace de reunión por correo electrónico antes de que comience la sesión."
                : "Los detalles de ubicación se compartirán después de la confirmación de la reserva."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <EnhancedButton
              type="submit"
              disabled={!isFormValid() || loading}
              loading={loading}
              loadingText="Reservando..."
              className="flex-1"
              leftIcon={<Calendar className="h-4 w-4" />}
            >
              Reservar Sesión - €{calculateTotal().toFixed(2)}
            </EnhancedButton>
            {onCancel && (
              <EnhancedButton type="button" variant="outline" onClick={onCancel} disabled={loading}>
                {t("common.cancel")}
              </EnhancedButton>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
