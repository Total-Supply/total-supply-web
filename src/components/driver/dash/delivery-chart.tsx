'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Calendar, TrendingUp } from 'lucide-react'

import { useMemo } from 'react'

type DeliveryChartProps = {
  data: Array<{ date: string; count: number }>
  isLoading?: boolean
}

export function DeliveryChart({ data, isLoading = false }: DeliveryChartProps) {
  const maxCount = useMemo(() => {
    if (!data?.length) return 1
    return Math.max(...data.map((d) => d.count), 1)
  }, [data])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const totalDeliveries = useMemo(() => {
    return data?.reduce((sum, item) => sum + item.count, 0) || 0
  }, [data])

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Weekly Performance</h3>
            <p className="text-sm text-muted-foreground">
              Deliveries completed this week
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{totalDeliveries}</p>
          <p className="text-xs text-muted-foreground">Total deliveries</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted/50" />
      ) : data?.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20">
          <div className="text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No delivery data yet
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex h-48 items-end justify-between gap-2">
            {data?.map((item, index) => (
              <div
                key={index}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-300 hover:from-blue-400 hover:to-blue-300"
                    style={{
                      height: `${(item.count / maxCount) * 100}%`,
                      minHeight: item.count > 0 ? '8px' : '0',
                    }}
                  >
                    <div className="invisible absolute -top-14 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card p-2 shadow-lg group-hover:visible z-10">
                      <p className="text-xs font-semibold">
                        {formatDate(item.date)}
                      </p>
                      <p className="text-sm font-bold text-blue-400">
                        {item.count} deliveries
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {formatDate(item.date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </MotionBox>
  )
}
