import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Student {
  id: string
  name: string
  email: string
  grade?: string
  class?: string
  phone?: string
  address?: string
  enrollment_date?: string
  status?: 'active' | 'inactive' | 'suspended'
  created_at?: string
  updated_at?: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  subject?: string
  department?: string
  phone?: string
  address?: string
  qualifications?: string[]
  hire_date?: string
  status?: 'active' | 'inactive' | 'on-leave'
  created_at?: string
  updated_at?: string
}

export interface Class {
  id: string
  name: string
  subject: string
  teacher: string
  grade: string
  schedule: Array<{
    day: string
    start_time: string
    end_time: string
    room: string
  }>
  enrolled_students: number
  max_capacity: number
  academic_year: string
  status?: 'active' | 'inactive' | 'cancelled'
  description?: string
  created_at?: string
  updated_at?: string
}