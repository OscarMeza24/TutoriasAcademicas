"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useTheme } from "@/contexts/theme-context"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { ColorPicker } from "@/components/ui/color-picker"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Palette,
  Globe,
  Eye,
  Volume2,
  Keyboard,
  Shield,
  Bell,
  Sun,
  Moon,
  Monitor,
  Trash2,
  Download,
  User,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const { settings, updateSettings, setLanguage, setCustomColors } = useAccessibility()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"general" | "accessibility" | "privacy" | "account">("general")

  const languageOptions = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "pt", label: "Português" },
  ]

  const colorBlindOptions = [
    { value: "none", label: t("a11y.colorVision") + " - Normal" },
    { value: "protanopia", label: "Protanopia (Daltonismo Rojo)" },
    { value: "deuteranopia", label: "Deuteranopia (Daltonismo Verde)" },
    { value: "tritanopia", label: "Tritanopia (Daltonismo Azul)" },
  ]

  const tabs = [
    { id: "general", label: t("settings.general"), icon: Settings },
    { id: "accessibility", label: t("settings.accessibility"), icon: Eye },
    { id: "privacy", label: t("settings.privacy"), icon: Shield },
    { id: "account", label: t("settings.account"), icon: User },
  ]

  const exportData = async () => {
    try {
      const userData = {
        profile,
        settings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tutorhub-datos-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: t("common.success"),
        description: "Tus datos han sido exportados exitosamente.",
      })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Error al exportar los datos. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const deleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        toast({
          title: "Solicitud de Eliminación de Cuenta",
          description: "Se ha enviado la solicitud de eliminación de cuenta. Recibirás un correo de confirmación.",
        })
      } catch (error) {
        toast({
          title: t("common.error"),
          description: "Error al eliminar la cuenta. Por favor contacta al soporte.",
          variant: "destructive",
        })
      }
    }
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              Por favor inicia sesión para acceder a la configuración
            </h1>
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
            <p className="text-muted-foreground">{t("settings.subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-card-foreground hover:bg-muted/50"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Tema y Apariencia
                      </CardTitle>
                      <CardDescription>Personaliza cómo se ve y se siente TutorHub</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-card-foreground">{t("settings.theme")}</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setTheme("light")}
                            className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                              theme === "light"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-card-foreground hover:bg-muted/50"
                            }`}
                          >
                            <Sun className="h-4 w-4" />
                            Claro
                          </button>
                          <button
                            onClick={() => setTheme("dark")}
                            className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                              theme === "dark"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-card-foreground hover:bg-muted/50"
                            }`}
                          >
                            <Moon className="h-4 w-4" />
                            Oscuro
                          </button>
                          <button
                            onClick={() => setTheme("system")}
                            className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                              theme === "system"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-card-foreground hover:bg-muted/50"
                            }`}
                          >
                            <Monitor className="h-4 w-4" />
                            Sistema
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Idioma y Región
                      </CardTitle>
                      <CardDescription>Configura tu idioma preferido y configuración regional</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <EnhancedSelect
                        label="Idioma de la Interfaz"
                        options={languageOptions}
                        value={settings.language}
                        onValueChange={(value) => setLanguage(value as any)}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        {t("settings.notifications")}
                      </CardTitle>
                      <CardDescription>Gestiona tus preferencias de notificaciones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {[
                          {
                            id: "session_reminders",
                            label: "Recordatorios de Sesión",
                            description: "Recibe notificaciones antes de tus sesiones",
                          },
                          {
                            id: "new_messages",
                            label: "Nuevos Mensajes",
                            description: "Recibe notificaciones de nuevos mensajes",
                          },
                          {
                            id: "booking_updates",
                            label: "Actualizaciones de Reservas",
                            description: "Actualizaciones sobre reservas de sesiones y cambios",
                          },
                          {
                            id: "marketing",
                            label: "Correos de Marketing",
                            description: "Recibe actualizaciones sobre nuevas funciones y promociones",
                          },
                        ].map((notification) => (
                          <div key={notification.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-card-foreground">{notification.label}</p>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                            <EnhancedButton variant="outline" size="sm">
                              Activar
                            </EnhancedButton>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Accessibility Settings */}
              {activeTab === "accessibility" && (
                <>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Accesibilidad Visual
                      </CardTitle>
                      <CardDescription>Personaliza la configuración visual para mejor accesibilidad</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-card-foreground">{t("a11y.fontSize")}</label>
                          <div className="flex items-center gap-2">
                            <EnhancedButton
                              variant="outline"
                              size="sm"
                              onClick={() => updateSettings({ fontSize: "small" })}
                              className={settings.fontSize === "small" ? "bg-primary text-primary-foreground" : ""}
                            >
                              Pequeño
                            </EnhancedButton>
                            <EnhancedButton
                              variant="outline"
                              size="sm"
                              onClick={() => updateSettings({ fontSize: "medium" })}
                              className={settings.fontSize === "medium" ? "bg-primary text-primary-foreground" : ""}
                            >
                              Mediano
                            </EnhancedButton>
                            <EnhancedButton
                              variant="outline"
                              size="sm"
                              onClick={() => updateSettings({ fontSize: "large" })}
                              className={settings.fontSize === "large" ? "bg-primary text-primary-foreground" : ""}
                            >
                              Grande
                            </EnhancedButton>
                            <EnhancedButton
                              variant="outline"
                              size="sm"
                              onClick={() => updateSettings({ fontSize: "extra-large" })}
                              className={
                                settings.fontSize === "extra-large" ? "bg-primary text-primary-foreground" : ""
                              }
                            >
                              Extra Grande
                            </EnhancedButton>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-card-foreground">Opciones de Accesibilidad</label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-card-foreground">{t("a11y.highContrast")}</span>
                              <EnhancedButton
                                variant={settings.highContrast ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                              >
                                {settings.highContrast ? t("common.on") : t("common.off")}
                              </EnhancedButton>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-card-foreground">{t("a11y.reduceMotion")}</span>
                              <EnhancedButton
                                variant={settings.reducedMotion ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                              >
                                {settings.reducedMotion ? t("common.on") : t("common.off")}
                              </EnhancedButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      <EnhancedSelect
                        label={t("a11y.colorVision")}
                        options={colorBlindOptions}
                        value={settings.colorBlindMode}
                        onValueChange={(value) => updateSettings({ colorBlindMode: value as any })}
                        helperText="Ajusta los colores para diferentes tipos de visión de color"
                      />
                    </CardContent>
                  </Card>

                  {!settings.highContrast && (
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-card-foreground">{t("a11y.customColors")}</CardTitle>
                        <CardDescription>Personaliza tu esquema de colores</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <ColorPicker
                            label="Color de Fondo"
                            color={settings.customColors?.background || "#ffffff"}
                            onChange={(color) => setCustomColors({ background: color })}
                          />
                          <ColorPicker
                            label="Color de Texto"
                            color={settings.customColors?.foreground || "#000000"}
                            onChange={(color) => setCustomColors({ foreground: color })}
                          />
                          <ColorPicker
                            label="Color Primario"
                            color={settings.customColors?.primary || "#3b82f6"}
                            onChange={(color) => setCustomColors({ primary: color })}
                          />
                          <ColorPicker
                            label="Color Secundario"
                            color={settings.customColors?.secondary || "#6b7280"}
                            onChange={(color) => setCustomColors({ secondary: color })}
                          />
                        </div>

                        <EnhancedButton
                          variant="outline"
                          onClick={() => {
                            setCustomColors({
                              background: "#ffffff",
                              foreground: "#000000",
                              primary: "#3b82f6",
                              secondary: "#6b7280",
                            })
                          }}
                        >
                          Restablecer a Predeterminado
                        </EnhancedButton>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Volume2 className="h-5 w-5" />
                        Audio y Voz
                      </CardTitle>
                      <CardDescription>Configura texto a voz y configuración de audio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-card-foreground">Texto a Voz</p>
                          <p className="text-sm text-muted-foreground">Habilitar funcionalidad de lector de pantalla</p>
                        </div>
                        <EnhancedButton
                          variant={settings.screenReaderMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSettings({ screenReaderMode: !settings.screenReaderMode })}
                        >
                          {settings.screenReaderMode ? t("common.on") : t("common.off")}
                        </EnhancedButton>
                      </div>

                      {settings.screenReaderMode && (
                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                          <div>
                            <label className="text-sm font-medium text-card-foreground mb-2 block">
                              Velocidad de Voz: {settings.speechRate}x
                            </label>
                            <input
                              type="range"
                              min="0.5"
                              max="2"
                              step="0.1"
                              value={settings.speechRate}
                              onChange={(e) => updateSettings({ speechRate: Number.parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-card-foreground mb-2 block">
                              Volumen de Voz: {Math.round(settings.speechVolume * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={settings.speechVolume}
                              onChange={(e) => updateSettings({ speechVolume: Number.parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Keyboard className="h-5 w-5" />
                        Navegación por Teclado
                      </CardTitle>
                      <CardDescription>Atajos de teclado y opciones de navegación</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + 1</kbd>
                              <span className="text-muted-foreground">Saltar al contenido principal</span>
                            </div>
                            <div className="flex justify-between">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + H</kbd>
                              <span className="text-muted-foreground">Alternar alto contraste</span>
                            </div>
                            <div className="flex justify-between">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + M</kbd>
                              <span className="text-muted-foreground">Alternar movimiento reducido</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + +</kbd>
                              <span className="text-muted-foreground">Aumentar tamaño de fuente</span>
                            </div>
                            <div className="flex justify-between">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + -</kbd>
                              <span className="text-muted-foreground">Disminuir tamaño de fuente</span>
                            </div>
                            <div className="flex justify-between">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + A</kbd>
                              <span className="text-muted-foreground">Abrir menú de accesibilidad</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Controles de Privacidad
                      </CardTitle>
                      <CardDescription>Gestiona tus preferencias de privacidad y compartición de datos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            title: "Visibilidad del Perfil",
                            description: "Controla quién puede ver tu información de perfil",
                            options: ["Público", "Solo Usuarios Registrados", "Privado"],
                          },
                          {
                            title: "Historial de Sesiones",
                            description: "Permitir que otros vean tus sesiones completadas",
                            options: ["Visible", "Oculto"],
                          },
                          {
                            title: "Información de Contacto",
                            description: "Mostrar tus datos de contacto a otros usuarios",
                            options: ["Visible", "Oculto"],
                          },
                          {
                            title: "Análisis",
                            description: "Ayudar a mejorar TutorHub compartiendo datos de uso",
                            options: ["Permitir", "Denegar"],
                          },
                        ].map((setting, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-card-foreground">{setting.title}</p>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <EnhancedSelect
                              label=""
                              showLabel={false}
                              options={setting.options.map((opt) => ({ value: opt.toLowerCase(), label: opt }))}
                              value={setting.options[0].toLowerCase()}
                              onValueChange={() => {}}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">Gestión de Datos</CardTitle>
                      <CardDescription>Controla tu información personal y datos de cuenta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">Exportar Datos</p>
                          <p className="text-sm text-muted-foreground">Descargar una copia de los datos de tu cuenta</p>
                        </div>
                        <EnhancedButton
                          variant="outline"
                          leftIcon={<Download className="h-4 w-4" />}
                          onClick={exportData}
                        >
                          Exportar
                        </EnhancedButton>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <div>
                          <p className="font-medium text-red-800 dark:text-red-300">Eliminar Cuenta</p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Eliminar permanentemente tu cuenta y todos los datos
                          </p>
                        </div>
                        <EnhancedButton
                          variant="outline"
                          leftIcon={<Trash2 className="h-4 w-4" />}
                          onClick={deleteAccount}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                        >
                          Eliminar
                        </EnhancedButton>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Account Settings */}
              {activeTab === "account" && (
                <>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">Información de la Cuenta</CardTitle>
                      <CardDescription>Detalles y estado de tu cuenta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                          <p className="font-medium text-card-foreground">{profile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rol</p>
                          <Badge className="bg-primary text-primary-foreground">
                            {profile.role === "tutor" ? "Tutor" : "Estudiante"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Miembro Desde</p>
                          <p className="font-medium text-card-foreground">
                            {new Date(profile.created_at).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estado de la Cuenta</p>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          >
                            Activa
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">{t("settings.security")}</CardTitle>
                      <CardDescription>Gestiona la configuración de seguridad de tu cuenta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">Cambiar Contraseña</p>
                          <p className="text-sm text-muted-foreground">Actualiza la contraseña de tu cuenta</p>
                        </div>
                        <EnhancedButton variant="outline">Cambiar Contraseña</EnhancedButton>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">Autenticación de Dos Factores</p>
                          <p className="text-sm text-muted-foreground">Agregar una capa extra de seguridad</p>
                        </div>
                        <EnhancedButton variant="outline">Habilitar 2FA</EnhancedButton>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">Sesiones Activas</p>
                          <p className="text-sm text-muted-foreground">Gestiona tus dispositivos con sesión iniciada</p>
                        </div>
                        <EnhancedButton variant="outline">Ver Sesiones</EnhancedButton>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">Cerrar Sesión</CardTitle>
                      <CardDescription>Cerrar sesión de tu cuenta en este dispositivo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedButton variant="outline" onClick={signOut} className="w-full">
                        Cerrar Sesión
                      </EnhancedButton>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
