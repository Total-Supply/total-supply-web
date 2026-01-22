'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Package, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

type OrdersEmptyStateProps = {
  hasFilters: boolean
}

export function OrdersEmptyState({ hasFilters }: OrdersEmptyStateProps) {
  const router = useRouter()

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-12 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasFilters ? 'No orders found' : 'No orders yet'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : 'Start shopping to place your first order and track it here.'}
      </p>
      {!hasFilters && (
        <Button className="mt-6" onClick={() => router.push('/catalog')}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Start Shopping
        </Button>
      )}
    </MotionBox>
  )
}
