'use client'

import { Package, ShoppingCart } from 'lucide-react'

type OrderItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string | null
  stock?: number | null
}

type CheckoutOrderReviewProps = {
  items: OrderItem[]
}

export function CheckoutOrderReview({ items }: CheckoutOrderReviewProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
          <ShoppingCart className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Order Review</h3>
          <p className="text-xs text-muted-foreground">
            {items.length} items in cart
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 transition-all hover:shadow-md"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold tabular-nums">
                LKR {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
