'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { List, RefreshCw, Truck } from 'lucide-react'
import Link from 'next/link'

type DriverDashboardHeaderProps = {
  onRefresh: () => void
  isRefreshing: boolean
}

export function DriverDashboardHeader({
  onRefresh,
  isRefreshing,
}: DriverDashboardHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <Truck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor deliveries and confirm handoffs
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/driver/deliveries">
            <List className="mr-2 h-4 w-4" />
            View Queue
          </Link>
        </Button>
        <IconActionButton
          icon={RefreshCw}
          label="Refresh dashboard"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
      </div>
    </MotionBox>
  )
}
