import { CheckCircle2, Clock, Package, PlayCircle, XCircle } from 'lucide-react'

type ServiceStatusBadgeProps = {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const STATUS_CONFIG = {
  RECEIVED: {
    style: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
    icon: Package,
    label: 'Received',
  },
  ASSIGNED: {
    style: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
    icon: Clock,
    label: 'Assigned',
  },
  IN_PROGRESS: {
    style: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40',
    icon: PlayCircle,
    label: 'In Progress',
  },
  RESOLVED: {
    style: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
    icon: CheckCircle2,
    label: 'Completed',
  },
  CANCELED: {
    style: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
    icon: XCircle,
    label: 'Canceled',
  },
}

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

const ICON_SIZES = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

export function ServiceStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: ServiceStatusBadgeProps) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.RECEIVED
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase transition-all duration-200 ${config.style} ${SIZE_STYLES[size]}`}
    >
      {showIcon && <Icon className={ICON_SIZES[size]} />}
      {config.label}
    </span>
  )
}
