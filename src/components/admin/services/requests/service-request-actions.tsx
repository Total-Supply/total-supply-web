'use client'

import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Edit3, Eye } from 'lucide-react'

type ServiceRequestActionsProps = {
  requestId: number
  onView: () => void
  onSave: () => void
  isSaving: boolean
}

export function ServiceRequestActions({
  requestId,
  onView,
  onSave,
  isSaving,
}: ServiceRequestActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <IconActionButton
        icon={Eye}
        label="View request details"
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
