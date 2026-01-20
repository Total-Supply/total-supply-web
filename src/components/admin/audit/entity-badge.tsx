import {
  CreditCard,
  FileText,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react'

type EntityBadgeProps = {
  entityType: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const entityConfig = {
  USER: {
    style: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
    icon: User,
  },
  ORDER: {
    style: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40',
    icon: ShoppingBag,
  },
  PRODUCT: {
    style: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
    icon: Package,
  },
  SERVICE: {
    style: 'bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/40',
    icon: FileText,
  },
  PAYMENT: {
    style: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
    icon: CreditCard,
  },
  DELIVERY: {
    style: 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40',
    icon: Truck,
  },
  SETTINGS: {
    style: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/40',
    icon: Settings,
  },
  SECURITY: {
    style: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
    icon: Shield,
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

export function EntityBadge({
  entityType,
  size = 'md',
  showIcon = true,
  className,
}: EntityBadgeProps) {
  const config = entityConfig[entityType as keyof typeof entityConfig] || {
    style: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
    icon: FileText,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase transition-all duration-200 ${config.style} ${sizeStyles[size]} ${className || ''}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {entityType}
    </span>
  )
}
