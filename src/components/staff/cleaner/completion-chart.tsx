'use client'

import { MotionBox } from '@/src/components/motion/box'
import { TrendingUp } from 'lucide-react'

import { useMemo } from 'react'

type CompletionChartProps = {
  data: Array<{ date: string; count: number }>
  isLoading: boolean
}

export function CompletionChart({ data, isLoading }: CompletionChartProps) {
  const maxCount = useMemo(() => {
    return Math.max(...data.map((d) => d.count), 1)
  }, [data])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Weekly Performance</h3>
          <p className="text-sm text-muted-foreground">
            Services completed this week
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted/50" />
      ) : (
        <div className="space-y-4">
          <div className="flex h-48 items-end justify-between gap-2">
            {data.map((item, index) => (
              <div
                key={index}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-300 hover:from-emerald-400 hover:to-emerald-300"
                    style={{
                      height: `${(item.count / maxCount) * 100}%`,
                      minHeight: item.count > 0 ? '8px' : '0',
                    }}
                  >
                    <div className="invisible absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card p-2 shadow-lg group-hover:visible z-10">
                      <p className="text-xs font-semibold">
                        {formatDate(item.date)}
                      </p>
                      <p className="text-sm font-bold text-emerald-400">
                        {item.count}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
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
