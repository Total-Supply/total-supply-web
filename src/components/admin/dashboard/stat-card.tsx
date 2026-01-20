'use client'

import { MotionBox } from '@/src/components/motion/box'
import { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  helper: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'amber'
  index: number
  isLoading?: boolean
}

const colorStyles = {
  blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
  green:
    'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
  purple:
    'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
  amber: 'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
}

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  color,
  index,
  isLoading = false,
}: StatCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          {isLoading ? (
            <div className="mt-3 h-10 w-24 animate-pulse rounded bg-muted/50" />
          ) : (
            <p className="mt-2 text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {value}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${colorStyles[color]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </MotionBox>
  )
}
