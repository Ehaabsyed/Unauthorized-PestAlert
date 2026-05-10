'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/firebase/auth-context'
import { useAppStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Bug,
  AlertTriangle,
  Map,
  Cloud,
  FileText,
  Users,
  Settings,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  FlaskConical,
  Sun,
  Moon,
  Check,
  Trash2,
  Bug as BugIcon,
  CloudRain,
  ShieldAlert,
  MessageSquare,
  Cpu,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { SplashScreen } from '@/components/splash-screen'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ai-detection', label: 'AI Detection', icon: Bug },
  { href: '/emergency-alerts', label: 'Emergency Alerts', icon: AlertTriangle },
  { href: '/outbreak-map', label: 'Outbreak Map', icon: Map },
  { href: '/weather', label: 'Weather', icon: Cloud },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface AppNotification {
  id: string
  category: 'pest' | 'weather' | 'authority' | 'community' | 'ai'
  title: string
  message: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    category: 'pest',
    title: 'Pest Alert: Aphid Colony',
    message: 'High aphid concentration detected in South Field. Immediate action recommended.',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    category: 'weather',
    title: 'Weather Warning: Storm',
    message: 'Severe thunderstorm expected in your region within the next 6 hours.',
    time: '20 min ago',
    read: false,
  },
  {
    id: '3',
    category: 'authority',
    title: 'Authority Request',
    message: 'Regional agriculture board requests your field inspection report.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    category: 'community',
    title: 'New Community Post',
    message: 'Maria Santos replied to your post about crop rotation strategies.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '5',
    category: 'ai',
    title: 'AI Detection Complete',
    message: 'Your uploaded image has been analyzed. Leaf blight detected with 87% confidence.',
    time: '3 hours ago',
    read: true,
  },
]

const getCategoryIcon = (category: AppNotification['category']) => {
  switch (category) {
    case 'pest': return BugIcon
    case 'weather': return CloudRain
    case 'authority': return ShieldAlert
    case 'community': return MessageSquare
    case 'ai': return Cpu
    default: return Bell
  }
}

const getCategoryColor = (category: AppNotification['category']) => {
  switch (category) {
    case 'pest': return 'text-destructive bg-destructive/10'
    case 'weather': return 'text-blue-500 bg-blue-500/10'
    case 'authority': return 'text-warning bg-warning/10'
    case 'community': return 'text-accent bg-accent/10'
    case 'ai': return 'text-primary bg-primary/10'
    default: return 'text-muted-foreground bg-muted'
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout, isDemo } = useAuth()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Avoid SSR/client hydration mismatch on theme-dependent attributes
  useEffect(() => { setMounted(true) }, [])
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close notification panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAll = () => setNotifications([])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const initials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ||
    user?.email?.[0]?.toUpperCase() ||
    'U'

  const pageTitle =
    pathname === '/dashboard'
      ? 'Dashboard'
      : pathname.replace(/^\//, '').replace(/-/g, ' ')

  return (
    <div className="min-h-screen bg-background flex">
      <SplashScreen duration={1800} />
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center min-w-0">
            <Logo
              size={38}
              showText={sidebarOpen}
              variant="sidebar"
              logoVariant="white"
            />
          </Link>
        </div>

        {/* Demo Badge */}
        {isDemo && sidebarOpen && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-warning flex-shrink-0" />
            <span className="text-xs text-warning font-medium">Demo Mode</span>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRight
              className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
            />
            {sidebarOpen && <span className="ml-3 text-sm">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border z-50"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                <Link href="/dashboard">
                  <Logo size={38} showText variant="sidebar" />
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-sidebar-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {isDemo && (
                <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-warning" />
                  <span className="text-xs text-warning font-medium">
                    Demo Mode — No Firebase configured
                  </span>
                </div>
              )}
              <nav className="py-4 px-3">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground capitalize">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              title={mounted ? (resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
              suppressHydrationWarning
            >
              <Sun className="w-5 h-5 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 text-muted-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotifOpen((v) => !v)}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification Panel */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 h-auto">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
                            <Check className="w-3 h-3 mr-1" />
                            Mark all read
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={clearAll} title="Clear all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Notifications list */}
                    <ScrollArea className="max-h-[400px]">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                          <p className="text-sm text-muted-foreground">No notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map((notif) => {
                            const Icon = getCategoryIcon(notif.category)
                            const colorClass = getCategoryColor(notif.category)
                            return (
                              <button
                                key={notif.id}
                                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left ${
                                  !notif.read ? 'bg-primary/5' : ''
                                }`}
                                onClick={() => markRead(notif.id)}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm font-medium leading-tight ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {notif.title}
                                    </p>
                                    {!notif.read && (
                                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground/70 mt-1">{notif.time}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-border">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-primary hover:text-primary">
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-foreground">
                    {user?.displayName || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {isDemo ? 'Demo Account' : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile &amp; Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isDemo ? 'Exit Demo' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
