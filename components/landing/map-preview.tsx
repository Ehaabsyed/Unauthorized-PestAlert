'use client'

import { motion } from 'framer-motion'
import { MapPin, AlertTriangle, Users, Thermometer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const outbreakPoints = [
  { id: 1, x: 25, y: 30, type: 'critical', label: 'Locust Outbreak' },
  { id: 2, x: 60, y: 45, type: 'warning', label: 'Aphid Detection' },
  { id: 3, x: 40, y: 70, type: 'info', label: 'Monitoring Zone' },
  { id: 4, x: 75, y: 25, type: 'warning', label: 'Blight Risk' },
  { id: 5, x: 15, y: 60, type: 'info', label: 'Healthy Zone' },
]

export function MapPreview() {
  return (
    <section id="map" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            Outbreak Tracking
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Live Outbreak Map
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Track pest outbreaks and weather conditions across your region in real-time with interactive mapping.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-primary/5 via-background to-accent/5">
                  {/* Map Grid */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
                  </div>

                  {/* Simulated Map Regions */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M10,20 Q30,10 50,20 T90,25 L85,75 Q70,80 50,75 T15,80 Z"
                      fill="hsl(var(--primary))"
                      fillOpacity="0.1"
                      stroke="hsl(var(--primary))"
                      strokeWidth="0.2"
                    />
                    <path
                      d="M20,40 Q40,35 55,45 T75,50 L70,65 Q55,70 40,65 T25,60 Z"
                      fill="hsl(var(--accent))"
                      fillOpacity="0.15"
                      stroke="hsl(var(--accent))"
                      strokeWidth="0.2"
                    />
                  </svg>

                  {/* Outbreak Points */}
                  {outbreakPoints.map((point, index) => (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="absolute"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <div className="relative group cursor-pointer">
                        {/* Pulse Effect */}
                        <div
                          className={`absolute -inset-3 rounded-full animate-ping ${
                            point.type === 'critical' ? 'bg-destructive/30' :
                            point.type === 'warning' ? 'bg-warning/30' : 'bg-primary/30'
                          }`}
                        />
                        <div
                          className={`relative w-4 h-4 rounded-full ${
                            point.type === 'critical' ? 'bg-destructive' :
                            point.type === 'warning' ? 'bg-warning' : 'bg-primary'
                          }`}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          {point.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
                    <div className="text-xs font-medium text-foreground mb-2">Legend</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                        Critical Alert
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2.5 h-2.5 rounded-full bg-warning" />
                        Warning
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        Monitoring
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-xs text-muted-foreground">Active Outbreaks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-xs text-muted-foreground">Monitored Zones</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">847</div>
                    <div className="text-xs text-muted-foreground">Nearby Farmers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">28°C</div>
                    <div className="text-xs text-muted-foreground">Avg. Temperature</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Badge variant="outline" className="w-full justify-center py-2 text-muted-foreground">
              Updated 30 sec ago
            </Badge>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
