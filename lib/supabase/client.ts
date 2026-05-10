import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'PLACEHOLDER' || !url.startsWith('https://')) {
    console.warn('[Supabase] Missing or invalid credentials. Database features will be simulated.');
    if (typeof window !== 'undefined') {
      console.log('%c[Supabase Warning] Database actions will fail until valid keys are provided in .env.local', 'color: orange; font-weight: bold;');
    }
    return null;
  }
  
  return createBrowserClient(url, key);
}

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))

// Lazy singleton for backwards compatibility
let _client: any = null

export function getSupabaseClient() {
  if (!_client && hasSupabaseConfig) {
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
  pest_name: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  location?: string
  recommendations?: string[]
  created_at: string
}

export interface Report {
  id: string
  user_id: string
  title: string
  type: string
  content?: string
  summary?: string
  pest_count?: number
  crop_health?: number
  weather_condition?: string
  risk_level?: string
  recommendations?: string
  data?: any
  status: 'draft' | 'ready' | 'archived'
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  username: string
  content: string
  image_url?: string
  category: 'discussion' | 'question' | 'solution' | 'news'
  likes_count: number
  comments_count: number
  created_at: string
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
