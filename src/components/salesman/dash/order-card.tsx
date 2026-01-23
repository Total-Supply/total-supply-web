'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  PlayCircle,
  ShoppingCart,
  User,
  XCircle,
} from 'lucide-react'

import { OrderStatusBadge } from './order-status-badge'

type OrderCardProps = {
  order: {
    id: number
    orderNumber: string
    status: string
    createdAt: string
    notes?: string | null
    customer: {
      name: string
      phone?: string | null
    }
    deliveryAddress: {
      line1: string
      city: string
    } | null
    items: Array<{
      id: number
      quantity: number
      foodItem: {
        name: string
      }
    }>
  }
  onAccept: () => void
  onPrepare: () => void
  onDecline: () => void
  isLoading?: boolean
  isNew?: boolean
}

export function OrderCard({
  order,
  onAccept,
  onPrepare,
  onDecline,
  isLoading = false,
  isNew = false,
}: OrderCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActionButtons = () => {
    if (order.status === 'PENDING') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onAccept}
            disabled={isLoading}
            colorPalette="blue"
            className="w-full"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button
            onClick={onDecline}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </div>
      )
    }

    if (order.status === 'ACCEPTED') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onPrepare}
            disabled={isLoading}
            colorPalette="blue"
            className="w-full"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Prepare
          </Button>
          <Button
            onClick={onDecline}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </div>
      )
    }

    return (
      <Button disabled variant="outline" className="w-full">
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Ready for Pickup
      </Button>
    )
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-semibold text-primary">
                #{order.orderNumber}
              </p>
              {isNew && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
              )}
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <Badge variant="subtle" className="gap-1.5">
            <ShoppingCart className="h-3 w-3" />
            {order.items.length} items
          </Badge>
        </div>

        {/* Items List */}
        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Items to prepare
          </p>
          <ul className="space-y-1.5">
            {order.items.slice(0, 3).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="truncate">{item.foodItem.name}</span>
                <span className="ml-2 font-semibold tabular-nums">
                  ×{item.quantity}
                </span>
              </li>
            ))}
            {order.items.length > 3 && (
              <li className="text-xs text-muted-foreground">
                +{order.items.length - 3} more items
              </li>
            )}
          </ul>
        </div>

        {/* Customer Info */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium truncate">{order.customer.name}</span>
          </div>
          {order.customer.phone && (
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Phone className="h-4 w-4 text-emerald-500" />
              </div>
              <a
                href={`tel:${order.customer.phone}`}
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {order.customer.phone}
              </a>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-sm min-w-0">
              <p className="font-medium truncate">
                {order.deliveryAddress.line1}
              </p>
              <p className="text-muted-foreground">
                {order.deliveryAddress.city}
              </p>
            </div>
          </div>
        )}

        {/* Special Notes */}
        {order.notes && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Special Instructions
                </p>
                <p className="text-sm text-amber-700/90 dark:text-amber-300/90 line-clamp-2">
                  {order.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Placed at</span>
            <span className="font-medium tabular-nums">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">{getActionButtons()}</div>
      </div>
    </MotionBox>
  )
}
