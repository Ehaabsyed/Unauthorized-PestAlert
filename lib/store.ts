import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Inline types to avoid importing from the Supabase client at module level
export interface Alert {
  id: string
  type: 'pest' | 'weather' | 'outbreak' | 'emergency'
  title: string
  message: string
  severity: 'info' | 'warning' | 'danger' | 'critical'
  location?: string
  lat?: number
  lng?: number
  is_active: boolean
  created_at: string
}

export interface AIDetection {
  id: string
  user_id: string
  image_url: string
  pest_name?: string
  disease_name?: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  treatment?: string
  outbreak_probability: number
  created_at: string
}

interface AppState {
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Notifications
  notifications: Alert[]
  addNotification: (notification: Alert) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // AI Detections cache
  recentDetections: AIDetection[]
  addDetection: (detection: AIDetection) => void

  // Settings
  settings: {
    smsAlerts: boolean
    emailAlerts: boolean
    pushNotifications: boolean
    weatherUnit: 'celsius' | 'fahrenheit'
    language: string
  }
  updateSettings: (settings: Partial<AppState['settings']>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // AI Detections
      recentDetections: [],
      addDetection: (detection) =>
        set((state) => ({
          recentDetections: [detection, ...state.recentDetections].slice(0, 10),
        })),

      // Settings
      settings: {
        smsAlerts: true,
        emailAlerts: true,
        pushNotifications: true,
        weatherUnit: 'celsius',
        language: 'en',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'agronova-storage',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
