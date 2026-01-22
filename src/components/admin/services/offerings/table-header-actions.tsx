'use client'

import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Plus, RefreshCw } from 'lucide-react'

type TableHeaderActionsProps = {
  onRefresh: () => void
  onAdd: () => void
  isRefreshing: boolean
}

export function TableHeaderActions({
  onRefresh,
  onAdd,
  isRefreshing,
}: TableHeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IconActionButton
        icon={RefreshCw}
        label="Refresh offerings"
        variant="refresh"
        isLoading={isRefreshing}
        onClick={onRefresh}
      />
      <Button
        onClick={onAdd}
        leftIcon={<Plus className="h-4 w-4" />}
        colorPalette="teal"
        variant="outline"
        size="sm"
      >
        Add Offering
      </Button>
    </div>
  )
}
