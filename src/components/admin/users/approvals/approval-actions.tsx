'use client'

import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { CheckCircle2, XCircle } from 'lucide-react'

type ApprovalActionsProps = {
  userId: number
  onApprove: (userId: number) => void
  onReject: (userId: number) => void
  isLoading: boolean
}

export function ApprovalActions({
  userId,
  onApprove,
  onReject,
  isLoading,
}: ApprovalActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        size="sm"
        colorPalette="green"
        variant="solid"
        leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
        onClick={() => onApprove(userId)}
        disabled={isLoading}
        className="min-w-[90px]"
      >
        Approve
      </Button>
      <Button
        size="sm"
        colorPalette="red"
        variant="outline"
        leftIcon={<XCircle className="h-3.5 w-3.5" />}
        onClick={() => onReject(userId)}
        disabled={isLoading}
        className="min-w-[80px]"
      >
        Reject
      </Button>
    </div>
  )
}
