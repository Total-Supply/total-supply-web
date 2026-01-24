'use client'

import {
  CheckCircle2,
  Clock,
  Package,
  Star,
  Timer,
  TrendingUp,
} from 'lucide-react'

import { ITStatsCard } from './it-stats-card'

type ITStatsOverviewProps = {
  stats: {
    acceptedToday: number
    inProgressCount: number
    resolvedCount: number
    completionRate: number
    averageDiagnosisMinutes: number
    averageRating: number | null
  }
  isLoading?: boolean
}

export function ITStatsOverview({
  stats,
  isLoading = false,
}: ITStatsOverviewProps) {
  const statCards = [
    {
      label: 'Accepted Today',
      value: stats.acceptedToday,
      icon: Package,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
      helper: 'Assignments accepted today',
    },
    {
      label: 'In Progress',
      value: stats.inProgressCount,
      icon: Clock,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
      helper: 'Active IT tickets',
    },
    {
      label: 'Resolved',
      value: stats.resolvedCount,
      icon: CheckCircle2,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
      helper: 'Tickets completed',
    },
    {
      label: 'Success Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
      helper: 'Resolved vs assigned',
    },
    {
      label: 'Avg Diagnosis',
      value: `${stats.averageDiagnosisMinutes}m`,
      icon: Timer,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-cyan-500/30',
      helper: 'Average diagnosis time',
    },
    {
      label: 'Rating',
      value: stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A',
      icon: Star,
      color:
        'from-yellow-500/20 to-yellow-600/10 text-yellow-400 ring-yellow-500/30',
      helper: 'Customer satisfaction',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      {statCards.map((stat, index) => (
        <ITStatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          helper={stat.helper}
          isLoading={isLoading}
          delay={index * 0.05}
        />
      ))}
    </div>
  )
}
