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
    <div className="border-y border-border bg-muted/20 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
                  className={`mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
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
