"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Search,
  Plus,
  Video,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"
import Link from "next/link"

interface Session {
  id: string
  title: string
  subject: string
  tutor_name: string
  student_name: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "in_progress"
  type: "online" | "in_person"
  price: number
  rating?: number
  notes?: string
}

export default function SessionsPage() {
  const { user, profile } = useAuth()
  const { settings } = useAccessibility()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockSessions: Session[] = [
        {
          id: "1",
          title: "Tutoría Avanzada de Matemáticas",
          subject: "Matemáticas",
          tutor_name: "Dra. Sarah Johnson",
          student_name: "Juan Pérez",
          date: "2024-01-15",
          time: "14:00",
          duration: 60,
          status: "scheduled",
          type: "online",
          price: 50,
        },
        {
          id: "2",
          title: "Resolución de Problemas de Física",
          subject: "Física",
          tutor_name: "Prof. Michael Chen",
          student_name: "Ana García",
          date: "2024-01-14",
          time: "16:00",
          duration: 90,
          status: "completed",
          type: "in_person",
          price: 75,
          rating: 5,
          notes: "Excelente sesión, cubrimos los fundamentos de mecánica cuántica",
        },
        {
          id: "3",
          title: "Práctica de Conversación en Español",
          subject: "Idiomas",
          tutor_name: "María Rodríguez",
          student_name: "Alex Wilson",
          date: "2024-01-13",
          time: "10:00",
          duration: 45,
          status: "cancelled",
          type: "online",
          price: 30,
        },
        {
          id: "4",
          title: "Fundamentos de Ciencias de la Computación",
          subject: "Ciencias de la Computación",
          tutor_name: "David Kim",
          student_name: "Emma Brown",
          date: "2024-01-16",
          time: "18:00",
          duration: 120,
          status: "in_progress",
          type: "online",
          price: 80,
        },
      ]

      setSessions(mockSessions)
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al cargar las sesiones. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tutor_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    const matchesSubject = subjectFilter === "all" || session.subject === subjectFilter

    return matchesSearch && matchesStatus && matchesSubject
  })

  const getStatusIcon = (status: Session["status"]) => {
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

  const getStatusColor = (status: Session["status"]) => {
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

  const getStatusText = (status: Session["status"]) => {
    switch (status) {
      case "scheduled":
        return t("sessions.status.scheduled")
      case "completed":
        return t("sessions.status.completed")
      case "cancelled":
        return t("sessions.status.cancelled")
      case "in_progress":
        return t("sessions.status.inProgress")
      default:
        return status
    }
  }

  const subjects = Array.from(new Set(sessions.map((s) => s.subject)))
  const statusOptions = [
    { value: "all", label: t("sessions.filter.all") },
    { value: "scheduled", label: t("sessions.filter.scheduled") },
    { value: "completed", label: t("sessions.filter.completed") },
    { value: "cancelled", label: t("sessions.filter.cancelled") },
    { value: "in_progress", label: t("sessions.filter.inProgress") },
  ]

  const subjectOptions = [
    { value: "all", label: "Todas las Materias" },
    ...subjects.map((subject) => ({ value: subject, label: subject })),
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Por favor inicia sesión para ver las sesiones</h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("sessions.title")}</h1>
              <p className="text-muted-foreground">{t("sessions.subtitle")}</p>
            </div>
            <Link href="/search">
              <EnhancedButton leftIcon={<Plus className="h-4 w-4" />}>{t("sessions.bookNew")}</EnhancedButton>
            </Link>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <EnhancedInput
                    label=""
                    showLabel={false}
                    placeholder="Buscar sesiones, materias o tutores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
                <div className="flex gap-4">
                  <EnhancedSelect
                    label=""
                    showLabel={false}
                    options={statusOptions}
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    placeholder="Filtrar por estado"
                  />
                  <EnhancedSelect
                    label=""
                    showLabel={false}
                    options={subjectOptions}
                    value={subjectFilter}
                    onValueChange={setSubjectFilter}
                    placeholder="Filtrar por materia"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">No se encontraron sesiones</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
                    ? "Intenta ajustar tus filtros o términos de búsqueda."
                    : "Aún no has reservado ninguna sesión."}
                </p>
                <Link href="/search">
                  <EnhancedButton>Buscar un Tutor</EnhancedButton>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-card-foreground">{session.title}</h3>
                            <p className="text-muted-foreground">{session.subject}</p>
                          </div>
                          <Badge className={`${getStatusColor(session.status)} flex items-center gap-1`}>
                            {getStatusIcon(session.status)}
                            {getStatusText(session.status)}
                          </Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            {profile?.role === "student" ? session.tutor_name : session.student_name}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString("es-ES")}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration} min)
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {session.type === "online" ? <Video className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            {session.type === "online" ? t("sessions.online") : t("sessions.inPerson")}
                          </div>
                        </div>

                        {session.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < session.rating!
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({session.rating}/5)</span>
                          </div>
                        )}

                        {session.notes && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{session.notes}</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                        <div className="text-right lg:text-center mb-2">
                          <p className="text-lg font-bold text-card-foreground">${session.price}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link href={`/sessions/${session.id}`}>
                            <EnhancedButton variant="outline" size="sm" className="w-full">
                              {t("sessions.viewDetails")}
                            </EnhancedButton>
                          </Link>

                          {session.status === "scheduled" && (
                            <>
                              {session.type === "online" && (
                                <EnhancedButton size="sm" className="w-full">
                                  {t("sessions.joinMeeting")}
                                </EnhancedButton>
                              )}
                              <EnhancedButton variant="outline" size="sm" className="w-full">
                                {t("sessions.reschedule")}
                              </EnhancedButton>
                            </>
                          )}

                          {session.status === "completed" && !session.rating && (
                            <EnhancedButton variant="outline" size="sm" className="w-full">
                              Calificar Sesión
                            </EnhancedButton>
                          )}

                          <EnhancedButton
                            variant="ghost"
                            size="sm"
                            leftIcon={<MessageSquare className="h-4 w-4" />}
                            className="w-full"
                          >
                            {t("sessions.sendMessage")}
                          </EnhancedButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
