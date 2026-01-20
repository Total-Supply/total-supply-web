'use client'

import { MotionBox } from '@/src/components/motion/box'
import { PieChart } from 'lucide-react'

import { useMemo } from 'react'

type OrdersDistributionProps = {
  data: Array<{ status: string; count: number }>
  isLoading: boolean
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500',
  ACCEPTED: 'bg-blue-500',
  PREPARING: 'bg-purple-500',
  OUT_FOR_DELIVERY: 'bg-cyan-500',
  DELIVERED: 'bg-emerald-500',
  CANCELED: 'bg-red-500',
}

export function OrdersDistribution({
  data,
  isLoading,
}: OrdersDistributionProps) {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0)
  }, [data])

  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
          <PieChart className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Orders by Status</h3>
          <p className="text-sm text-muted-foreground">
            Distribution breakdown
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted/50" />
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No order data available
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">
                  {item.status.replace(/_/g, ' ').toLowerCase()}
                </span>
                <span className="text-muted-foreground">
                  {item.count} ({getPercentage(item.count)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-500 ${
                    statusColors[item.status] || 'bg-slate-500'
                  }`}
                  style={{ width: `${getPercentage(item.count)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </MotionBox>
  )
}
