'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/lib/firebase/auth-context'
import { useProfile } from '@/hooks/use-supabase'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  User,
  Bell,
  Lock,
  Sun,
  Moon,
  Monitor,
  Globe,
  Leaf,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Trash2,
  LogOut,
  Save,
  Shield,
  Settings,
  CheckCircle2,
} from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { profile, loading: profileLoading, upsertProfile } = useProfile(user?.uid)
  const { theme, setTheme } = useTheme()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [farmName, setFarmName] = useState('')
  const [language, setLanguage] = useState('en')
  const [weatherUnit, setWeatherUnit] = useState<'celsius' | 'fahrenheit'>('celsius')
  const [saving, setSaving] = useState(false)

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    pestAlerts: true,
    weatherAlerts: true,
    communityActivity: false,
    aiDetections: true,
    weeklyDigest: false,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotifications: true,
  })

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
      setLocation(profile.location ?? '')
    }
  }, [profile])

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const { error } = await upsertProfile({
      full_name: fullName,
      phone,
      location,
      email: user?.email ?? undefined,
    })
    setSaving(false)
    if (error) toast.error('Failed to save: ' + error)
    else toast.success('Profile saved successfully!')
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, notifications, and preferences</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <motion.div variants={itemVariants}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="profile" className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your personal details and farm profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    {profileLoading ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {profileLoading ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Region / Location</Label>
                    {profileLoading ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        id="location"
                        placeholder="e.g. Nairobi, Kenya"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                      id="farmName"
                      placeholder="e.g. Green Valley Farm"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weatherUnit">Weather Units</Label>
                    <Select
                      value={weatherUnit}
                      onValueChange={(v) => setWeatherUnit(v as 'celsius' | 'fahrenheit')}
                    >
                      <SelectTrigger id="weatherUnit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="celsius">Celsius (°C)</SelectItem>
                        <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Interface Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                        <SelectItem value="eat">EAT (East Africa Time)</SelectItem>
                        <SelectItem value="cet">CET (Central European Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible account actions.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is permanent. All your farm data, detections, and reports will be deleted and cannot be recovered.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Delivery Channels
                </CardTitle>
                <CardDescription>Choose how you want to receive alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email' as const, icon: Mail, label: 'Email Notifications', desc: 'Receive alerts via email' },
                  { key: 'sms' as const, icon: MessageSquare, label: 'SMS Notifications', desc: 'Receive critical alerts via SMS' },
                  { key: 'push' as const, icon: Smartphone, label: 'Push Notifications', desc: 'Browser and mobile push alerts' },
                ].map(({ key, icon: Icon, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                    <Switch checked={notifications[key]} onCheckedChange={() => toggleNotif(key)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" />
                  Alert Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'pestAlerts' as const, label: 'Pest Alerts', desc: 'Locust, aphid, and other pest notifications' },
                  { key: 'weatherAlerts' as const, label: 'Weather Warnings', desc: 'Storms, frost, drought alerts' },
                  { key: 'aiDetections' as const, label: 'AI Detection Results', desc: 'Notifications when AI analysis completes' },
                  { key: 'communityActivity' as const, label: 'Community Activity', desc: 'Replies and reactions to your posts' },
                  { key: 'weeklyDigest' as const, label: 'Weekly Farm Digest', desc: 'Summary of your farm activity' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch checked={notifications[key]} onCheckedChange={() => toggleNotif(key)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-end">
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => toast.success('Notification settings saved!')}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-warning" />
                  Theme
                </CardTitle>
                <CardDescription>Select the interface color scheme.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun, desc: 'Bright & clean' },
                    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on eyes' },
                    { value: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        theme === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40 bg-secondary/30'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 ${theme === opt.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${theme === opt.value ? 'text-primary' : 'text-foreground'}`}>
                        {opt.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                      {theme === opt.value && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-accent" />
                  Dashboard Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Dashboard View</Label>
                  <Select defaultValue="overview">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="alerts">Alerts Focus</SelectItem>
                      <SelectItem value="map">Map View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Compact Sidebar</p>
                    <p className="text-xs text-muted-foreground">Collapse sidebar by default on load</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Animated Charts</p>
                    <p className="text-xs text-muted-foreground">Enable chart entrance animations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toast.info('Password reset email sent to your inbox.')}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-muted-foreground text-muted-foreground">
                      {security.twoFactor ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(v) => {
                        setSecurity((p) => ({ ...p, twoFactor: v }))
                        toast.success(v ? '2FA enabled' : '2FA disabled')
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Login Notifications</p>
                      <p className="text-xs text-muted-foreground">Email alert on new sign-in</p>
                    </div>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(v) => setSecurity((p) => ({ ...p, loginNotifications: v }))}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-warning" />
                  API Access
                </CardTitle>
                <CardDescription>Manage API keys for external integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">Production API Key</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">sk-agri-••••••••••••••••3f2a</p>
                  </div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => toast.success('Security settings saved!')}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
