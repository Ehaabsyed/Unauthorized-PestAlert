'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type UserRole = 'farmer' | 'authority' | 'admin'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role?: UserRole
}

const DEMO_USER: AuthUser = {
  uid: '00000000-0000-0000-0000-000000000001',
  email: 'demo@agritech-sentinel.io',
  displayName: 'Demo Farmer',
  photoURL: null,
  role: 'farmer',
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { ReactNode: any, children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!supabase) {
      console.warn('[AgriTech] Supabase not configured. Using Demo Mode.')
      setIsDemo(true)
      setUser(DEMO_USER)
      setLoading(false)
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            uid: session.user.id,
            email: session.user.email ?? null,
            displayName: session.user.user_metadata?.full_name ?? null,
            photoURL: null,
            role: session.user.user_metadata?.role ?? 'farmer',
          })
          setIsDemo(false)
        } else {
          setUser(null)
          setIsDemo(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      setIsDemo(true)
      setUser({ ...DEMO_USER, email })
      return
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      setIsDemo(true)
      setUser({ ...DEMO_USER, email, displayName: name })
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'farmer',
        },
      },
    })
    if (error) throw error
  }

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    router.push('/login')
    router.refresh()
  }

  const resetPassword = async (email: string) => {
    if (!supabase) return
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signUp, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
