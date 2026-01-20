'use client'

import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Input } from '@/src/components/ui/input'
import { Plus, RefreshCw } from 'lucide-react'

type CategoryHeaderActionsProps = {
  search: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  onAdd: () => void
  isRefreshing: boolean
}

export function CategoryHeaderActions({
  search,
  onSearchChange,
  onRefresh,
  onAdd,
  isRefreshing,
}: CategoryHeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full sm:w-64">
        <Input
          placeholder="Search category name"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <IconActionButton
        icon={RefreshCw}
        label="Refresh categories"
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
        Add Category
      </Button>
    </div>
  )
}
