'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Title Section - Centered */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Review your items before checkout
        </p>
      </div>

      {/* Stats Row - Centered */}
      {itemCount > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-6 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Items:</span>
              <Badge variant="subtle" className="font-semibold">
                {itemCount}
              </Badge>
            </div>

            <div className="hidden sm:block h-4 w-px bg-border/60" />

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Quantity:</span>
              <Badge variant="subtle" className="font-semibold">
                {totalItems}
              </Badge>
            </div>

            {isSyncing && (
              <>
                <div className="hidden sm:block h-4 w-px bg-border/60" />
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-sm">Syncing...</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
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
    </MotionBox>
  )
}
