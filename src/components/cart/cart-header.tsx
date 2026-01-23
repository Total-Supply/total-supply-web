'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft, RefreshCw, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'

type CartHeaderProps = {
  itemCount: number
  totalItems: number
  onClearCart: () => void
  isClearing: boolean
  isSyncing: boolean
}

export function CartHeader({
  itemCount,
  totalItems,
  onClearCart,
  isClearing,
  isSyncing,
}: CartHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <ShoppingCart className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your items before checkout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          {itemCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCart}
              disabled={isClearing}
              colorPalette="red"
            >
              {isClearing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {itemCount > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items:</span>
            <Badge variant="subtle" className="font-semibold">
              {itemCount}
            </Badge>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total Quantity:
            </span>
            <Badge variant="subtle" className="font-semibold">
              {totalItems}
            </Badge>
          </div>
          {isSyncing && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span className="text-sm">Syncing...</span>
              </div>
            </>
          )}
        </div>
      )}
    </MotionBox>
  )
}
