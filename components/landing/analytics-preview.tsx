'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip 
} from 'recharts'
import { AlertTriangle, TrendingUp, Bug, Thermometer, Droplets, Wind } from 'lucide-react'

const cropHealthData = [
  { name: 'Mon', value: 85 },
  { name: 'Tue', value: 88 },
  { name: 'Wed', value: 82 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 87 },
  { name: 'Sat', value: 92 },
  { name: 'Sun', value: 95 },
]

const pestActivityData = [
  { name: 'Week 1', aphids: 12, beetles: 8, caterpillars: 5 },
  { name: 'Week 2', aphids: 15, beetles: 10, caterpillars: 7 },
  { name: 'Week 3', aphids: 8, beetles: 6, caterpillars: 4 },
  { name: 'Week 4', aphids: 5, beetles: 3, caterpillars: 2 },
]

const alerts = [
  { type: 'critical', title: 'Locust Swarm Detected', location: 'North Field', time: '2 min ago' },
  { type: 'warning', title: 'High Humidity Alert', location: 'Greenhouse A', time: '15 min ago' },
  { type: 'info', title: 'Irrigation Scheduled', location: 'All Fields', time: '1 hour ago' },
]

export function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Live Analytics
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Real-Time Farm Intelligence
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Monitor your entire operation with beautiful, actionable dashboards updated in real-time.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Crop Health Index</CardTitle>
              <Badge variant="outline" className="text-accent border-accent">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cropHealthData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'critical' 
                      ? 'bg-destructive/10 border-destructive/30' 
                      : alert.type === 'warning'
                      ? 'bg-warning/10 border-warning/30'
                      : 'bg-primary/10 border-primary/30'
                  }`}
                >
                  <div className="font-medium text-sm text-foreground">{alert.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {alert.location} &bull; {alert.time}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Pest Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bug className="w-5 h-5 text-destructive" />
                Pest Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pestActivityData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }} 
                    />
                    <Line type="monotone" dataKey="aphids" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="beetles" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="caterpillars" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weather Stats */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Thermometer, label: 'Temperature', value: '28°C', color: 'text-destructive' },
                  { icon: Droplets, label: 'Humidity', value: '65%', color: 'text-blue-500' },
                  { icon: Wind, label: 'Wind Speed', value: '12 km/h', color: 'text-muted-foreground' },
                  { icon: TrendingUp, label: 'Pressure', value: '1013 hPa', color: 'text-primary' },
                ].map((stat, index) => (
                  <div key={index} className="bg-secondary/50 rounded-xl p-4 text-center">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
