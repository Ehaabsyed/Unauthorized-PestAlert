'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  Bug,
  Cloud,
  Leaf,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/firebase/auth-context'
import { useReports } from '@/hooks/use-supabase'
import type { Report } from '@/lib/supabase/client'

const monthlyData = [
  { month: 'Jan', detections: 45, outbreaks: 3, healthy: 92 },
  { month: 'Feb', detections: 52, outbreaks: 4, healthy: 89 },
  { month: 'Mar', detections: 38, outbreaks: 2, healthy: 94 },
  { month: 'Apr', detections: 65, outbreaks: 5, healthy: 87 },
  { month: 'May', detections: 48, outbreaks: 3, healthy: 91 },
  { month: 'Jun', detections: 35, outbreaks: 2, healthy: 95 },
]

const metrics = [
  { label: 'Total Detections', value: '283', change: '+12%', icon: Bug, color: 'text-destructive' },
  { label: 'Healthy Scans', value: '91%', change: '+3%', icon: Leaf, color: 'text-accent' },
  { label: 'Weather Events', value: '18', change: '-5%', icon: Cloud, color: 'text-blue-500' },
  { label: 'Reports Generated', value: '47', change: '+8%', icon: FileText, color: 'text-primary' },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'detection':
      return Bug
    case 'weather':
      return Cloud
    case 'crop':
      return Leaf
    case 'outbreak':
      return TrendingUp
    default:
      return FileText
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'detection':
      return 'text-destructive bg-destructive/10'
    case 'weather':
      return 'text-blue-500 bg-blue-500/10'
    case 'crop':
      return 'text-accent bg-accent/10'
    case 'outbreak':
      return 'text-warning bg-warning/10'
    default:
      return 'text-muted-foreground bg-muted'
  }
}

export default function ReportsPage() {
  const { user } = useAuth()
  const { reports, loading, createReport, deleteReport } = useReports(user?.uid)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [generating, setGenerating] = useState(false)

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleDownload = (report: Report) => {
    if (report.file_url) {
      window.open(report.file_url, '_blank')
    } else {
      toast.info('No file available for this report yet')
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await deleteReport(id)
    if (error) toast.error('Failed to delete report')
    else toast.success('Report deleted')
  }

  const handleGenerateReport = async () => {
    if (!user) { toast.error('You must be logged in'); return }
    setGenerating(true)
    const { error } = await createReport({
      user_id: user.uid,
      title: `Detection Report — ${new Date().toLocaleDateString()}`,
      type: 'detection',
      data: { generated_at: new Date().toISOString(), source: 'manual' },
    })
    setGenerating(false)
    if (error) toast.error('Failed to generate report: ' + error)
    else toast.success('Report generated and saved!')
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
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">View and download detailed farm reports</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleGenerateReport} disabled={generating}>
          <Plus className="w-4 h-4 mr-2" />
          {generating ? 'Generating...' : 'Generate Report'}
        </Button>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                    <p className={`text-sm ${metric.change.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>
                      {metric.change} vs last month
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(metric.label.toLowerCase().split(' ')[0])}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Detection Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="rpt-detectionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="detections"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      fill="url(#rpt-detectionsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Crop Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
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
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="healthy" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">Generated Reports</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-10 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="detection">Detection</SelectItem>
                    <SelectItem value="crop">Crop Health</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="outbreak">Outbreak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              ) : filteredReports.map((report, index) => {
                const TypeIcon = getTypeIcon(report.type)
                const typeColors = getTypeColor(report.type)
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{report.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.created_at).toLocaleDateString([], { dateStyle: 'medium' })}
                          </span>
                          <Badge variant="outline" className="text-xs">{report.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-14 sm:ml-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
