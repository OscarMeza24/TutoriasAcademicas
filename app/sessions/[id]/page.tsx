"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Star,
  MessageSquare,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface SessionDetails {
  id: string
  title: string
  subject: string
  tutor: {
    id: string
    name: string
    email: string
    avatar?: string
    rating: number
    specializations: string[]
  }
  student: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  date: string
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "in_progress"
  type: "online" | "in_person"
  location?: string
  meetingLink?: string
  price: number
  description: string
  notes?: string
  rating?: number
  feedback?: string
  materials?: string[]
  created_at: string
  updated_at: string
}

export default function SessionDetailsPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<SessionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadSession(params.id as string)
    }
  }, [params.id])

  const loadSession = async (sessionId: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockSession: SessionDetails = {
        id: sessionId,
        title: "Tutoría Avanzada de Matemáticas",
        subject: "Matemáticas",
        tutor: {
          id: "tutor-1",
          name: "Dra. Sarah Johnson",
          email: "sarah.johnson@example.com",
          rating: 4.8,
          specializations: ["Cálculo", "Álgebra Lineal", "Estadística"],
        },
        student: {
          id: "student-1",
          name: "Juan Pérez",
          email: "juan.perez@example.com",
        },
        date: "2024-01-15",
        time: "14:00",
        duration: 60,
        status: "scheduled",
        type: "online",
        meetingLink: "https://meet.example.com/session-123",
        price: 50,
        description:
          "Conceptos avanzados de cálculo incluyendo derivadas e integrales. Trabajaremos con problemas de práctica y nos enfocaremos en las áreas donde necesites más ayuda.",
        materials: ["Libro de Cálculo Capítulo 5", "Conjunto de Problemas de Práctica", "Calculadora Gráfica"],
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-12T15:30:00Z",
      }

      setSession(mockSession)
      setNotes(mockSession.notes || "")
      setRating(mockSession.rating || 0)
      setFeedback(mockSession.feedback || "")
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al cargar los detalles de la sesión. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSessionStatus = async (newStatus: SessionDetails["status"]) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSession((prev) => (prev ? { ...prev, status: newStatus } : null))

      const statusText = {
        scheduled: "programada",
        completed: "completada",
        cancelled: "cancelada",
        in_progress: "en progreso",
      }[newStatus]

      toast({
        title: "Sesión Actualizada",
        description: `El estado de la sesión cambió a ${statusText}.`,
      })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al actualizar el estado de la sesión.",
        variant: "destructive",
      })
    }
  }

  const saveNotes = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSession((prev) => (prev ? { ...prev, notes } : null))

      toast({
        title: "Notas Guardadas",
        description: "Tus notas de la sesión han sido guardadas.",
      })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al guardar las notas.",
        variant: "destructive",
      })
    }
  }

  const submitFeedback = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSession((prev) => (prev ? { ...prev, rating, feedback } : null))
      setShowFeedbackForm(false)

      toast({
        title: "Comentarios Enviados",
        description: "¡Gracias por tus comentarios!",
      })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al enviar los comentarios.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: SessionDetails["status"]) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: SessionDetails["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusText = (status: SessionDetails["status"]) => {
    switch (status) {
      case "scheduled":
        return "Programada"
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      case "in_progress":
        return "En Progreso"
      default:
        return status
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              Por favor inicia sesión para ver los detalles de la sesión
            </h1>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Sesión no encontrada</h1>
            <Link href="/sessions">
              <EnhancedButton>Volver a Sesiones</EnhancedButton>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isUserTutor = profile?.role === "tutor"
  const otherUser = isUserTutor ? session.student : session.tutor

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/sessions">
              <EnhancedButton variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Volver a Sesiones
              </EnhancedButton>
            </Link>
          </div>

          {/* Session Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-card-foreground">{session.title}</CardTitle>
                  <CardDescription>{session.subject}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(session.status)} flex items-center gap-1 w-fit`}>
                  {getStatusIcon(session.status)}
                  {getStatusText(session.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-card-foreground">{otherUser.name}</p>
                      <p className="text-sm text-muted-foreground">{otherUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-card-foreground">
                        {new Date(session.date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.time} ({session.duration} minutos)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {session.type === "online" ? (
                      <Video className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-card-foreground">
                        {session.type === "online" ? "Sesión En Línea" : "Sesión Presencial"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.type === "online" ? "Videollamada" : session.location || "Ubicación por definir"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-card-foreground">${session.price}</p>
                    <p className="text-sm text-muted-foreground">Tarifa de la sesión</p>
                  </div>

                  {isUserTutor && session.tutor.rating && (
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(session.tutor.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({session.tutor.rating}/5)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Tu calificación</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-2 text-card-foreground">Descripción de la Sesión</h3>
                <p className="text-muted-foreground">{session.description}</p>
              </div>

              {session.materials && session.materials.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-2 text-card-foreground">Materiales Requeridos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {session.materials.map((material, index) => (
                      <li key={index} className="text-muted-foreground">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {session.status === "scheduled" && (
                  <>
                    {session.type === "online" && session.meetingLink && (
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                        <EnhancedButton leftIcon={<Video className="h-4 w-4" />}>Unirse a la Reunión</EnhancedButton>
                      </a>
                    )}
                    <EnhancedButton variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
                      Reprogramar
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => updateSessionStatus("completed")}
                    >
                      Marcar Completada
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      leftIcon={<XCircle className="h-4 w-4" />}
                      onClick={() => updateSessionStatus("cancelled")}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      Cancelar
                    </EnhancedButton>
                  </>
                )}

                {session.status === "completed" && !session.rating && (
                  <EnhancedButton leftIcon={<Star className="h-4 w-4" />} onClick={() => setShowFeedbackForm(true)}>
                    Calificar Sesión
                  </EnhancedButton>
                )}

                <EnhancedButton variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>
                  Enviar Mensaje
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("sessions.notes")}
              </CardTitle>
              <CardDescription>Agregar notas sobre esta sesión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EnhancedTextarea
                label=""
                showLabel={false}
                placeholder="Agrega tus notas sobre esta sesión..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <EnhancedButton onClick={saveNotes} size="sm">
                {t("sessions.saveNotes")}
              </EnhancedButton>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          {showFeedbackForm && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Calificar Esta Sesión</CardTitle>
                <CardDescription>Comparte tu experiencia con esta sesión de tutoría</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-card-foreground">Calificación</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <EnhancedTextarea
                  label="Comentarios"
                  placeholder="Comparte tus pensamientos sobre esta sesión..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />

                <div className="flex gap-3">
                  <EnhancedButton onClick={submitFeedback} disabled={rating === 0}>
                    Enviar Comentarios
                  </EnhancedButton>
                  <EnhancedButton variant="outline" onClick={() => setShowFeedbackForm(false)}>
                    {t("common.cancel")}
                  </EnhancedButton>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Feedback */}
          {session.rating && session.feedback && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Tus Comentarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < session.rating! ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({session.rating}/5)</span>
                </div>
                <p className="text-muted-foreground">{session.feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
