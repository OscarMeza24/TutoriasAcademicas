"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { User, Mail, Phone, MapPin, Calendar, Star, DollarSign, Clock, Camera, Edit, Save, X, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"

interface ProfileData {
  id: string
  email: string
  full_name: string
  role: "student" | "tutor"
  avatar_url?: string
  phone?: string
  location?: string
  bio?: string
  specializations?: string[]
  hourly_rate?: number
  experience_years?: number
  education?: string[]
  certifications?: string[]
  languages?: string[]
  availability?: string[]
  rating?: number
  total_sessions?: number
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user, profile: authProfile } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<ProfileData>>({})

  const availabilityOptions = [
    { value: "monday_morning", label: "Lunes por la Mañana" },
    { value: "monday_afternoon", label: "Lunes por la Tarde" },
    { value: "monday_evening", label: "Lunes por la Noche" },
    { value: "tuesday_morning", label: "Martes por la Mañana" },
    { value: "tuesday_afternoon", label: "Martes por la Tarde" },
    { value: "tuesday_evening", label: "Martes por la Noche" },
    { value: "wednesday_morning", label: "Miércoles por la Mañana" },
    { value: "wednesday_afternoon", label: "Miércoles por la Tarde" },
    { value: "wednesday_evening", label: "Miércoles por la Noche" },
    { value: "thursday_morning", label: "Jueves por la Mañana" },
    { value: "thursday_afternoon", label: "Jueves por la Tarde" },
    { value: "thursday_evening", label: "Jueves por la Noche" },
    { value: "friday_morning", label: "Viernes por la Mañana" },
    { value: "friday_afternoon", label: "Viernes por la Tarde" },
    { value: "friday_evening", label: "Viernes por la Noche" },
    { value: "saturday_morning", label: "Sábado por la Mañana" },
    { value: "saturday_afternoon", label: "Sábado por la Tarde" },
    { value: "saturday_evening", label: "Sábado por la Noche" },
    { value: "sunday_morning", label: "Domingo por la Mañana" },
    { value: "sunday_afternoon", label: "Domingo por la Tarde" },
    { value: "sunday_evening", label: "Domingo por la Noche" },
  ]

  const languageOptions = [
    { value: "spanish", label: "Español" },
    { value: "english", label: "Inglés" },
    { value: "french", label: "Francés" },
    { value: "german", label: "Alemán" },
    { value: "portuguese", label: "Portugués" },
    { value: "italian", label: "Italiano" },
    { value: "chinese", label: "Chino" },
    { value: "japanese", label: "Japonés" },
    { value: "korean", label: "Coreano" },
    { value: "arabic", label: "Árabe" },
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

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockProfile: ProfileData = {
        id: user?.id || "1",
        email: authProfile?.email || "usuario@ejemplo.com",
        full_name: authProfile?.full_name || "Usuario Ejemplo",
        role: authProfile?.role || "student",
        avatar_url: authProfile?.avatar_url,
        phone: "+34 123 456 789",
        location: "Madrid, España",
        bio: "Soy un estudiante apasionado por las matemáticas y la física. Me encanta aprender nuevos conceptos y resolver problemas complejos.",
        specializations: ["mathematics", "physics", "chemistry"],
        hourly_rate: 25,
        experience_years: 3,
        education: [
          "Licenciatura en Matemáticas - Universidad Complutense de Madrid",
          "Máster en Física Teórica - Universidad Autónoma de Madrid",
        ],
        certifications: ["Certificado de Enseñanza de Matemáticas", "Certificado TESOL para Enseñanza de Inglés"],
        languages: ["spanish", "english", "french"],
        availability: ["monday_afternoon", "tuesday_evening", "wednesday_afternoon", "friday_morning"],
        rating: 4.8,
        total_sessions: 127,
        created_at: "2023-01-15T10:00:00Z",
        updated_at: "2024-01-10T15:30:00Z",
      }

      setProfile(mockProfile)
      setFormData(mockProfile)
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al cargar el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProfile({ ...profile!, ...formData })
      setEditing(false)

      toast({
        title: t("common.success"),
        description: t("msg.profileUpdated"),
      })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al guardar el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setEditing(false)
  }

  const addItem = (field: keyof ProfileData, value: string) => {
    const currentArray = (formData[field] as string[]) || []
    if (!currentArray.includes(value)) {
      setFormData({
        ...formData,
        [field]: [...currentArray, value],
      })
    }
  }

  const removeItem = (field: keyof ProfileData, value: string) => {
    const currentArray = (formData[field] as string[]) || []
    setFormData({
      ...formData,
      [field]: currentArray.filter((item) => item !== value),
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Por favor inicia sesión para ver tu perfil</h1>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Perfil no encontrado</h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("profile.title")}</h1>
              <p className="text-muted-foreground">{t("profile.subtitle")}</p>
            </div>
            <div className="flex gap-3">
              {editing ? (
                <>
                  <EnhancedButton
                    onClick={handleSave}
                    loading={saving}
                    loadingText="Guardando..."
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    {t("profile.saveChanges")}
                  </EnhancedButton>
                  <EnhancedButton variant="outline" onClick={handleCancel} disabled={saving}>
                    {t("common.cancel")}
                  </EnhancedButton>
                </>
              ) : (
                <EnhancedButton onClick={() => setEditing(true)} leftIcon={<Edit className="h-4 w-4" />}>
                  {t("profile.editProfile")}
                </EnhancedButton>
              )}
            </div>
          </div>

          {/* Profile Overview */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {profile.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {editing && (
                    <EnhancedButton variant="outline" size="sm" leftIcon={<Camera className="h-4 w-4" />}>
                      {t("profile.changePhoto")}
                    </EnhancedButton>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground">{profile.full_name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-primary text-primary-foreground">
                        {profile.role === "tutor" ? "Tutor" : "Estudiante"}
                      </Badge>
                      {profile.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{profile.rating}</span>
                          <span className="text-sm text-muted-foreground">({profile.total_sessions} sesiones)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {profile.phone}
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {new Date(profile.created_at).toLocaleDateString("es-ES")}
                    </div>
                  </div>

                  {profile.bio && (
                    <div>
                      <h3 className="font-semibold mb-2 text-card-foreground">{t("profile.bio")}</h3>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">{t("profile.personalInfo")}</CardTitle>
              <CardDescription>Información básica de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <EnhancedInput
                  label="Nombre Completo"
                  value={editing ? formData.full_name || "" : profile.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!editing}
                  leftIcon={<User className="h-4 w-4" />}
                />
                <EnhancedInput
                  label="Correo Electrónico"
                  type="email"
                  value={profile.email}
                  disabled={true}
                  leftIcon={<Mail className="h-4 w-4" />}
                  helperText="El correo no se puede cambiar"
                />
                <EnhancedInput
                  label="Teléfono"
                  value={editing ? formData.phone || "" : profile.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  leftIcon={<Phone className="h-4 w-4" />}
                />
                <EnhancedInput
                  label="Ubicación"
                  value={editing ? formData.location || "" : profile.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!editing}
                  leftIcon={<MapPin className="h-4 w-4" />}
                />
              </div>

              <EnhancedTextarea
                label={t("profile.bio")}
                value={editing ? formData.bio || "" : profile.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!editing}
                rows={4}
                maxLength={500}
                characterCount
                placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses..."
              />
            </CardContent>
          </Card>

          {/* Professional Information (for tutors) */}
          {profile.role === "tutor" && (
            <>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{t("profile.professionalInfo")}</CardTitle>
                  <CardDescription>Información sobre tu experiencia como tutor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <EnhancedInput
                      label="Tarifa por Hora (€)"
                      type="number"
                      value={editing ? formData.hourly_rate?.toString() || "" : profile.hourly_rate?.toString() || ""}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                      disabled={!editing}
                      leftIcon={<DollarSign className="h-4 w-4" />}
                      min="5"
                      max="200"
                    />
                    <EnhancedInput
                      label="Años de Experiencia"
                      type="number"
                      value={
                        editing
                          ? formData.experience_years?.toString() || ""
                          : profile.experience_years?.toString() || ""
                      }
                      onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                      disabled={!editing}
                      leftIcon={<Clock className="h-4 w-4" />}
                      min="0"
                      max="50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{t("profile.specializations")}</CardTitle>
                  <CardDescription>Materias en las que puedes enseñar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(editing ? formData.specializations : profile.specializations)?.map((spec) => (
                      <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                        {subjectOptions.find((s) => s.value === spec)?.label || spec}
                        {editing && (
                          <button
                            onClick={() => removeItem("specializations", spec)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {editing && (
                    <EnhancedSelect
                      label="Agregar Especialización"
                      options={subjectOptions.filter((opt) => !(formData.specializations || []).includes(opt.value))}
                      value=""
                      onValueChange={(value) => addItem("specializations", value)}
                      placeholder="Seleccionar materia"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Availability */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{t("profile.availability")}</CardTitle>
                  <CardDescription>Cuándo estás disponible para enseñar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(editing ? formData.availability : profile.availability)?.map((slot) => (
                      <Badge key={slot} variant="outline" className="flex items-center gap-1">
                        {availabilityOptions.find((a) => a.value === slot)?.label || slot}
                        {editing && (
                          <button
                            onClick={() => removeItem("availability", slot)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {editing && (
                    <EnhancedSelect
                      label="Agregar Disponibilidad"
                      options={availabilityOptions.filter((opt) => !(formData.availability || []).includes(opt.value))}
                      value=""
                      onValueChange={(value) => addItem("availability", value)}
                      placeholder="Seleccionar horario"
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Education */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">{t("profile.education")}</CardTitle>
              <CardDescription>Tu formación académica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {(editing ? formData.education : profile.education)?.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-card-foreground">{edu}</span>
                    {editing && (
                      <button
                        onClick={() => {
                          const newEducation = (formData.education || []).filter((_, i) => i !== index)
                          setFormData({ ...formData, education: newEducation })
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {editing && (
                <div className="flex gap-2">
                  <EnhancedInput
                    label=""
                    showLabel={false}
                    placeholder="Agregar educación (ej: Licenciatura en Matemáticas - Universidad)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const newEducation = [...(formData.education || []), e.currentTarget.value.trim()]
                        setFormData({ ...formData, education: newEducation })
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <EnhancedButton
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => {
                      const input = document.querySelector(
                        'input[placeholder*="Agregar educación"]',
                      ) as HTMLInputElement
                      if (input?.value.trim()) {
                        const newEducation = [...(formData.education || []), input.value.trim()]
                        setFormData({ ...formData, education: newEducation })
                        input.value = ""
                      }
                    }}
                  >
                    Agregar
                  </EnhancedButton>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">{t("profile.languages")}</CardTitle>
              <CardDescription>Idiomas que hablas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(editing ? formData.languages : profile.languages)?.map((lang) => (
                  <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                    {languageOptions.find((l) => l.value === lang)?.label || lang}
                    {editing && (
                      <button
                        onClick={() => removeItem("languages", lang)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {editing && (
                <EnhancedSelect
                  label="Agregar Idioma"
                  options={languageOptions.filter((opt) => !(formData.languages || []).includes(opt.value))}
                  value=""
                  onValueChange={(value) => addItem("languages", value)}
                  placeholder="Seleccionar idioma"
                />
              )}
            </CardContent>
          </Card>

          {/* Statistics (for tutors) */}
          {profile.role === "tutor" && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Estadísticas</CardTitle>
                <CardDescription>Tu rendimiento como tutor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-card-foreground">{profile.total_sessions}</div>
                    <div className="text-sm text-muted-foreground">Sesiones Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                      <span className="text-3xl font-bold text-card-foreground">{profile.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Calificación Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-card-foreground">{profile.experience_years}</div>
                    <div className="text-sm text-muted-foreground">Años de Experiencia</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
