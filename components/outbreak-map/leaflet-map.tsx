'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface OutbreakMarker {
  id: number
  name: string
  lat: number
  lng: number
  severity: 'critical' | 'high' | 'medium' | 'warning' | 'low'
  type: string
  affected: number
}

export interface FarmerMarker {
  id: number
  name: string
  lat: number
  lng: number
}

interface LeafletMapProps {
  outbreaks: OutbreakMarker[]
  farmers: FarmerMarker[]
  showFarmers: boolean
  onSelectOutbreak: (outbreak: OutbreakMarker) => void
}

const severityColor = (severity: OutbreakMarker['severity']) => {
  switch (severity) {
    case 'critical': return '#ef4444'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'warning': return '#f59e0b'
    case 'low': return '#22c55e'
    default: return '#6b7280'
  }
}

function createOutbreakIcon(severity: OutbreakMarker['severity'], pulse: boolean) {
  const color = severityColor(severity)
  const size = severity === 'critical' ? 20 : severity === 'high' ? 16 : 14
  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;">
      ${pulse ? `<div style="
        position:absolute;inset:-6px;border-radius:50%;
        background:${color}33;
        animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      "></div>` : ''}
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};border:2.5px solid white;
        box-shadow:0 2px 8px ${color}88;
        position:relative;z-index:1;
      "></div>
    </div>
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [size + 12, size + 12],
    iconAnchor: [(size + 12) / 2, (size + 12) / 2],
    popupAnchor: [0, -(size + 12) / 2],
  })
}

function createFarmerIcon() {
  const html = `
    <div style="
      width:12px;height:12px;border-radius:50%;
      background:#4ade80;border:2px solid white;
      box-shadow:0 2px 6px rgba(74,222,128,0.6);
    "></div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  })
}

export function LeafletMap({ outbreaks, farmers, showFarmers, onSelectOutbreak }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const farmerMarkersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update outbreak markers
  useEffect(() => {
    if (!mapRef.current) return
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    outbreaks.forEach((outbreak) => {
      const pulse = outbreak.severity === 'critical' || outbreak.severity === 'high'
      const marker = L.marker([outbreak.lat, outbreak.lng], {
        icon: createOutbreakIcon(outbreak.severity, pulse),
      })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="font-family:system-ui;min-width:160px">
            <strong style="font-size:13px">${outbreak.name}</strong><br/>
            <span style="font-size:11px;color:#6b7280">Type: ${outbreak.type} · ${outbreak.affected} acres</span><br/>
            <span style="font-size:11px;color:${severityColor(outbreak.severity)};font-weight:600;text-transform:uppercase">${outbreak.severity}</span>
          </div>`,
          { maxWidth: 200 }
        )
        .on('click', () => onSelectOutbreak(outbreak))

      markersRef.current.push(marker)
    })
  }, [outbreaks, onSelectOutbreak])

  // Update farmer markers
  useEffect(() => {
    if (!mapRef.current) return
    farmerMarkersRef.current.forEach((m) => m.remove())
    farmerMarkersRef.current = []

    if (!showFarmers) return

    farmers.forEach((farmer) => {
      const marker = L.marker([farmer.lat, farmer.lng], {
        icon: createFarmerIcon(),
      })
        .addTo(mapRef.current!)
        .bindPopup(`<div style="font-family:system-ui;font-size:12px"><strong>${farmer.name}</strong></div>`)

      farmerMarkersRef.current.push(marker)
    })
  }, [farmers, showFarmers])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: 500 }}
    />
  )
}
