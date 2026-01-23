'use client'

import {
  CheckCircle2,
  Clock,
  Package,
  Star,
  Timer,
  TrendingUp,
} from 'lucide-react'

import { SalesmanStatsCard } from './salesman-stats-card'

type SalesmanStatsOverviewProps = {
  stats: {
    acceptedToday: number
    pendingCount: number
    completedCount: number
    completionRate: number
    averagePrepMinutes: number
    averageRating: number | null
  }
  isLoading?: boolean
}

export function SalesmanStatsOverview({
  stats,
  isLoading = false,
}: SalesmanStatsOverviewProps) {
  const statCards = [
    {
      label: 'Accepted Today',
      value: stats.acceptedToday,
      icon: CheckCircle2,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
      helper: 'Orders accepted since midnight',
    },
    {
      label: 'Pending Queue',
      value: stats.pendingCount,
      icon: Clock,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
      helper: 'Orders awaiting action',
    },
    {
      label: 'Completed',
      value: stats.completedCount,
      icon: Package,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
      helper: 'Delivered orders',
    },
    {
      label: 'Success Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
      helper: 'Delivered vs accepted',
    },
    {
      label: 'Avg Prep Time',
      value: `${stats.averagePrepMinutes}m`,
      icon: Timer,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-cyan-500/30',
      helper: 'Average preparation time',
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
        <SalesmanStatsCard
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
