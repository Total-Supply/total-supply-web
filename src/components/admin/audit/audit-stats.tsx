'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Activity, Edit, Eye, Plus, Trash2 } from 'lucide-react'

type AuditStatsProps = {
  stats: {
    total: number
    creates: number
    updates: number
    deletes: number
    views: number
  }
  isLoading: boolean
}

export function AuditStats({ stats, isLoading }: AuditStatsProps) {
  const statCards = [
    {
      label: 'Total Actions',
      value: stats.total,
      icon: Activity,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      label: 'Creates',
      value: stats.creates,
      icon: Plus,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      label: 'Updates',
      value: stats.updates,
      icon: Edit,
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
    {
      label: 'Deletes',
      value: stats.deletes,
      icon: Trash2,
      color: 'from-red-500/20 to-red-600/10 text-red-400 ring-red-500/30',
    },
    {
      label: 'Views',
      value: stats.views,
      icon: Eye,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {statCards.map((stat, index) => (
        <MotionBox
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              {isLoading ? (
                <div className="mt-1.5 h-7 w-12 animate-pulse rounded bg-muted/50" />
              ) : (
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              )}
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </MotionBox>
      ))}
    </div>
  )
}
