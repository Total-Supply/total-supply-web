import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Clock, X } from 'lucide-react'

import { OrderStatusBadge } from './order-status-badge'
import { STATUS_CONFIG } from './order-status-badge'

type OrderHeaderCardProps = {
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
  salesmanName?: string | null
  estimatedDelivery?: string | null
  canCancel: boolean
  onCancel: () => void
}

export function OrderHeaderCard({
  orderNumber,
  status,
  totalPrice,
  createdAt,
  salesmanName,
  estimatedDelivery,
  canCancel,
  onCancel,
}: OrderHeaderCardProps) {
  const statusConfig =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-border/30 ${statusConfig.color}`}
            >
              <statusConfig.icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{orderNumber}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on{' '}
                {new Date(createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {salesmanName && (
                <p className="text-sm text-muted-foreground mt-1">
                  Salesman: {salesmanName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <OrderStatusBadge status={status} size="md" />
            {estimatedDelivery &&
              status !== 'DELIVERED' &&
              status !== 'CANCELED' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Est. delivery: {estimatedDelivery}</span>
                </div>
              )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-primary tabular-nums">
              LKR {Number(totalPrice).toFixed(2)}
            </p>
          </div>

          {canCancel && (
            <Button
              variant="outline"
              colorPalette="red"
              size="sm"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </MotionBox>
  )
}
