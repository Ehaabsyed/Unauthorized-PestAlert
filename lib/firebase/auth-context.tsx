'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth } from './config'

export type UserRole = 'farmer' | 'authority' | 'admin'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role?: UserRole
}

// Demo user for unauthorized-domain environments (e.g. v0 preview)
// UUID format is required for Supabase RLS policies (user_id columns are uuid type)
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
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Detect if the current domain is authorized for Firebase auth.
// Firebase throws auth/unauthorized-domain for unlisted preview URLs.
function isUnauthorizedDomainError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('unauthorized-domain') ||
      error.message.includes('auth/unauthorized-domain'))
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    if (!auth) {
      setIsDemo(true)
      setUser(DEMO_USER)
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser: User | null) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'farmer',
            })
            setIsDemo(false)
          } else {
            setUser(null)
            setIsDemo(false)
          }
          setLoading(false)
        },
        (error) => {
          console.warn('[AgriTech] Auth state error:', error.message)
          if (isUnauthorizedDomainError(error)) {
            setIsDemo(true)
            setUser(DEMO_USER)
          }
          setLoading(false)
        }
      )
    } catch (e) {
      console.warn('[AgriTech] onAuthStateChanged failed:', e)
      setIsDemo(true)
      setUser(DEMO_USER)
      setLoading(false)
    }

    return () => unsubscribe?.()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      // Demo mode: accept any credentials
      setIsDemo(true)
      setUser({ ...DEMO_USER, email })
      return
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      setIsDemo(true)
      setUser({ ...DEMO_USER, email, displayName: name })
      return
    }
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
  }

  const logout = async () => {
    if (!auth || isDemo) {
      setUser(null)
      setIsDemo(false)
      return
    }
    await signOut(auth)
  }

  const signInWithGoogle = async () => {
    if (!auth) {
      setIsDemo(true)
      setUser(DEMO_USER)
      return
    }
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      // Popup blocked or unauthorized-domain — fall back to redirect
      if (isUnauthorizedDomainError(error)) {
        throw new Error(
          'Google Sign-In is blocked on this preview domain. Please add this domain to your Firebase Console under Authentication > Settings > Authorized domains, or use email/password.'
        )
      }
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    if (!auth) {
      console.info('[Demo] Password reset email would be sent to:', email)
      return
    }
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        signIn,
        signUp,
        logout,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
