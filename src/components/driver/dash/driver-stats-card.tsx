'use client'

import { MotionBox } from '@/src/components/motion/box'
import { LucideIcon } from 'lucide-react'

type DriverStatsCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  helper?: string
  isLoading?: boolean
  delay?: number
}

export function DriverStatsCard({
  label,
  value,
  icon: Icon,
  color,
  helper,
  isLoading = false,
  delay = 0,
}: DriverStatsCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
            {label}
          </p>
          {isLoading ? (
            <div className="mt-1.5 h-8 w-16 animate-pulse rounded bg-muted/50" />
          ) : (
            <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          )}
          {helper && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {helper}
            </p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </MotionBox>
  )
}
