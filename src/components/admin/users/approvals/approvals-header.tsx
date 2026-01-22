'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { CheckCircle2, RefreshCw, UserCheck } from 'lucide-react'

type ApprovalsHeaderProps = {
  selectedCount: number
  onRefresh: () => void
  onBulkApprove: () => void
  isRefreshing: boolean
  isLoading: boolean
}

export function ApprovalsHeader({
  selectedCount,
  onRefresh,
  onBulkApprove,
  isRefreshing,
  isLoading,
}: ApprovalsHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <UserCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            User Approvals
          </h1>
          <p className="text-sm text-muted-foreground">
            Review new registrations and approve platform access
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconActionButton
          icon={RefreshCw}
          label="Refresh approvals"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
        {selectedCount > 0 && (
          <Button
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            colorPalette="green"
            variant="solid"
            onClick={onBulkApprove}
            disabled={isLoading}
          >
            Approve Selected ({selectedCount})
          </Button>
        )}
      </div>
    </MotionBox>
  )
}
