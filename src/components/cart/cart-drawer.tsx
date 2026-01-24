'use client'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { RootState } from '@/src/store'
import { Drawer } from '@chakra-ui/react'
import { ArrowRight, Eye, Package, ShoppingCart, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawerEnhanced({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter()
  const items = useSelector((state: RootState) => state.cart.items)
  const total = useSelector((state: RootState) => state.cart.total)

  const tax = 0
  const deliveryFee = total > 0 ? 250 : 0
  const grandTotal = total + tax + deliveryFee

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  return (
    <Drawer.Root
      open={isOpen}
      placement="end"
      size="md"
      onOpenChange={(details) => {
        if (!details.open) onClose()
      }}
    >
      <Drawer.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Drawer.Positioner>
        <Drawer.Content className="bg-card border-l border-border">
          {/* Header */}
          <Drawer.Header className="border-b border-border p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <Drawer.Title className="text-base sm:text-lg font-semibold">
                    Shopping Cart
                  </Drawer.Title>
                  <p className="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <Drawer.CloseTrigger asChild>
                <button className="rounded-lg p-2 transition-colors hover:bg-muted active:scale-95">
                  <X className="h-5 w-5" />
                </button>
              </Drawer.CloseTrigger>
            </div>
          </Drawer.Header>

          {/* Body */}
          <Drawer.Body className="p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                </div>
                <p className="font-semibold text-base mb-2">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
                  Add fresh items from the catalog to get started
                </p>
                <Button
                  colorPalette="primary"
                  onClick={() => handleNavigate('/shop')}
                  size="lg"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          LKR {item.price.toFixed(2)} × {item.quantity}
                        </p>
                        {item.stock !== undefined &&
                          item.stock !== null &&
                          item.stock <= 0 && (
                            <Badge
                              variant="subtle"
                              colorPalette="red"
                              className="mt-1.5"
                            >
                              Out of stock
                            </Badge>
                          )}
                      </div>
                      <p className="text-sm font-bold text-primary">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Drawer.Body>

          {/* Footer */}
          {items.length > 0 && (
            <Drawer.Footer className="border-t border-border p-4 sm:p-6">
              <div className="space-y-4 w-full">
                {/* Summary */}
                <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      LKR {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold">
                      {deliveryFee > 0
                        ? `LKR ${deliveryFee.toFixed(2)}`
                        : 'FREE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      LKR {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate('/cart')}
                    size="lg"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">View Cart</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button
                    colorPalette="primary"
                    onClick={() => handleNavigate('/checkout')}
                    size="lg"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Drawer.Footer>
          )}
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}
