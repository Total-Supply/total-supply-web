type OrderStatusBadgeProps = {
  status: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusStyles = {
  PENDING: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
  ACCEPTED: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
  PREPARING: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40',
  OUT_FOR_DELIVERY: 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
  CANCELED: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function OrderStatusBadge({
  status,
  size = 'md',
  className,
}: OrderStatusBadgeProps) {
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
