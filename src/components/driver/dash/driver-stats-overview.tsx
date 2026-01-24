'use client'

import {
  CheckCircle2,
  Clock,
  Package,
  Star,
  TrendingUp,
  Truck,
} from 'lucide-react'

import { DriverStatsCard } from './driver-stats-card'

type DriverStatsOverviewProps = {
  stats: {
    deliveriesToday: number
    pendingCount: number
    completedCount: number
    completionRate: number
    averageDeliveryMinutes: number
    averageRating: number | null
  }
  isLoading?: boolean
}

export function DriverStatsOverview({
  stats,
  isLoading = false,
}: DriverStatsOverviewProps) {
  const statCards = [
    {
      label: 'Deliveries Today',
      value: stats.deliveriesToday,
      icon: Truck,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
      helper: 'Out for delivery since midnight',
    },
    {
      label: 'Pending',
      value: stats.pendingCount,
      icon: Clock,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
      helper: 'Orders awaiting handoff',
    },
    {
      label: 'Completed',
      value: stats.completedCount,
      icon: CheckCircle2,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
      helper: 'Successfully delivered',
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
      label: 'Avg Delivery',
      value: `${stats.averageDeliveryMinutes}m`,
      icon: Package,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-cyan-500/30',
      helper: 'Average delivery time',
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
        <DriverStatsCard
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
