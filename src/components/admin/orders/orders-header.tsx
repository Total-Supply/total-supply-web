'use client'

import { MotionBox } from '@/src/components/motion/box'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { RefreshCw } from 'lucide-react'

type OrdersHeaderProps = {
  onRefresh: () => void
  isRefreshing: boolean
}

export function OrdersHeader({ onRefresh, isRefreshing }: OrdersHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Order Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update statuses and upload delivery proof.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <IconActionButton
          icon={RefreshCw}
          label="Refresh orders"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
      </div>
    </MotionBox>
  )
}
