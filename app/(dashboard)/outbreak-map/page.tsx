'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MapPin,
  AlertTriangle,
  Bug,
  Cloud,
  Users,
  Filter,
  RefreshCw,
  Navigation,
} from 'lucide-react'
import type { OutbreakMarker, FarmerMarker } from '@/components/outbreak-map/leaflet-map'
import { useAuth } from '@/lib/supabase/auth-context'

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(
  () => import('@/components/outbreak-map/leaflet-map').then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-secondary/30 rounded-lg">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
)

const outbreakData: OutbreakMarker[] = [
  { id: 1, name: 'Locust Swarm', lat: 15.55, lng: 32.53, severity: 'critical', type: 'pest', affected: 150 },
  { id: 2, name: 'Aphid Colony', lat: 28.7, lng: 77.1, severity: 'high', type: 'pest', affected: 45 },
  { id: 3, name: 'Fungal Blight', lat: -1.28, lng: 36.82, severity: 'medium', type: 'disease', affected: 30 },
  { id: 4, name: 'Root Rot', lat: 9.03, lng: 38.74, severity: 'warning', type: 'disease', affected: 20 },
  { id: 5, name: 'Whitefly', lat: 6.37, lng: 2.39, severity: 'low', type: 'pest', affected: 10 },
  { id: 6, name: 'Storm Damage', lat: 14.69, lng: -17.44, severity: 'warning', type: 'weather', affected: 80 },
]

const farmerData: FarmerMarker[] = [
  { id: 1, name: 'John Farm', lat: 5.56, lng: -0.2 },
  { id: 2, name: 'Green Acres', lat: 31.21, lng: 29.92 },
  { id: 3, name: 'Sunrise Fields', lat: -25.74, lng: 28.19 },
  { id: 4, name: 'Valley Ranch', lat: 12.37, lng: -1.53 },
  { id: 5, name: 'Mountain View', lat: 4.04, lng: 9.7 },
]

const getSeverityBadge = (severity: OutbreakMarker['severity']) => {
  switch (severity) {
    case 'critical': return 'bg-destructive text-destructive-foreground'
    case 'high': return 'bg-orange-500 text-white'
    case 'medium': return 'bg-yellow-500 text-black'
    case 'warning': return 'bg-warning text-warning-foreground'
    case 'low': return 'bg-primary text-primary-foreground'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function OutbreakMapPage() {
  const { user } = useAuth()
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakMarker | null>(null)
  const [showFarmers, setShowFarmers] = useState(true)
  const [showWeather, setShowWeather] = useState(false)
  const [filterType, setFilterType] = useState('all')

  const filteredOutbreaks = outbreakData.filter(
    (o) => filterType === 'all' || o.type === filterType
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Outbreak Map</h1>
          <p className="text-muted-foreground">Real-time pest and disease outbreak tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3"
        >
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px] md:h-[600px] relative">
                <LeafletMap
                  outbreaks={filteredOutbreaks}
                  farmers={farmerData}
                  showFarmers={showFarmers}
                  onSelectOutbreak={setSelectedOutbreak}
                />

                {/* Legend overlay */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Legend</h4>
                  <div className="space-y-2">
                    {[
                      { color: 'bg-destructive', label: 'Critical' },
                      { color: 'bg-orange-500', label: 'High Risk' },
                      { color: 'bg-warning', label: 'Warning' },
                      { color: 'bg-primary', label: 'Low Risk' },
                      { color: 'bg-accent', label: 'Farmers' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Filters */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Outbreak Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pest">Pest Outbreaks</SelectItem>
                    <SelectItem value="disease">Diseases</SelectItem>
                    <SelectItem value="weather">Weather Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="farmers" className="text-sm">Show Farmers</Label>
                <Switch id="farmers" checked={showFarmers} onCheckedChange={setShowFarmers} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weather" className="text-sm">Weather Overlay</Label>
                <Switch id="weather" checked={showWeather} onCheckedChange={setShowWeather} />
              </div>
            </CardContent>
          </Card>

          {/* Selected Outbreak */}
          {selectedOutbreak ? (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Outbreak Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{selectedOutbreak.name}</h4>
                  <Badge className={getSeverityBadge(selectedOutbreak.severity)}>
                    {selectedOutbreak.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium text-foreground capitalize">{selectedOutbreak.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Affected Area</p>
                    <p className="font-medium text-foreground">{selectedOutbreak.affected} acres</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Latitude</p>
                    <p className="font-medium text-foreground">{selectedOutbreak.lat.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Longitude</p>
                    <p className="font-medium text-foreground">{selectedOutbreak.lng.toFixed(2)}</p>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click on a map marker to view outbreak details</p>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: AlertTriangle, color: 'text-destructive', label: 'Active Outbreaks', value: outbreakData.length },
                { icon: Bug, color: 'text-warning', label: 'Pest Events', value: outbreakData.filter(o => o.type === 'pest').length },
                { icon: Users, color: 'text-accent', label: 'Nearby Farmers', value: farmerData.length },
                { icon: MapPin, color: 'text-primary', label: 'Total Affected', value: `${outbreakData.reduce((a, o) => a + o.affected, 0)} acres` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
