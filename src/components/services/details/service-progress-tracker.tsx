import { MotionBox } from '@/src/components/motion/box'
import {
  CheckCheck,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Wrench,
} from 'lucide-react'

import { STATUS_STEPS, TimelineEntry } from './service-request-detail-page'

const STEP_CONFIG = {
  RECEIVED: {
    icon: Package,
    label: 'Received',
    description: 'Request submitted',
  },
  ASSIGNED: {
    icon: Clock,
    label: 'Assigned',
    description: 'Staff assigned',
  },
  IN_PROGRESS: {
    icon: Wrench,
    label: 'In Progress',
    description: 'Service ongoing',
  },
  RESOLVED: {
    icon: CheckCheck,
    label: 'Resolved',
    description: 'Service completed',
  },
}

type ServiceProgressTrackerProps = {
  status: string
  timeline: TimelineEntry[]
}

export function ServiceProgressTracker({
  status,
  timeline,
}: ServiceProgressTrackerProps) {
  const currentStepIndex = STATUS_STEPS.indexOf(status)

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-6">Service Progress</h3>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
        <div
          className="absolute left-5 top-0 w-0.5 bg-gradient-to-b from-primary to-primary/50 transition-all duration-1000"
          style={{
            height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative space-y-8">
          {STATUS_STEPS.map((step, index) => {
            const entry = timeline.find((item) => item.status === step)
            const isComplete = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const config = STEP_CONFIG[step as keyof typeof STEP_CONFIG]
            const Icon = config.icon

            return (
              <div key={step} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ring-4 ring-background transition-all duration-300 ${
                    isComplete
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : isCurrent
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30 animate-pulse'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4
                          className={`text-sm font-semibold ${isCurrent ? 'text-primary' : ''}`}
                        >
                          {config.label}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {config.description}
                        </p>
                      </div>

                      {(isComplete || isCurrent) && entry && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {entry?.by && (
                      <p className="text-xs text-muted-foreground mt-2">
                        By: {entry.by}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MotionBox>
  )
}
