import { cn } from '@/src/lib/utils'

type StatusBadgeProps = {
  isActive: boolean
  activeLabel?: string
  inactiveLabel?: string
  className?: string
}

export function StatusBadge({
  isActive,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200',
        isActive
          ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
          : 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
        className,
      )}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  )
}
