'use client'

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
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
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  Bell,
  FileText,
  Activity,
  CloudRain,
  Bug,
  ArrowLeft,
  Search,
  Check,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// ─── Mock regional data ───────────────────────────────────────────────────────

const mockAlerts = [
  { id: '1', title: 'Locust Swarm Alert', severity: 'critical', region: 'North Zone', createdAt: new Date() },
  { id: '2', title: 'Fungal Outbreak Warning', severity: 'high', region: 'Central Zone', createdAt: new Date() },
  { id: '3', title: 'Pest Activity Detected', severity: 'medium', region: 'South Zone', createdAt: new Date() },
]

const regionalOutbreaks = [
  { region: 'North Zone', level: 'critical', affected: 12, pest: 'Locust Swarm', lat: 14.5, lng: 75.0 },
  { region: 'South Zone', level: 'high', affected: 8, pest: 'Aphid Colony', lat: 12.9, lng: 77.5 },
  { region: 'East Zone', level: 'medium', affected: 5, pest: 'Leaf Blight', lat: 13.1, lng: 80.3 },
  { region: 'West Zone', level: 'low', affected: 2, pest: 'Root Rot', lat: 15.3, lng: 74.9 },
]

const farmerMonitoring = [
  { name: 'Rajesh Kumar', region: 'North Zone', farm: '12 ha', status: 'alert', lastUpdate: '5 min ago' },
  { name: 'Maria Santos', region: 'South Zone', farm: '8 ha', status: 'normal', lastUpdate: '12 min ago' },
  { name: 'Ahmed Hassan', region: 'East Zone', farm: '20 ha', status: 'warning', lastUpdate: '1 hour ago' },
  { name: 'Priya Sharma', region: 'West Zone', farm: '15 ha', status: 'normal', lastUpdate: '30 min ago' },
  { name: 'John Okonkwo', region: 'North Zone', farm: '10 ha', status: 'alert', lastUpdate: '2 min ago' },
]

const monthlyOutbreakData = [
  { month: 'Jan', outbreaks: 4, resolved: 3 },
  { month: 'Feb', outbreaks: 6, resolved: 5 },
  { month: 'Mar', outbreaks: 8, resolved: 6 },
  { month: 'Apr', outbreaks: 5, resolved: 5 },
  { month: 'May', outbreaks: 9, resolved: 7 },
  { month: 'Jun', outbreaks: 7, resolved: 6 },
]

const pestBreakdown = [
  { name: 'Locusts', value: 28, color: 'hsl(var(--destructive))' },
  { name: 'Aphids', value: 22, color: 'hsl(var(--warning))' },
  { name: 'Beetles', value: 18, color: 'hsl(var(--primary))' },
  { name: 'Blight', value: 20, color: 'hsl(var(--accent))' },
  { name: 'Other', value: 12, color: 'hsl(var(--muted-foreground))' },
]

const accessRequests = [
  { id: 1, type: 'Emergency Access', org: 'Regional Agriculture Dept.', status: 'pending', date: '2024-05-08', details: 'Real-time disease outbreak data for regional coordination' },
  { id: 2, type: 'Data Share', org: 'State Pest Control Board', status: 'approved', date: '2024-05-05', details: 'Weekly pest occurrence reports' },
  { id: 3, type: 'Emergency Alert', org: 'Local Farmer Cooperative', status: 'approved', date: '2024-05-01', details: 'Critical disease alert distribution' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const levelColors: Record<string, string> = {
  critical: 'text-destructive border-destructive bg-destructive/10',
  high: 'text-warning border-warning bg-warning/10',
  medium: 'text-primary border-primary bg-primary/10',
  low: 'text-accent border-accent bg-accent/10',
}

const farmerStatusColors: Record<string, string> = {
  alert: 'text-destructive',
  warning: 'text-warning',
  normal: 'text-accent',
}

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  color: 'hsl(var(--foreground))',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthorityPage() {
  const [searchFarmer, setSearchFarmer] = useState('')
  const [requests, setRequests] = useState(accessRequests)

  const filteredFarmers = farmerMonitoring.filter(f =>
    f.name.toLowerCase().includes(searchFarmer.toLowerCase()) ||
    f.region.toLowerCase().includes(searchFarmer.toLowerCase())
  )

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
    toast.success('Request approved')
  }

  const handleReject = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    toast.error('Request rejected')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Authority Portal</h1>
            <p className="text-muted-foreground text-sm">Regional outbreak analytics and emergency controls</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-destructive border-destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {regionalOutbreaks.filter(r => r.level === 'critical').length} Critical Zones
          </Badge>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Farmer Portal
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: String(mockAlerts.length), icon: Bell, color: 'text-destructive', bg: 'bg-destructive/10' },
          { label: 'Affected Farmers', value: '47', icon: Users, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Outbreak Zones', value: String(regionalOutbreaks.length), icon: MapPin, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Reports Filed', value: '23', icon: FileText, color: 'text-accent', bg: 'bg-accent/10' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="outbreaks">
          <TabsList className="mb-4">
            <TabsTrigger value="outbreaks">Outbreak Map</TabsTrigger>
            <TabsTrigger value="farmers">Farmer Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="access">Access Requests</TabsTrigger>
          </TabsList>

          {/* Outbreak Zones */}
          <TabsContent value="outbreaks" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {regionalOutbreaks.map((zone, i) => (
                <motion.div key={zone.region} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{zone.region}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${levelColors[zone.level]}`}>
                          {zone.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-1">
                        <Bug className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />
                        {zone.pest}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">{zone.affected} farms affected</p>
                      <Progress
                        value={zone.level === 'critical' ? 90 : zone.level === 'high' ? 70 : zone.level === 'medium' ? 45 : 20}
                        className="h-1.5"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Live Alerts from Supabase */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-destructive" />
                  Live Alert Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No active alerts at this time</p>
                ) : mockAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.severity === 'critical' ? 'bg-destructive/5 border-destructive/20'
                    : alert.severity === 'danger' ? 'bg-warning/5 border-warning/20'
                    : 'bg-primary/5 border-primary/20'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.location ?? 'Unknown'} &bull; {new Date(alert.created_at).toLocaleTimeString()}</p>
                      </div>
                      <Badge variant="outline" className={
                        alert.severity === 'critical' ? 'border-destructive text-destructive text-xs'
                        : alert.severity === 'danger' ? 'border-warning text-warning text-xs'
                        : 'border-primary text-primary text-xs'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmer Monitoring */}
          <TabsContent value="farmers" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search farmers by name or region..."
                className="pl-10"
                value={searchFarmer}
                onChange={(e) => setSearchFarmer(e.target.value)}
              />
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredFarmers.map((farmer, i) => (
                    <motion.div
                      key={farmer.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {farmer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{farmer.name}</p>
                          <p className="text-xs text-muted-foreground">{farmer.region} &bull; {farmer.farm}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground hidden sm:block">{farmer.lastUpdate}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            farmer.status === 'alert' ? 'bg-destructive animate-pulse'
                            : farmer.status === 'warning' ? 'bg-warning'
                            : 'bg-accent'
                          }`} />
                          <span className={`text-xs font-medium capitalize ${farmerStatusColors[farmer.status]}`}>
                            {farmer.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Outbreaks vs Resolved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyOutbreakData}>
                        <defs>
                          <linearGradient id="auth-outbreakGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="auth-resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="outbreaks" stroke="hsl(var(--destructive))" strokeWidth={2} fill="url(#auth-outbreakGrad)" name="Outbreaks" />
                        <Area type="monotone" dataKey="resolved" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#auth-resolvedGrad)" name="Resolved" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bug className="w-5 h-5 text-warning" />
                    Pest Type Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pestBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                          {pestBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {pestBreakdown.map((p) => (
                      <div key={p.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="text-muted-foreground truncate">{p.name}</span>
                        <span className="ml-auto font-medium text-foreground">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-blue-500" />
                  Regional Weather Risk Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalOutbreaks.map(r => ({ name: r.region, risk: r.level === 'critical' ? 90 : r.level === 'high' ? 70 : r.level === 'medium' ? 45 : 20 }))}>
                      <defs>
                        <linearGradient id="auth-riskGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="risk" fill="url(#auth-riskGrad)" radius={[6, 6, 0, 0]} name="Risk Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests */}
          <TabsContent value="access" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Authority Access Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requests.map((req, i) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        req.status === 'approved' ? 'bg-accent/10' : 'bg-warning/10'
                      }`}>
                        {req.status === 'approved'
                          ? <CheckCircle2 className="w-4 h-4 text-accent" />
                          : <Clock className="w-4 h-4 text-warning" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{req.type}</p>
                        <p className="text-xs text-muted-foreground">{req.org}</p>
                        <p className="text-xs text-muted-foreground mt-1">{req.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-11 sm:ml-0">
                      {req.status === 'pending' ? (
                        <>
                          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground h-8" onClick={() => handleApprove(req.id)}>
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/5 h-8" onClick={() => handleReject(req.id)}>
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge className="bg-accent/10 text-accent border-accent/30">Approved</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
