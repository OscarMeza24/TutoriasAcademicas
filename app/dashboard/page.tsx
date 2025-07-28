"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AccessibleButton } from "@/components/ui/accessible-button"
import { Calendar, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase, type TutoringSession } from "@/lib/supabase"
import { useLanguage } from "@/hooks/use-language"

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const [upcomingSessions, setUpcomingSessions] = useState<TutoringSession[]>([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
  })

  const { t } = useLanguage()

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch upcoming sessions
      const { data: sessions } = await supabase
        .from("tutoring_sessions")
        .select(`
          *,
          tutor:profiles!tutoring_sessions_tutor_id_fkey(full_name, avatar_url),
          student:profiles!tutoring_sessions_student_id_fkey(full_name, avatar_url),
          subject:subjects(name)
        `)
        .or(`tutor_id.eq.${user.id},student_id.eq.${user.id}`)
        .eq("status", "scheduled")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5)

      setUpcomingSessions(sessions || [])

      // Fetch stats
      const { data: allSessions } = await supabase
        .from("tutoring_sessions")
        .select("status")
        .or(`tutor_id.eq.${user.id},student_id.eq.${user.id}`)

      if (allSessions) {
        setStats({
          totalSessions: allSessions.length,
          completedSessions: allSessions.filter((s) => s.status === "completed").length,
          upcomingSessions: allSessions.filter((s) => s.status === "scheduled").length,
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex-1 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
            <AccessibleButton asChild>
              <Link href="/auth/signin">Sign In</Link>
            </AccessibleButton>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4 bg-background">
        <div className="container mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-background">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              {t("dashboard.welcome")}, {profile?.full_name}!
            </h1>
            <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {t("dashboard.totalSessions")}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">All time sessions</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{t("dashboard.completed")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stats.completedSessions}</div>
                <p className="text-xs text-muted-foreground">Successfully completed</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{t("dashboard.upcoming")}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stats.upcomingSessions}</div>
                <p className="text-xs text-muted-foreground">Scheduled sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">{t("dashboard.upcomingSessions")}</CardTitle>
              <CardDescription>Your next scheduled tutoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                        <div>
                          <h3 className="font-medium text-card-foreground">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {profile?.role === "tutor"
                              ? `with ${session.student?.full_name}`
                              : `with ${session.tutor?.full_name}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.scheduled_at).toLocaleDateString()} at{" "}
                            {new Date(session.scheduled_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <AccessibleButton variant="outline" size="sm" asChild>
                        <Link href={`/sessions/${session.id}`}>View Details</Link>
                      </AccessibleButton>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium mb-2 text-card-foreground">{t("dashboard.noSessions")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {profile?.role === "student"
                      ? "Ready to book your next tutoring session?"
                      : "No sessions scheduled yet."}
                  </p>
                  {profile?.role === "student" && (
                    <AccessibleButton asChild>
                      <Link href="/search">{t("dashboard.findTutors")}</Link>
                    </AccessibleButton>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.role === "student" ? (
                  <>
                    <AccessibleButton className="w-full" asChild>
                      <Link href="/search">{t("dashboard.findTutors")}</Link>
                    </AccessibleButton>
                    <AccessibleButton variant="outline" className="w-full" asChild>
                      <Link href="/sessions">{t("dashboard.viewSessions")}</Link>
                    </AccessibleButton>
                  </>
                ) : (
                  <>
                    <AccessibleButton className="w-full" asChild>
                      <Link href="/availability">Update Availability</Link>
                    </AccessibleButton>
                    <AccessibleButton variant="outline" className="w-full" asChild>
                      <Link href="/sessions">Manage Sessions</Link>
                    </AccessibleButton>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AccessibleButton variant="outline" className="w-full" asChild>
                  <Link href="/profile">Edit Profile</Link>
                </AccessibleButton>
                <AccessibleButton variant="outline" className="w-full" asChild>
                  <Link href="/settings">Account Settings</Link>
                </AccessibleButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
