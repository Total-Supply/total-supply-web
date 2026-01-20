'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Eye } from 'lucide-react'

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

type ServiceRequestsTableProps = {
  requests: ServiceSummary[]
  onView: (id: number) => void
}

export function ServiceRequestsTable({
  requests,
  onView,
}: ServiceRequestsTableProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 shadow-lg"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Request #
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="group transition-colors duration-150 hover:bg-muted/30"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    #{request.requestNumber}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(request.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <ServiceTypeBadge type={request.type} />
                </td>
                <td className="px-6 py-4">
                  <ServicePriorityBadge
                    priority={request.priority}
                    showIcon={true}
                  />
                </td>
                <td className="px-6 py-4">
                  <ServiceStatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                    onClick={() => onView(request.id)}
                    className="group-hover:bg-primary/10 transition-colors"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionBox>
  )
}
