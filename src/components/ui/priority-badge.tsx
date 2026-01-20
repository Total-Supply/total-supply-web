type PriorityBadgeProps = {
  priority: string
  className?: string
}

const priorityStyles = {
  URGENT: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
  HIGH: 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40',
  LOW: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const style =
    priorityStyles[priority as keyof typeof priorityStyles] ||
    'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${style} ${className || ''}`}
    >
      {priority}
    </span>
  )
}
