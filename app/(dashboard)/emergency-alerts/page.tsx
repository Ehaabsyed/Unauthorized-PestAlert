'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Bell,
  BellOff,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  Bug,
  Cloud,
  Zap,
  Megaphone,
  ArrowRight,
  Phone,
} from 'lucide-react'
import { toast } from 'sonner'
import { SmsNotificationModal } from '@/components/sms/sms-notification-modal'
import { AlertSettingsModal } from '@/components/alerts/alert-settings-modal'
import { useAuth } from '@/lib/supabase/auth-context'
import { useAlerts } from '@/hooks/use-supabase'

const alerts = [
  {
    id: 1,
    type: 'outbreak',
    severity: 'critical',
    title: 'Locust Swarm Detected',
    message: 'Large locust swarm approaching from the northeast. Expected arrival in 6-12 hours. Immediate preventive action recommended.',
    location: 'North Field, Zone A',
    time: '10 minutes ago',
    isNew: true,
    icon: Bug,
  },
  {
    id: 2,
    type: 'weather',
    severity: 'warning',
    title: 'Severe Storm Alert',
    message: 'Thunderstorms with heavy rain and hail expected. Secure equipment and delay outdoor activities.',
    location: 'All Fields',
    time: '45 minutes ago',
    isNew: true,
    icon: Cloud,
  },
  {
    id: 3,
    type: 'pest',
    severity: 'high',
    title: 'Aphid Infestation Rising',
    message: 'Aphid population has increased 40% in the last 24 hours. Consider immediate pesticide application.',
    location: 'South Field, Greenhouse B',
    time: '2 hours ago',
    isNew: false,
    icon: Bug,
  },
  {
    id: 4,
    type: 'emergency',
    severity: 'critical',
    title: 'Authority Broadcast',
    message: 'Regional agricultural emergency declared. All farmers advised to implement pest control measures immediately.',
    location: 'Regional',
    time: '3 hours ago',
    isNew: false,
    icon: Megaphone,
  },
  {
    id: 5,
    type: 'weather',
    severity: 'info',
    title: 'Frost Warning',
    message: 'Overnight temperatures expected to drop below freezing. Protect sensitive crops.',
    location: 'All Fields',
    time: '5 hours ago',
    isNew: false,
    icon: Cloud,
  },
  {
    id: 6,
    type: 'pest',
    severity: 'medium',
    title: 'Fungal Disease Detected',
    message: 'Early signs of leaf blight detected in wheat crops. Monitor and treat if necessary.',
    location: 'East Field',
    time: '8 hours ago',
    isNew: false,
    icon: Bug,
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return {
        badge: 'bg-destructive text-destructive-foreground',
        border: 'border-destructive/30',
        bg: 'bg-destructive/5',
      }
    case 'high':
      return {
        badge: 'bg-destructive/80 text-destructive-foreground',
        border: 'border-destructive/20',
        bg: 'bg-destructive/5',
      }
    case 'warning':
      return {
        badge: 'bg-warning text-warning-foreground',
        border: 'border-warning/30',
        bg: 'bg-warning/5',
      }
    case 'medium':
      return {
        badge: 'bg-warning/80 text-warning-foreground',
        border: 'border-warning/20',
        bg: 'bg-warning/5',
      }
    case 'info':
      return {
        badge: 'bg-primary text-primary-foreground',
        border: 'border-primary/20',
        bg: 'bg-primary/5',
      }
    default:
      return {
        badge: 'bg-muted text-muted-foreground',
        border: 'border-border',
        bg: 'bg-secondary',
      }
  }
}

export default function EmergencyAlertsPage() {
  const { user } = useAuth()
  const { alerts: liveAlerts, loading: alertsLoading } = useAlerts(user?.uid)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [smsModalOpen, setSmsModalOpen] = useState(false)
  const [alertSettingsOpen, setAlertSettingsOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<{ title: string; message: string } | null>(null)
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  const filteredAlerts = alerts.filter((alert) => {
    if (dismissedIds.includes(alert.id)) return false
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || alert.type === activeTab
    return matchesSearch && matchesTab
  })

  const handleDismiss = (id: number) => {
    setDismissedIds((prev) => [...prev, id])
    toast.success('Alert dismissed')
  }

  const handleSendSMS = (alert?: { title: string; message: string }) => {
    setSelectedAlert(alert || { title: 'Emergency Broadcast', message: 'Urgent agricultural alert from AgriTech Sentinel.' })
    setSmsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emergency Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage all critical alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setAlertSettingsOpen(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Alert Settings
          </Button>
          <Button size="sm" className="bg-destructive hover:bg-destructive/90" onClick={() => handleSendSMS()}>
            <Phone className="w-4 h-4 mr-2" />
            Send SMS Alert
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-warning">3</p>
              </div>
              <Zap className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Info</p>
                <p className="text-2xl font-bold text-primary">1</p>
              </div>
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold text-accent">8</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="outbreak">Outbreak</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="pest">Pest</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const colors = getSeverityColor(alert.severity)
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${colors.bg} ${colors.border} border overflow-hidden`}>
                {alert.severity === 'critical' && (
                  <div className="h-1 bg-gradient-to-r from-destructive via-destructive/50 to-destructive animate-pulse" />
                )}
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'critical' || alert.severity === 'high'
                        ? 'bg-destructive/10'
                        : alert.severity === 'warning' || alert.severity === 'medium'
                        ? 'bg-warning/10'
                        : 'bg-primary/10'
                    }`}>
                      <alert.icon className={`w-6 h-6 ${
                        alert.severity === 'critical' || alert.severity === 'high'
                          ? 'text-destructive'
                          : alert.severity === 'warning' || alert.severity === 'medium'
                          ? 'text-warning'
                          : 'text-primary'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={colors.badge}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.isNew && (
                            <Badge variant="outline" className="border-accent text-accent">
                              NEW
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleSendSMS({ title: alert.title, message: alert.message })}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        SMS
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground"
                        onClick={() => handleDismiss(alert.id)}
                      >
                        <BellOff className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'All clear! No active alerts at the moment.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* SMS Notification Modal */}
      <SmsNotificationModal
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        alertTitle={selectedAlert?.title}
        alertDescription={selectedAlert?.message}
      />

      {/* Alert Settings Modal */}
      <AlertSettingsModal open={alertSettingsOpen} onClose={() => setAlertSettingsOpen(false)} />
    </div>
  )
}
