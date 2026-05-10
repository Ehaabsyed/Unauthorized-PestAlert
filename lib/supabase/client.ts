import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('@supabase/ssr: Your project\'s URL and API key are required to create a Supabase client!')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)

// Lazy singleton for backwards compatibility
let _client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!_client && supabaseUrl && supabaseAnonKey) {
    _client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return _client
}

// ─── Database Types ───────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email?: string
  full_name?: string
  phone?: string
  location?: string
  farm_size_hectares?: number
  primary_crops?: string[]
  role: 'farmer' | 'authority' | 'admin'
  created_at: string
  updated_at: string
}

export interface AIDetection {
  id: string
  user_id: string
  image_url?: string
  detected_pests?: string[]
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  recommendations?: string[]
  created_at: string
}

export interface Report {
  id: string
  user_id: string
  title: string
  type: string
  content: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  author_name: string
  content: string
  category: 'discussion' | 'question' | 'solution' | 'news'
  likes_count?: number
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  region?: string
  pest_type?: string
  created_at: string
}
