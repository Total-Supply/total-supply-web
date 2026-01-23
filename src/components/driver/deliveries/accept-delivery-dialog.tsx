'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { Clock, Info, MapPin, Package, Truck, User, X } from 'lucide-react'

type AcceptDeliveryDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting: boolean
  delivery: {
    orderNumber: string
    customer: { name: string; phone?: string | null }
    deliveryAddress: {
      line1: string
      line2?: string | null
      city: string
      postalCode: string
    } | null
    itemsCount: number
  }
}

export function AcceptDeliveryDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  delivery,
}: AcceptDeliveryDialogProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && !isSubmitting && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-lg">
          <Dialog.CloseTrigger
            className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
                <Truck className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Accept Delivery
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Confirm you&apos;re ready to deliver
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-500/10 p-3.5 border border-blue-500/20">
                <div className="flex gap-2.5">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You are about to accept delivery{' '}
                    <strong>#{delivery.orderNumber}</strong>. The customer will
                    receive an ETA notification.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-sm font-medium">
                      {delivery.customer.name}
                    </p>
                    {delivery.customer.phone && (
                      <a
                        href={`tel:${delivery.customer.phone}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {delivery.customer.phone}
                      </a>
                    )}
                  </div>
                </div>

                {delivery.deliveryAddress && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Delivery Address
                      </p>
                      <p className="text-sm font-medium">
                        {delivery.deliveryAddress.line1}
                        {delivery.deliveryAddress.line2 &&
                          `, ${delivery.deliveryAddress.line2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {delivery.deliveryAddress.city}{' '}
                        {delivery.deliveryAddress.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="text-sm font-medium">
                      {delivery.itemsCount} items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Estimated Time
                    </p>
                    <p className="text-sm font-medium">15 minutes ETA</p>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              colorPalette="blue"
              onClick={onConfirm}
              loading={isSubmitting}
            >
              <Truck className="mr-2 h-4 w-4" />
              Accept & Start
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
