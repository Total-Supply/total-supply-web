'use client'

import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Edit3, Trash2 } from 'lucide-react'

type TableActionsProps = {
  onEdit: () => void
  onDelete: () => void
}

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <IconActionButton
        icon={Edit3}
        label="Edit"
        variant="edit"
        onClick={onEdit}
      />
      <IconActionButton
        icon={Trash2}
        label="Delete"
        variant="delete"
        onClick={onDelete}
      />
    </div>
  )
}
