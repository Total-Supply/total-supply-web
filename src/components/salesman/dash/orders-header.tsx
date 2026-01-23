'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Check, Filter, Package, RefreshCw } from 'lucide-react'

type OrdersHeaderProps = {
  newCount: number
  status: string
  onStatusChange: (value: string) => void
  onRefresh: () => void
  onMarkAllRead: () => void
  isRefreshing: boolean
}

const STATUS_OPTIONS = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Preparing', value: 'PREPARING' },
]

export function OrdersHeader({
  newCount,
  status,
  onStatusChange,
  onRefresh,
  onMarkAllRead,
  isRefreshing,
}: OrdersHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-sm text-muted-foreground">
              Orders assigned to you for preparation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllRead}
              className="relative"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark {newCount} as read
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {newCount}
              </span>
            </Button>
          )}
          <IconActionButton
            icon={RefreshCw}
            label="Refresh orders"
            variant="refresh"
            isLoading={isRefreshing}
            onClick={onRefresh}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <Filter className="h-4 w-4" />
          <span>Filter by Status:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={status === option.value ? 'solid' : 'outline'}
              colorPalette={status === option.value ? 'blue' : undefined}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </MotionBox>
  )
}
