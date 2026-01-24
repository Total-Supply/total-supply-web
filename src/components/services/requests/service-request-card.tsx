'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Calendar, ClipboardList, Eye } from 'lucide-react'

import { ServicePriorityBadge } from './service-priority-badge'
import { ServiceStatusBadge } from './service-status-badge'
import { ServiceTypeBadge } from './service-type-badge'

type ServiceSummary = {
  id: number
  requestNumber: string
  type: string
  status: string
  priority: string
  title?: string | null
  createdAt: string
}

type ServiceRequestCardProps = {
  request: ServiceSummary
  onView: (id: number) => void
  index: number
}

export function ServiceRequestCard({
  request,
  onView,
  index,
}: ServiceRequestCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onView(request.id)}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-2xl" />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">
                #{request.requestNumber}
              </p>
              <p className="text-xs text-muted-foreground">Request Number</p>
            </div>
          </div>
          <ServiceStatusBadge status={request.status} size="sm" />
        </div>

        {request.title && (
          <p className="text-sm font-medium text-foreground line-clamp-2">
            {request.title}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <ServiceTypeBadge type={request.type} showIcon={true} />
          <ServicePriorityBadge
            priority={request.priority}
            size="sm"
            showIcon={true}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {new Date(request.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          className="w-full group-hover:bg-primary/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onView(request.id)
          }}
        >
          View Details
        </Button>
      </div>
    </MotionBox>
  )
}
