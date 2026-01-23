'use client'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Package,
  Receipt,
  Truck,
} from 'lucide-react'

type CheckoutSummaryProps = {
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  itemCount: number
  hasIssues: boolean
  onPlaceOrder: () => void
}

export function CheckoutSummary({
  subtotal,
  tax,
  deliveryFee,
  total,
  itemCount,
  hasIssues,
  onPlaceOrder,
}: CheckoutSummaryProps) {
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
            <p className="text-xs text-muted-foreground">Review your order</p>
          </div>
        </div>

        {/* Item Count */}
        <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Items</span>
            </div>
            <Badge variant="subtle" className="font-semibold">
              {itemCount}
            </Badge>
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
              {deliveryFee > 0 ? (
                `LKR ${deliveryFee.toFixed(2)}`
              ) : (
                <span className="text-emerald-500">FREE</span>
              )}
            </span>
          </div>

          {subtotal < 5000 && deliveryFee > 0 && (
            <div className="rounded-md bg-blue-500/10 border border-blue-500/20 p-2">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Add LKR {(5000 - subtotal).toFixed(2)} more for free delivery
              </p>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Total</span>
          </div>
          <span className="text-2xl font-bold text-primary tabular-nums">
            LKR {total.toFixed(2)}
          </span>
        </div>

        {/* Issue Warning */}
        {hasIssues && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Please resolve stock issues before checkout
              </p>
            </div>
          </div>
        )}

        {/* Place Order Button */}
        <Button
          onClick={onPlaceOrder}
          disabled={hasIssues}
          colorPalette="primary"
          className="w-full"
          size="lg"
        >
          {hasIssues ? (
            <>
              <AlertCircle className="mr-2 h-5 w-5" />
              Review Cart Issues
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Place Order
            </>
          )}
        </Button>

        {/* Trust Badges */}
        <div className="space-y-2 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Secure Checkout
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              256-bit SSL encryption
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Secure payment processing
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Your data is protected
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
