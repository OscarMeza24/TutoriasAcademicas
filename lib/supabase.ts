import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name: string
  role: "student" | "tutor" | "admin"
  avatar_url?: string
  phone?: string
  bio?: string
  specializations?: string[]
  availability?: any
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  description?: string
  category?: string
  created_at: string
}

export interface TutoringSession {
  id: string
  tutor_id: string
  student_id: string
  subject_id?: string
  title: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  meeting_url?: string
  notes?: string
  created_at: string
  updated_at: string
  tutor?: Profile
  student?: Profile
  subject?: Subject
}

export interface Notification {
  id: string
  user_id: string
  type: "reminder" | "booking" | "cancellation" | "feedback"
  title: string
  message: string
  read: boolean
  related_session_id?: string
  created_at: string
}
