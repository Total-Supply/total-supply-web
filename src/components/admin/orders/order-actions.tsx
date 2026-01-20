'use client'

import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Eye } from 'lucide-react'

type OrderActionsProps = {
  orderNumber: string
  onView: () => void
  onSave: () => void
  isSaving: boolean
}

export function OrderActions({
  orderNumber,
  onView,
  onSave,
  isSaving,
}: OrderActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <IconActionButton
        icon={Eye}
        label="View order details"
        variant="view"
        onClick={onView}
      />
      <Button
        size="sm"
        colorPalette="teal"
        variant="solid"
        onClick={onSave}
        disabled={isSaving}
        loading={isSaving}
        className="min-w-[80px]"
      >
        Save
      </Button>
    </div>
  )
}
