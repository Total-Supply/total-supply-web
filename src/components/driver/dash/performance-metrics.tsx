'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Award, Clock, Star, TrendingUp } from 'lucide-react'

type PerformanceMetricsProps = {
  averageDeliveryMinutes: number
  averageRating: number | null
  completionRate: number
  isLoading?: boolean
}

export function PerformanceMetrics({
  averageDeliveryMinutes,
  averageRating,
  completionRate,
  isLoading = false,
}: PerformanceMetricsProps) {
  const metrics = [
    {
      label: 'Avg Delivery Time',
      value: `${averageDeliveryMinutes} min`,
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      label: 'Average Rating',
      value: averageRating ? averageRating.toFixed(1) : 'No ratings',
      icon: Star,
      color: 'text-yellow-400',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
  ]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
          <Award className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Performance</h3>
          <p className="text-sm text-muted-foreground">Key metrics overview</p>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="flex items-center justify-between rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 transition-all duration-200 hover:border-border hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </span>
            </div>
            {isLoading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted/50" />
            ) : (
              <span className="text-sm font-bold tabular-nums">
                {metric.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </MotionBox>
  )
}
