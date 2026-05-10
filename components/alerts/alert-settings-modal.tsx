'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Bug,
  Cloud,
  AlertTriangle,
  MapPin,
  Save,
  Check,
} from 'lucide-react'

interface AlertSettingsModalProps {
  open: boolean
  onClose: () => void
}

const SEVERITY_LEVELS = ['critical', 'high', 'warning', 'medium', 'info'] as const
const ALERT_CATEGORIES = [
  { id: 'pest', label: 'Pest Alerts', icon: Bug, description: 'Aphids, locusts, and crop pests' },
  { id: 'weather', label: 'Weather Warnings', icon: Cloud, description: 'Storms, frost, drought' },
  { id: 'outbreak', label: 'Disease Outbreaks', icon: AlertTriangle, description: 'Regional outbreak events' },
  { id: 'authority', label: 'Authority Broadcasts', icon: Bell, description: 'Government advisories' },
]

export function AlertSettingsModal({ open, onClose }: AlertSettingsModalProps) {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    sms: true,
    email: true,
    push: false,
    smsNumber: '+1 (555) 000-0000',
    emailAddress: 'farmer@example.com',
    minSeverity: 'warning',
    regions: ['all'],
    categories: { pest: true, weather: true, outbreak: true, authority: true },
    quietHoursEnabled: false,
    quietStart: '22:00',
    quietEnd: '06:00',
    frequency: 'realtime',
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCategory = (cat: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [cat]: !prev.categories[cat as keyof typeof prev.categories],
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast.success('Alert settings saved successfully', {
      description: 'Your notification preferences have been updated.',
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alert Settings
          </DialogTitle>
          <DialogDescription>
            Configure how and when you receive emergency alerts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Notification Channels */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Notification Channels</h3>

            {/* SMS */}
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <Label htmlFor="sms-toggle" className="font-medium cursor-pointer">SMS Notifications</Label>
                </div>
                <Switch id="sms-toggle" checked={settings.sms} onCheckedChange={() => toggle('sms')} />
              </div>
              {settings.sms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    placeholder="Phone number"
                    value={settings.smsNumber}
                    onChange={(e) => setSettings((p) => ({ ...p, smsNumber: e.target.value }))}
                    className="text-sm"
                  />
                </motion.div>
              )}
            </div>

            {/* Email */}
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <Label htmlFor="email-toggle" className="font-medium cursor-pointer">Email Notifications</Label>
                </div>
                <Switch id="email-toggle" checked={settings.email} onCheckedChange={() => toggle('email')} />
              </div>
              {settings.email && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <Input
                    placeholder="Email address"
                    type="email"
                    value={settings.emailAddress}
                    onChange={(e) => setSettings((p) => ({ ...p, emailAddress: e.target.value }))}
                    className="text-sm"
                  />
                </motion.div>
              )}
            </div>

            {/* Push */}
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-warning" />
                  <Label htmlFor="push-toggle" className="font-medium cursor-pointer">Push Notifications</Label>
                </div>
                <Switch id="push-toggle" checked={settings.push} onCheckedChange={() => toggle('push')} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Severity Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Minimum Alert Severity</h3>
            <p className="text-xs text-muted-foreground">Only receive alerts at or above this severity level.</p>
            <div className="flex flex-wrap gap-2">
              {SEVERITY_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSettings((p) => ({ ...p, minSeverity: level }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    settings.minSeverity === level
                      ? level === 'critical' ? 'bg-destructive text-destructive-foreground border-destructive'
                        : level === 'high' ? 'bg-orange-500 text-white border-orange-500'
                        : level === 'warning' || level === 'medium' ? 'bg-warning text-warning-foreground border-warning'
                        : 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  {settings.minSeverity === level && <Check className="w-3 h-3 inline ml-1" />}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Alert Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Alert Categories</h3>
            <div className="space-y-2">
              {ALERT_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <cat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.categories[cat.id as keyof typeof settings.categories]}
                    onCheckedChange={() => toggleCategory(cat.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Frequency */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Delivery Frequency</h3>
            <Select value={settings.frequency} onValueChange={(v) => setSettings((p) => ({ ...p, frequency: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (immediate)</SelectItem>
                <SelectItem value="hourly">Hourly digest</SelectItem>
                <SelectItem value="daily">Daily summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Region Filter</h3>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north">North Zone</SelectItem>
                <SelectItem value="south">South Zone</SelectItem>
                <SelectItem value="east">East Zone</SelectItem>
                <SelectItem value="west">West Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Quiet Hours</h3>
                <p className="text-xs text-muted-foreground">Suppress non-critical alerts during these hours.</p>
              </div>
              <Switch
                checked={settings.quietHoursEnabled}
                onCheckedChange={() => toggle('quietHoursEnabled')}
              />
            </div>
            {settings.quietHoursEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="time"
                    value={settings.quietStart}
                    onChange={(e) => setSettings((p) => ({ ...p, quietStart: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="time"
                    value={settings.quietEnd}
                    onChange={(e) => setSettings((p) => ({ ...p, quietEnd: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
