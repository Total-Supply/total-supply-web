'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Download, Package, RefreshCw } from 'lucide-react'

type OrdersListHeaderProps = {
  onExport: () => void
  onRefresh: () => void
  isRefreshing: boolean
  hasOrders: boolean
}

export function OrdersListHeader({
  onExport,
  onRefresh,
  isRefreshing,
  hasOrders,
}: OrdersListHeaderProps) {
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
          My Orders
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track and manage all your orders
        </p>
      </div>

      {/* Action Buttons - Centered */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={!hasOrders}
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </MotionBox>
  )
}
