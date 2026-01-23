'use client'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  AlertCircle,
  ArrowRight,
  Hash,
  Package,
  Receipt,
  ShoppingCart,
  Truck,
} from 'lucide-react'

type CartSummaryProps = {
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  itemCount: number
  totalQuantity: number
  hasIssues: boolean
  onContinueShopping: () => void
  onCheckout: () => void
}

export function CartSummary({
  subtotal,
  tax,
  deliveryFee,
  total,
  itemCount,
  totalQuantity,
  hasIssues,
  onContinueShopping,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p className="text-xs text-muted-foreground">Review totals</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <p className="text-xl font-bold">{itemCount}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Quantity</p>
            </div>
            <p className="text-xl font-bold">{totalQuantity}</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-semibold tabular-nums">
              LKR {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tax (0%)</span>
            <span className="font-semibold tabular-nums">
              LKR {tax.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Delivery</span>
            </div>
            <span className="font-semibold tabular-nums">
              {deliveryFee > 0 ? `LKR ${deliveryFee.toFixed(2)}` : 'FREE'}
            </span>
          </div>

          {deliveryFee > 0 && (
            <p className="text-xs text-muted-foreground">
              Free delivery on orders over LKR 5,000
            </p>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary tabular-nums">
            LKR {total.toFixed(2)}
          </span>
        </div>

        {/* Stock Warning */}
        {hasIssues && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Please resolve stock issues before checkout
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            disabled={hasIssues}
            colorPalette="primary"
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Proceed to Checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            onClick={onContinueShopping}
            variant="outline"
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="space-y-2 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Why shop with us?
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Fresh products guaranteed
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Same-day delivery available
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Secure payment processing
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
