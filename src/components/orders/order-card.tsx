'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Calendar, DollarSign, Eye, Package } from 'lucide-react'

import { OrderStatusBadge } from './order-status-badge'

type OrderSummary = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
}

type OrderCardProps = {
  order: OrderSummary
  onView: (orderNumber: string) => void
  index: number
}

export function OrderCard({ order, onView, index }: OrderCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onView(order.orderNumber)}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-2xl" />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">
                #{order.orderNumber}
              </p>
              <p className="text-xs text-muted-foreground">Order Number</p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <DollarSign className="h-4 w-4" />
            <span>
              LKR{' '}
              {Number(order.totalPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          className="w-full group-hover:bg-primary/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onView(order.orderNumber)
          }}
        >
          View Details
        </Button>
      </div>
    </MotionBox>
  )
}
