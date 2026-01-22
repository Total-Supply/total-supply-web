'use client'

import { MotionBox } from '@/src/components/motion/box'
import {
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react'

type OverviewStatsProps = {
  stats: {
    totalUsers: number
    activeUsers: number
    totalOrders: number
    deliveredOrders: number
    totalRevenue: number
    totalServiceRequests: number
    resolvedServiceRequests: number
    openMessages: number
  }
  isLoading: boolean
}

export function OverviewStats({ stats, isLoading }: OverviewStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: UserCheck,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Delivered Orders',
      value: stats.deliveredOrders,
      icon: CheckCircle2,
      color: 'from-teal-500/20 to-teal-600/10 text-teal-400 ring-teal-500/30',
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Total Revenue',
      value: stats.totalRevenue,
      icon: DollarSign,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
      format: formatCurrency,
    },
    {
      label: 'Service Requests',
      value: stats.totalServiceRequests,
      icon: Wrench,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-cyan-500/30',
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Resolved Services',
      value: stats.resolvedServiceRequests,
      icon: CheckCircle2,
      color:
        'from-green-500/20 to-green-600/10 text-green-400 ring-green-500/30',
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Open Messages',
      value: stats.openMessages,
      icon: Clock,
      color:
        'from-orange-500/20 to-orange-600/10 text-orange-400 ring-orange-500/30',
      format: (val: number) => val.toLocaleString(),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
                <div className="mt-1.5 h-7 w-16 animate-pulse rounded bg-muted/50" />
              ) : (
                <p className="mt-1 text-2xl font-bold">
                  {stat.format(stat.value)}
                </p>
              )}
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </MotionBox>
      ))}
    </div>
  )
}
