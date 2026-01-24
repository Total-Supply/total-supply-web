import { MotionBox } from '@/src/components/motion/box'
import { AlertCircle, CheckCircle2, Clock, Package, Truck } from 'lucide-react'

type StatusHistoryItem = {
  id: number
  from: string | null
  to: string
  changedAt: string
  note?: string | null
  changedBy?: {
    id: number
    name: string
  } | null
}

const STATUS_STEPS = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    description: 'We are confirming your order details',
  },
  ACCEPTED: {
    label: 'Accepted',
    icon: CheckCircle2,
    description: 'Your order is accepted. Preparation starts soon',
  },
  PREPARING: {
    label: 'Preparing',
    icon: Package,
    description: 'Our team is preparing your items now',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    icon: Truck,
    description: 'Your order is on the way',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle2,
    description: 'Delivery completed. Thank you for ordering',
  },
  CANCELED: {
    label: 'Canceled',
    icon: AlertCircle,
    description: 'This order was canceled',
  },
}

type OrderTimelineProps = {
  currentStatus: string
  statusHistory?: StatusHistoryItem[]
  className?: string
}

export function OrderTimeline({
  currentStatus,
  statusHistory = [],
  className = '',
}: OrderTimelineProps) {
  const timeline = new Map<string, StatusHistoryItem>()
  statusHistory.forEach((entry) => timeline.set(entry.to, entry))

  const currentConfig =
    STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.PENDING

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Order Timeline</h3>
          <p className="text-sm text-muted-foreground">
            {currentConfig.description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {STATUS_STEPS.map((step, index) => {
          const entry = timeline.get(step)
          const isActive = currentStatus === step
          const isComplete = !!entry
          const config = STATUS_CONFIG[step]

          return (
            <MotionBox
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex gap-4 relative"
            >
              {/* Connector Line */}
              {index < STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-12 bottom-0 w-0.5 -mb-4 transition-colors duration-500 ${
                    isComplete ? 'bg-emerald-500' : 'bg-border'
                  }`}
                />
              )}

              {/* Status Icon */}
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ring-4 ring-background transition-all duration-500 ${
                  isComplete
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isActive
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white animate-pulse shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                <config.icon className="h-5 w-5" />
              </div>

              {/* Status Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-semibold transition-colors ${
                      isActive
                        ? 'text-foreground'
                        : isComplete
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {config.label}
                  </h4>
                  {entry && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {new Date(entry.changedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                {entry && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {entry.changedBy?.name && (
                      <p>Updated by {entry.changedBy.name}</p>
                    )}
                    {entry.note && !entry.note.startsWith('{') && (
                      <p className="rounded-md bg-muted/50 px-2 py-1 text-xs">
                        {entry.note}
                      </p>
                    )}
                  </div>
                )}

                {!entry && !isActive && (
                  <p className="text-sm text-muted-foreground">Pending</p>
                )}

                {isActive && !entry && (
                  <p className="text-sm text-muted-foreground">
                    In progress...
                  </p>
                )}
              </div>
            </MotionBox>
          )
        })}
      </div>
    </div>
  )
}
