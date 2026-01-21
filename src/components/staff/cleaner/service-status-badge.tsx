import { CheckCircle2, Clock, Package, PlayCircle, XCircle } from 'lucide-react'

type ServiceStatusBadgeProps = {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const statusConfig = {
  RECEIVED: {
    style: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
    icon: Package,
  },
  ASSIGNED: {
    style: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
    icon: Clock,
  },
  IN_PROGRESS: {
    style: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40',
    icon: PlayCircle,
  },
  RESOLVED: {
    style: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
    icon: CheckCircle2,
  },
  CANCELED: {
    style: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
    icon: XCircle,
  },
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

export function ServiceStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: ServiceStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    style: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
    icon: Clock,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase transition-all duration-200 ${config.style} ${sizeStyles[size]} ${className || ''}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {status.replace(/_/g, ' ')}
    </span>
  )
}
