'use client'

import { MotionBox } from '@/src/components/motion/box'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Package, RefreshCw } from 'lucide-react'

type OrdersHeaderProps = {
  onRefresh: () => void
  isRefreshing: boolean
}

export function OrdersHeader({ onRefresh, isRefreshing }: OrdersHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text md:text-3xl">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Track current orders and revisit past purchases
          </p>
        </div>
      </div>
      <IconActionButton
        icon={RefreshCw}
        label="Refresh orders"
        variant="refresh"
        isLoading={isRefreshing}
        onClick={onRefresh}
      />
    </MotionBox>
  )
}
