'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from 'lucide-react'

import { DeliveryStatusBadge } from './delivery-status-badge'

type DeliveryCardProps = {
  delivery: {
    id: number
    orderNumber: string
    status: string
    createdAt: string
    notes?: string | null
    itemsCount: number
    customer: {
      name: string
      phone?: string | null
    }
    deliveryAddress: {
      line1: string
      line2?: string | null
      city: string
      postalCode: string
    } | null
  }
  onAccept: () => void
  onConfirm: () => void
  isLoading?: boolean
  isNew?: boolean
}

export function DeliveryCard({
  delivery,
  onAccept,
  onConfirm,
  isLoading = false,
  isNew = false,
}: DeliveryCardProps) {
  const buildMapLink = () => {
    if (!delivery.deliveryAddress) return '#'
    const address = [
      delivery.deliveryAddress.line1,
      delivery.deliveryAddress.line2,
      delivery.deliveryAddress.city,
      delivery.deliveryAddress.postalCode,
    ]
      .filter(Boolean)
      .join(', ')
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
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
                #{delivery.orderNumber}
              </p>
              {isNew && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
              )}
            </div>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5 ring-1 ring-blue-500/20">
            <Package className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">
              {delivery.itemsCount}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{delivery.customer.name}</span>
          </div>
          {delivery.customer.phone && (
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Phone className="h-4 w-4 text-emerald-500" />
              </div>
              <a
                href={`tel:${delivery.customer.phone}`}
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {delivery.customer.phone}
              </a>
            </div>
          )}
        </div>

        {/* Address */}
        {delivery.deliveryAddress && (
          <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{delivery.deliveryAddress.line1}</p>
              {delivery.deliveryAddress.line2 && (
                <p className="text-muted-foreground">
                  {delivery.deliveryAddress.line2}
                </p>
              )}
              <p className="text-muted-foreground">
                {delivery.deliveryAddress.city}{' '}
                {delivery.deliveryAddress.postalCode}
              </p>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="mt-2 h-7 text-xs"
              >
                <a href={buildMapLink()} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3 w-3" />
                  Open in Maps
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Special Notes */}
        {delivery.notes && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Delivery Instructions
                </p>
                <p className="text-sm text-amber-700/90 dark:text-amber-300/90">
                  {delivery.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2">
          {delivery.status === 'PREPARING' ? (
            <Button
              onClick={onAccept}
              disabled={isLoading}
              className="w-full"
              colorPalette="blue"
            >
              <Truck className="mr-2 h-4 w-4" />
              Accept Delivery
            </Button>
          ) : delivery.status === 'OUT_FOR_DELIVERY' ? (
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full"
              colorPalette="green"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Delivery
            </Button>
          ) : null}
        </div>
      </div>
    </MotionBox>
  )
}
