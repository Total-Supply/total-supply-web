'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Package } from 'lucide-react'

type OrderTrackingHeaderProps = {
  orderNumber: string
  status: string
  itemCount: number
}

export function OrderTrackingHeader({
  orderNumber,
  status,
  itemCount,
}: OrderTrackingHeaderProps) {
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
          Order Tracking
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your order in real-time
        </p>
      </div>

      {/* Stats Row - Centered */}
      <div className="flex justify-center">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Order:</span>
            <Badge variant="subtle" className="font-mono font-semibold">
              {orderNumber}
            </Badge>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
