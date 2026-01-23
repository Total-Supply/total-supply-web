'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Package, ShoppingCart, Users, Wrench } from 'lucide-react'

type LandingStatsProps = {
  stats: {
    totalOrders: number
    activeCustomers: number
    totalProducts: number
    servicesAvailable: number
  } | null
}

export function LandingStats({ stats }: LandingStatsProps) {
  const statCards = [
    {
      icon: ShoppingCart,
      value: stats?.totalOrders || 0,
      label: 'Orders Completed',
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      icon: Users,
      value: stats?.activeCustomers || 0,
      label: 'Happy Customers',
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      icon: Package,
      value: stats?.totalProducts || 0,
      label: 'Products Available',
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
    {
      icon: Wrench,
      value: stats?.servicesAvailable || 0,
      label: 'Services Offered',
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
    },
  ]

  return (
    <div className="border-y border-border bg-muted/20 py-16 px-8 sm:px-10 lg:px-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
                >
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold tabular-nums sm:text-4xl">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </MotionBox>
          ))}
        </div>
      </div>
    </div>
  )
}
