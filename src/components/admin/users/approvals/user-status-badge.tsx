type UserStatusBadgeProps = {
  status: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusStyles = {
  PENDING_APPROVAL: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
  ACTIVE: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
  SUSPENDED: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
  REJECTED: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function UserStatusBadge({
  status,
  size = 'md',
  className,
}: UserStatusBadgeProps) {
  const style =
    statusStyles[status as keyof typeof statusStyles] ||
    'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase transition-all duration-200 ${style} ${sizeStyles[size]} ${className || ''}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
