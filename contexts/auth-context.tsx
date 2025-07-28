"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase, type Profile } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, role: "student" | "tutor") => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)

        // Si no existe el perfil, intentar crearlo
        if (error.code === "PGRST116") {
          console.log("Profile not found, attempting to create...")
          await createProfile(userId)
        } else {
          toast({
            title: "Error loading profile",
            description: "There was an issue loading your profile. Please try refreshing the page.",
            variant: "destructive",
          })
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
      toast({
        title: "Connection error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        const { data, error } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: userData.user.email || "",
            full_name: userData.user.user_metadata?.full_name || userData.user.email || "New User",
            role: userData.user.user_metadata?.role || "student",
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating profile:", error)
          toast({
            title: "Profile creation failed",
            description: "Unable to create your profile. Please try signing in again.",
            variant: "destructive",
          })
        } else {
          setProfile(data)
          toast({
            title: "Welcome!",
            description: "Your profile has been created successfully.",
          })
        }
      }
    } catch (error) {
      console.error("Error creating profile:", error)
      toast({
        title: "Profile creation error",
        description: "There was an issue creating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Sign in error:", error)

        // Handle specific error cases
        let errorMessage = "Invalid email or password. Please try again."

        if (error.message?.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before signing in."
        } else if (error.message?.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        } else if (error.message?.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a moment before trying again."
        }

        return { error: { message: errorMessage } }
      }

      // Success case is handled by the auth state change listener
      return { error: null }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      return { error: { message: "An unexpected error occurred. Please try again." } }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: "student" | "tutor") => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role,
          },
        },
      })

      if (error) {
        console.error("Sign up error:", error)

        let errorMessage = "Unable to create account. Please try again."

        if (error.message?.includes("already registered")) {
          errorMessage = "An account with this email already exists. Please sign in instead."
        } else if (error.message?.includes("Password")) {
          errorMessage = "Password must be at least 6 characters long."
        } else if (error.message?.includes("Email")) {
          errorMessage = "Please enter a valid email address."
        }

        return { error: { message: errorMessage } }
      }

      // If user is created but email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please check your email to complete registration.",
        })
      }

      // Try to create profile manually if needed
      if (data.user && data.session) {
        try {
          // Wait a bit for the trigger to execute
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Check if profile exists
          const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

          if (!existingProfile) {
            // Create profile manually if it doesn't exist
            await supabase.from("profiles").insert({
              id: data.user.id,
              email: email.trim(),
              full_name: fullName.trim(),
              role,
            })
          }
        } catch (profileError) {
          console.error("Error handling profile creation:", profileError)
          // Don't fail the signup for profile issues
        }
      }

      return { error: null }
    } catch (error) {
      console.error("Unexpected sign up error:", error)
      return { error: { message: "An unexpected error occurred. Please try again." } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        toast({
          title: "Sign out failed",
          description: "There was an issue signing you out. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        })
      }
    } catch (error) {
      console.error("Unexpected sign out error:", error)
      toast({
        title: "Sign out error",
        description: "An unexpected error occurred while signing out.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (error) {
        console.error("Profile update error:", error)
        toast({
          title: "Update failed",
          description: "Unable to update your profile. Please try again.",
          variant: "destructive",
        })
        return { error }
      }

      // Update local state
      setProfile((prev) => (prev ? { ...prev, ...updates } : null))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      return { error: null }
    } catch (error) {
      console.error("Unexpected profile update error:", error)
      toast({
        title: "Update error",
        description: "An unexpected error occurred while updating your profile.",
        variant: "destructive",
      })
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
