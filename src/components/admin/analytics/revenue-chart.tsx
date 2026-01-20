'use client'

import { MotionBox } from '@/src/components/motion/box'
import { TrendingUp } from 'lucide-react'

import { useMemo } from 'react'

type RevenueChartProps = {
  data: Array<{ date: string; revenue: number; orders: number }>
  isLoading: boolean
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const maxRevenue = useMemo(() => {
    return Math.max(...data.map((d) => d.revenue), 1)
  }, [data])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted/50" />
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No revenue data available
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex h-64 items-end justify-between gap-1">
            {data.map((item, index) => (
              <div
                key={index}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-300 hover:from-emerald-400 hover:to-emerald-300"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <div className="invisible absolute -top-16 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card p-2 shadow-lg group-hover:visible">
                      <p className="text-xs font-semibold">
                        {formatDate(item.date)}
                      </p>
                      <p className="text-xs text-emerald-400">
                        {formatCurrency(item.revenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.orders} orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatDate(data[0]?.date || '')}</span>
            <span>{formatDate(data[data.length - 1]?.date || '')}</span>
          </div>
        </div>
      )}
    </MotionBox>
  )
}
