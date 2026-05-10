'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Bug,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  TrendingUp,
  Activity,
  Leaf,
  MapPin,
  Bell,
  ArrowRight,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth-context'
import { useDashboardStats } from '@/hooks/use-supabase'

const cropHealthData = [
  { name: 'Mon', health: 85, pests: 12 },
  { name: 'Tue', health: 88, pests: 8 },
  { name: 'Wed', health: 82, pests: 15 },
  { name: 'Thu', health: 90, pests: 6 },
  { name: 'Fri', health: 87, pests: 9 },
  { name: 'Sat', health: 92, pests: 4 },
  { name: 'Sun', health: 95, pests: 3 },
]

const yieldForecastData = [
  { month: 'Jan', actual: 120, forecast: 115 },
  { month: 'Feb', actual: 135, forecast: 140 },
  { month: 'Mar', actual: 150, forecast: 145 },
  { month: 'Apr', actual: 165, forecast: 170 },
  { month: 'May', actual: 180, forecast: 175 },
  { month: 'Jun', actual: 190, forecast: 195 },
]

const pestDistribution = [
  { name: 'Aphids', value: 35, color: 'hsl(var(--destructive))' },
  { name: 'Beetles', value: 25, color: 'hsl(var(--warning))' },
  { name: 'Caterpillars', value: 20, color: 'hsl(var(--primary))' },
  { name: 'Mites', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Others', value: 5, color: 'hsl(var(--muted-foreground))' },
]

const recentAlerts = [
  { id: 1, type: 'critical', title: 'Locust Swarm Detected', location: 'North Field', time: '2 min ago' },
  { id: 2, type: 'warning', title: 'High Humidity Alert', location: 'Greenhouse A', time: '15 min ago' },
  { id: 3, type: 'info', title: 'Irrigation Complete', location: 'West Field', time: '1 hour ago' },
  { id: 4, type: 'warning', title: 'Pest Activity Rising', location: 'South Field', time: '2 hours ago' },
]

const recentDetections = [
  { id: 1, pest: 'Aphid Infestation', confidence: 94, severity: 'high', time: '10 min ago' },
  { id: 2, pest: 'Leaf Blight', confidence: 87, severity: 'medium', time: '30 min ago' },
  { id: 3, pest: 'Root Rot', confidence: 91, severity: 'high', time: '1 hour ago' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, loading } = useDashboardStats(user?.uid)

  const activeAlertsCount = stats.activeAlerts
  const detectionsCount = stats.totalDetections

  // Map live alerts to UI shape
  const liveAlerts = stats.recentAlerts.map(a => ({
    id: a.id,
    type: a.severity === 'critical' ? 'critical' : a.severity === 'danger' ? 'warning' : 'info',
    title: a.title,
    location: a.location ?? 'Unknown',
    time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  // Map live detections to UI shape
  const liveDetections = stats.recentDetections.slice(0, 3).map(d => ({
    id: d.id,
    pest: d.pest_name ?? d.disease_name ?? 'Unknown Detection',
    confidence: d.confidence,
    severity: d.severity,
    time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Crop Health</p>
                  <p className="text-3xl font-bold text-foreground mt-1">92%</p>
                  <div className="flex items-center gap-1 mt-1 text-accent">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+3.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  {loading ? (
                    <Skeleton className="h-9 w-12 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground mt-1">{activeAlertsCount}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-destructive">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Live from DB</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Detections</p>
                  {loading ? (
                    <Skeleton className="h-9 w-12 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground mt-1">{detectionsCount}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-primary">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Your scans</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Bug className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Community Posts</p>
                  {loading ? (
                    <Skeleton className="h-9 w-12 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.communityPosts}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">total posts</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crop Health Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Crop Health & Pest Activity</CardTitle>
              <Badge variant="outline" className="text-accent border-accent">
                <TrendingUp className="w-3 h-3 mr-1" />
                Improving
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cropHealthData}>
                    <defs>
                      <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="health"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#healthGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pests"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      fill="url(#pestGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weather Widget */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Current Weather</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
                <div>
                  <p className="text-4xl font-bold text-foreground">28°C</p>
                  <p className="text-sm text-muted-foreground">Partly Cloudy</p>
                </div>
                <Thermometer className="w-12 h-12 text-warning" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 text-blue-500">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <p className="text-xl font-semibold text-foreground mt-1">65%</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wind className="w-4 h-4" />
                    <span className="text-sm">Wind</span>
                  </div>
                  <p className="text-xl font-semibold text-foreground mt-1">12 km/h</p>
                </div>
              </div>

              <Link href="/weather">
                <Button variant="outline" className="w-full mt-2">
                  View Full Forecast
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-warning" />
                Recent Alerts
              </CardTitle>
              <Link href="/emergency-alerts">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))
              ) : liveAlerts.length > 0 ? liveAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'critical'
                      ? 'bg-destructive/5 border-destructive/20'
                      : alert.type === 'warning'
                      ? 'bg-warning/5 border-warning/20'
                      : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.location} &bull; {alert.time}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        alert.type === 'critical'
                          ? 'border-destructive text-destructive'
                          : alert.type === 'warning'
                          ? 'border-warning text-warning'
                          : 'border-primary text-primary'
                      }
                    >
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pest Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pest Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pestDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pestDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pestDistribution.slice(0, 4).map((pest, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pest.color }}
                    />
                    <span className="text-muted-foreground">{pest.name}</span>
                    <span className="ml-auto font-medium text-foreground">{pest.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Detections */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                AI Detections
              </CardTitle>
              <Link href="/ai-detection">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))
              ) : liveDetections.length > 0 ? liveDetections.map((detection) => (
                <div key={detection.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{detection.pest}</p>
                      <p className="text-xs text-muted-foreground">{detection.time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        detection.severity === 'high' || detection.severity === 'critical'
                          ? 'border-destructive text-destructive'
                          : 'border-warning text-warning'
                      }
                    >
                      {detection.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={detection.confidence} className="h-2" />
                    <span className="text-xs font-medium text-foreground">{detection.confidence}%</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No detections yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Yield Forecast */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Yield Forecast</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Forecast</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldForecastData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="forecast" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
