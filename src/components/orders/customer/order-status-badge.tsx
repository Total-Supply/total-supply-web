import { AlertCircle, CheckCircle2, Clock, Package, Truck } from 'lucide-react'

type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED'

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color:
      'bg-amber-500/20 text-amber-700 dark:text-amber-400 ring-amber-500/40',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 ring-blue-500/40',
    icon: CheckCircle2,
  },
  PREPARING: {
    label: 'Preparing',
    color:
      'bg-purple-500/20 text-purple-700 dark:text-purple-400 ring-purple-500/40',
    icon: Package,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 ring-cyan-500/40',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    color:
      'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 ring-emerald-500/40',
    icon: CheckCircle2,
  },
  CANCELED: {
    label: 'Canceled',
    color: 'bg-red-500/20 text-red-700 dark:text-red-400 ring-red-500/40',
    icon: AlertCircle,
  },
}

type OrderStatusBadgeProps = {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status as OrderStatus] || STATUS_CONFIG.PENDING

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

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide ring-1 transition-all duration-200 ${config.color} ${sizeStyles[size]}`}
    >
      {showIcon && <config.icon className={iconSizes[size]} />}
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
export type { OrderStatus }
