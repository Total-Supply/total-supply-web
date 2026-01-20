type ServiceStatusBadgeProps = {
  status: string
  className?: string
}

const statusStyles = {
  RECEIVED: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
  ASSIGNED: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40',
  IN_PROGRESS: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
  RESOLVED: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
  CANCELLED: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
}

export function ServiceStatusBadge({
  status,
  className,
}: ServiceStatusBadgeProps) {
  const style =
    statusStyles[status as keyof typeof statusStyles] ||
    'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-all duration-200 ${style} ${className || ''}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
