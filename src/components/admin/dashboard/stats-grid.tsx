'use client'

import { Briefcase, ShoppingCart, Users } from 'lucide-react'

import { StatCard } from './stat-card'

type StatsData = {
  totalUsers: number
  totalOrders: number
  totalServices: number
}

type StatsGridProps = {
  stats: StatsData
  isLoading: boolean
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const statCards = [
    {
      label: 'Total Users',
      helper: 'Active users in system',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'blue' as const,
    },
    {
      label: 'Total Orders',
      helper: 'Orders processed',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'green' as const,
    },
    {
      label: 'Total Services',
      helper: 'Services in catalog',
      value: stats.totalServices.toLocaleString(),
      icon: Briefcase,
      color: 'purple' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.label}
          {...stat}
          index={index}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
