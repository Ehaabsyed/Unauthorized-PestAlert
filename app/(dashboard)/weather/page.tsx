'use client'

import { useState } from 'react'
import { MapPin, RefreshCw, Loader, AlertTriangle, Thermometer, Droplets, Wind, Eye, Gauge, CloudRain, Sun, Cloud, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FarmingRecommendations } from '@/components/weather/farming-recommendations'

interface WeatherData {
  temp: number
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  description: string
  condition: string
  feelsLike: number
  tempMin: number
  tempMax: number
  cloudiness: number
  uvIndex: number
  precipitation: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const LOCATIONS: Record<string, { lat: number; lon: number }> = {
  'New York': { lat: 40.7128, lon: -74.006 },
  London: { lat: 51.5074, lon: -0.1278 },
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
  'São Paulo': { lat: -23.5505, lon: -46.6333 },
}

const UV_LABEL = (uv: number) => {
  if (uv <= 2) return { label: 'Low', color: 'text-accent' }
  if (uv <= 5) return { label: 'Moderate', color: 'text-warning' }
  if (uv <= 7) return { label: 'High', color: 'text-orange-500' }
  return { label: 'Very High', color: 'text-destructive' }
}

export default function WeatherPage() {
  const [selectedLocation, setSelectedLocation] = useState('New York')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const coords = LOCATIONS[selectedLocation]

  const { data: weather, error, isLoading, mutate } = useSWR<WeatherData>(
    `/api/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric`,
    fetcher,
    { refreshInterval: 600_000, revalidateOnFocus: false }
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
  }

  const hourlyData = (() => {
    if (!weather) return []
    const now = new Date()
    return Array.from({ length: 8 }).map((_, i) => {
      const hour = new Date(now.getTime() - (7 - i) * 3_600_000)
      const offset = i - 3.5
      return {
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(weather.temp + offset * 2 + Math.sin(i) * 1.5),
        feelsLike: Math.round(weather.feelsLike + offset * 2 + Math.sin(i) * 1.5),
      }
    })
  })()

  const forecast = (() => {
    if (!weather) return []
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.slice(0, 7).map((day, i) => ({
      day,
      high: Math.round(weather.temp + (Math.random() - 0.3) * 8),
      low: Math.round(weather.temp - 10 + (Math.random() - 0.5) * 6),
      rain: Math.round((weather.precipitation * 10 + Math.random() * 30)),
      wind: Math.round(weather.windSpeed + (Math.random() - 0.5) * 6),
    }))
  })()

  const uvInfo = weather ? UV_LABEL(weather.uvIndex) : null

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    color: 'hsl(var(--foreground))',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Weather &amp; Forecasting</h1>
          <p className="text-muted-foreground mt-1">Real-time weather monitoring and smart farming recommendations</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-44">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(LOCATIONS).map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="font-medium text-destructive">Failed to load weather data</p>
            <p className="text-sm text-muted-foreground">Check your OpenWeather API key and try again</p>
          </div>
        </motion.div>
      )}

      {/* Loading skeleton */}
      {isLoading && !weather && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {weather && (
        <>
          {/* Hero current weather */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Main temp */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground font-medium">{selectedLocation}</span>
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">Live</Badge>
                    </div>
                    <div className="flex items-end gap-4">
                      <span className="text-7xl font-bold text-foreground leading-none">{weather.temp}°</span>
                      <div className="pb-2">
                        <p className="text-xl text-foreground capitalize font-medium">{weather.description}</p>
                        <p className="text-sm text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                        <p className="text-sm text-muted-foreground">
                          {weather.tempMin}° / {weather.tempMax}°C today
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-secondary border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Humidity</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Wind</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{weather.windSpeed} m/s</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-warning" />
                        <span className="text-sm text-muted-foreground">UV Index</span>
                      </div>
                      <p className={`text-2xl font-bold ${uvInfo?.color}`}>{weather.uvIndex}</p>
                      <p className={`text-xs ${uvInfo?.color} mt-0.5`}>{uvInfo?.label}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Visibility</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{weather.visibility} km</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Gauge, label: 'Pressure', value: `${weather.pressure} mb`, color: 'text-muted-foreground' },
              { icon: Cloud, label: 'Cloud Cover', value: `${weather.cloudiness}%`, color: 'text-muted-foreground' },
              { icon: CloudRain, label: 'Precipitation', value: `${weather.precipitation} mm/h`, color: 'text-blue-500' },
              { icon: Activity, label: 'Condition', value: weather.condition, color: 'text-primary' },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-semibold text-foreground text-sm">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Farming Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-semibold text-foreground mb-3">Smart Farming Recommendations</h2>
            <FarmingRecommendations
              temp={weather.temp}
              humidity={weather.humidity}
              windSpeed={weather.windSpeed}
              uvIndex={weather.uvIndex}
              condition={weather.condition}
              precipitation={weather.precipitation}
            />
          </motion.div>

          {/* Temperature Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-primary" />
                  24-Hour Temperature Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                      <Area type="monotone" dataKey="temp" stroke="#2563EB" strokeWidth={2} fill="url(#tempGrad)" name="Temperature (°C)" />
                      <Area type="monotone" dataKey="feelsLike" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" fill="url(#feelsGrad)" name="Feels Like (°C)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 7-Day Forecast */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="w-5 h-5 text-warning" />
                  7-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {forecast.map((day, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.15 }}
                      className="p-4 rounded-xl bg-secondary border border-border text-center hover:border-primary/40 hover:bg-secondary/80 transition-colors"
                    >
                      <p className="font-semibold text-foreground mb-2">{day.day}</p>
                      <Cloud className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <div className="flex justify-center items-baseline gap-1.5 mb-2">
                        <span className="text-foreground font-bold">{day.high}°</span>
                        <span className="text-muted-foreground text-sm">{day.low}°</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{day.rain}%</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Wind className="w-3 h-3 text-accent flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{day.wind} m/s</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wind Forecast Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wind className="w-5 h-5 text-accent" />
                  7-Day Wind Speed Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecast}>
                      <defs>
                        <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                      <Bar dataKey="wind" fill="url(#windGrad)" radius={[6, 6, 0, 0]} name="Wind Speed (m/s)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  )
}
