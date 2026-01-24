import { AlertCircle, AlertTriangle, Circle, Info } from 'lucide-react'

type ServicePriorityBadgeProps = {
  priority: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const priorityConfig = {
  URGENT: {
    style: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
    icon: AlertCircle,
  },
  HIGH: {
    style: 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40',
    icon: AlertTriangle,
  },
  MEDIUM: {
    style: 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40',
    icon: Info,
  },
  LOW: {
    style: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
    icon: Circle,
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

export function ServicePriorityBadge({
  priority,
  size = 'md',
  showIcon = true,
  className,
}: ServicePriorityBadgeProps) {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || {
    style: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
    icon: Circle,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase transition-all duration-200 ${config.style} ${sizeStyles[size]} ${className || ''}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {priority}
    </span>
  )
}
