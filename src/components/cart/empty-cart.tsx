'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Package, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react'

type EmptyCartProps = {
  onContinueShopping: () => void
}

export function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-16"
    >
      <div className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <ShoppingCart className="h-12 w-12 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Discover fresh products and quality items. Start adding to your cart
          to begin your order.
        </p>

        <Button
          onClick={onContinueShopping}
          colorPalette="primary"
          size="lg"
          className="mb-8"
        >
          <Package className="mr-2 h-5 w-5" />
          Browse Products
        </Button>

        {/* Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto mt-12">
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 mb-3 mx-auto">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-1">Fresh Products</h3>
            <p className="text-xs text-muted-foreground">
              Quality guaranteed on all items
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 mb-3 mx-auto">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold mb-1">Best Prices</h3>
            <p className="text-xs text-muted-foreground">
              Competitive pricing every day
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20 mb-3 mx-auto">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-1">Fast Delivery</h3>
            <p className="text-xs text-muted-foreground">
              Same-day delivery available
            </p>
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
