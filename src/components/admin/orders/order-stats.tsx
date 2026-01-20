'use client'

import { MotionBox } from '@/src/components/motion/box'
import { CheckCircle2, Clock, ShoppingCart, Truck } from 'lucide-react'

type OrderStatsProps = {
  stats: {
    total: number
    pending: number
    delivering: number
    delivered: number
  }
  isLoading: boolean
}

export function OrderStats({ stats, isLoading }: OrderStatsProps) {
  const statCards = [
    {
      label: 'Total Orders',
      value: stats.total,
      icon: ShoppingCart,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
    },
    {
      label: 'Out for Delivery',
      value: stats.delivering,
      icon: Truck,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-cyan-500/30',
    },
    {
      label: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle2,
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <MotionBox
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="group relative overflow-hidden rounded-lg border border-border/60 bg-gradient-to-br from-card/80 to-card/40 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              {isLoading ? (
                <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted/50" />
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
