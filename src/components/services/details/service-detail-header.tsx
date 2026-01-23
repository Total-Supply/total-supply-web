import { MotionBox } from '@/src/components/motion/box'
import { AlertCircle, Calendar, MapPin, Sparkles, Wrench } from 'lucide-react'

import { ServiceDetail } from './service-request-detail-page'

const PRIORITY_CONFIG = {
  LOW: { color: 'from-slate-500 to-slate-600', label: 'Low Priority' },
  MEDIUM: { color: 'from-blue-500 to-blue-600', label: 'Medium Priority' },
  HIGH: { color: 'from-amber-500 to-amber-600', label: 'High Priority' },
  URGENT: { color: 'from-red-500 to-red-600', label: 'Urgent' },
}

const STATUS_CONFIG = {
  RECEIVED: {
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-500/30',
    label: 'Received',
  },
  ASSIGNED: {
    color:
      'bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-purple-500/30',
    label: 'Assigned',
  },
  IN_PROGRESS: {
    color:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/30',
    label: 'In Progress',
  },
  RESOLVED: {
    color:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/30',
    label: 'Resolved',
  },
  CANCELLED: {
    color: 'bg-red-500/10 text-red-700 dark:text-red-400 ring-red-500/30',
    label: 'Cancelled',
  },
}

type ServiceDetailHeaderProps = {
  service: ServiceDetail
}

export function ServiceDetailHeader({ service }: ServiceDetailHeaderProps) {
  const ServiceIcon = service.type === 'CLEANING' ? Sparkles : Wrench
  const priorityConfig =
    PRIORITY_CONFIG[service.priority as keyof typeof PRIORITY_CONFIG]
  const statusConfig =
    STATUS_CONFIG[service.status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.RECEIVED

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Request Number & Status */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <ServiceIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {service.requestNumber}
              </h1>
              <p className="text-sm text-muted-foreground">
                {service.type === 'IT_SUPPORT'
                  ? 'IT Support'
                  : 'Cleaning Services'}
                {service.category &&
                  ` • ${service.category.replace(/_/g, ' ')}`}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${statusConfig.color}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
          {statusConfig.label}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Priority */}
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${priorityConfig.color} text-white shadow-lg`}
            >
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <p className="text-sm font-semibold">{priorityConfig.label}</p>
            </div>
          </div>
        </div>

        {/* Created Date */}
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-semibold">
                {new Date(service.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        {service.address && (
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
                <MapPin className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-semibold line-clamp-1">
                  {service.address.city}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MotionBox>
  )
}
