'use client'

import { AlertCircle, TrendingUp, Users, Leaf } from 'lucide-react'

export function StatsCard({ icon: Icon, label, value, change, color = 'primary' }: {
  icon: any
  label: string
  value: string | number
  change?: string
  color?: string
}) {
  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            {change}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

export function AlertCard({ severity = 'warning', title, description, action }: {
  severity?: 'warning' | 'critical' | 'info'
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}) {
  const severityColors = {
    critical: 'border-red-500/50 bg-red-500/5',
    warning: 'border-yellow-500/50 bg-yellow-500/5',
    info: 'border-blue-500/50 bg-blue-500/5',
  }

  const severityIcons = {
    critical: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  }

  return (
    <div className={`border rounded-lg p-4 backdrop-blur-sm ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        {severityIcons[severity]}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 text-sm font-medium text-primary hover:text-primary/80"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export function MiniChart({ data, color = 'primary' }: {
  data: number[]
  color?: string
}) {
  const max = Math.max(...data)
  const height = 60

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t"
          style={{ height: `${(value / max) * height}px`, opacity: 0.4 + (value / max) * 0.6 }}
        />
      ))}
    </div>
  )
}

export function DataTable({ columns, data, actions }: {
  columns: { key: string; label: string }[]
  data: any[]
  actions?: (item: any) => React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-sm text-foreground">
                  {row[col.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-sm">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
