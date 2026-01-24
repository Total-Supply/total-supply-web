'use client'

import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
} from 'lucide-react'

import { CleanerStatsCard } from './cleaner-stats-card'

type CleanerStatsOverviewProps = {
  stats: {
    completedToday: number
    pendingCount: number
    completedMonth: number
    completionRate: number
    averageRating: number | null
    ratingCount: number
  }
  isLoading?: boolean
}

export function CleanerStatsOverview({
  stats,
  isLoading = false,
}: CleanerStatsOverviewProps) {
  const statCards = [
    {
      label: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle2,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      label: 'Pending',
      value: stats.pendingCount,
      icon: Clock,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
    },
    {
      label: 'This Month',
      value: stats.completedMonth,
      icon: Calendar,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      label: 'Success Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
    {
      label: 'Average Rating',
      value: stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A',
      icon: Star,
      color:
        'from-yellow-500/20 to-yellow-600/10 text-yellow-400 ring-yellow-500/30',
    },
    {
      label: 'Total Reviews',
      value: stats.ratingCount,
      icon: Award,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-cyan-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      {statCards.map((stat, index) => (
        <CleanerStatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          isLoading={isLoading}
          delay={index * 0.05}
        />
      ))}
    </div>
  )
}
