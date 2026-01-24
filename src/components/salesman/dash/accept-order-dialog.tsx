'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { CheckCircle2, Info, MapPin, ShoppingCart, User, X } from 'lucide-react'

type AcceptOrderDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting: boolean
  order: {
    orderNumber: string
    customer: { name: string }
    deliveryAddress: { line1: string; city: string } | null
    items: Array<{
      id: number
      quantity: number
      foodItem: { name: string }
    }>
  }
}

export function AcceptOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  order,
}: AcceptOrderDialogProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

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
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Accept Order
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Confirm order acceptance
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
                    You are about to accept order{' '}
                    <strong>#{order.orderNumber}</strong>. Start preparing once
                    accepted.
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
                    <p className="text-sm font-medium">{order.customer.name}</p>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Delivery Location
                      </p>
                      <p className="text-sm font-medium">
                        {order.deliveryAddress.line1},{' '}
                        {order.deliveryAddress.city}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="text-sm font-medium">
                      {totalItems} items total
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Items to prepare:
                  </p>
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{item.foodItem.name}</span>
                        <span className="font-semibold tabular-nums">
                          ×{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
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
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept Order
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
