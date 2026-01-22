import { Crown, Shield, User, Users } from 'lucide-react'

type UserRoleBadgeProps = {
  role: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const roleConfig = {
  ADMIN: {
    style: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40',
    icon: Crown,
  },
  MANAGER: {
    style: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40',
    icon: Shield,
  },
  STAFF: {
    style: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40',
    icon: Users,
  },
  CUSTOMER: {
    style: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
    icon: User,
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

export function UserRoleBadge({
  role,
  size = 'md',
  showIcon = true,
  className,
}: UserRoleBadgeProps) {
  const config = roleConfig[role as keyof typeof roleConfig] || {
    style: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
    icon: User,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase transition-all duration-200 ${config.style} ${sizeStyles[size]} ${className || ''}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {role}
    </span>
  )
}
