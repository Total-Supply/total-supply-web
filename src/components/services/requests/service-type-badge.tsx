import { Laptop, Sparkles } from 'lucide-react'

type ServiceTypeBadgeProps = {
  type: string
  showIcon?: boolean
  className?: string
}

const typeConfig = {
  CLEANING: {
    style: 'bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/40',
    icon: Sparkles,
  },
  IT_SUPPORT: {
    style: 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/40',
    icon: Laptop,
  },
}

export function ServiceTypeBadge({
  type,
  showIcon = true,
  className,
}: ServiceTypeBadgeProps) {
  const config = typeConfig[type as keyof typeof typeConfig] || {
    style: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
    icon: Sparkles,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${config.style} ${className || ''}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {type.replace(/_/g, ' ')}
    </span>
  )
}
