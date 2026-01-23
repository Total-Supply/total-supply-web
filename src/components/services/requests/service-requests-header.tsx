'use client'

import { MotionBox } from '@/src/components/motion/box'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { ClipboardList, RefreshCw } from 'lucide-react'

type ServiceRequestsHeaderProps = {
  onRefresh: () => void
  isRefreshing: boolean
}

export function ServiceRequestsHeader({
  onRefresh,
  isRefreshing,
}: ServiceRequestsHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
          <ClipboardList className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
        My Service Requests
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-muted-foreground mb-6">
        Track and manage your cleaning and IT support bookings
      </p>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <IconActionButton
          icon={RefreshCw}
          label="Refresh requests"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
      </div>
    </MotionBox>
  )
}
