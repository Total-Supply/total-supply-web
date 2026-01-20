'use client'

import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Ban, Edit, Eye, UserCheck } from 'lucide-react'

type UserActionsProps = {
  userId: number
  status: string
  onView: (userId: number) => void
  onEdit: (userId: number) => void
  onSuspend: (userId: number) => void
  onActivate: (userId: number) => void
  isLoading: boolean
}

export function UserActions({
  userId,
  status,
  onView,
  onEdit,
  onSuspend,
  onActivate,
  isLoading,
}: UserActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <IconActionButton
        icon={Eye}
        label="View user details"
        variant="view"
        onClick={() => onView(userId)}
      />
      <IconActionButton
        icon={Edit}
        label="Edit user"
        variant="edit"
        onClick={() => onEdit(userId)}
      />
      {status === 'ACTIVE' ? (
        <IconActionButton
          icon={Ban}
          label="Suspend user"
          variant="delete"
          onClick={() => onSuspend(userId)}
          disabled={isLoading}
        />
      ) : status === 'SUSPENDED' ? (
        <IconActionButton
          icon={UserCheck}
          label="Activate user"
          variant="edit"
          onClick={() => onActivate(userId)}
          disabled={isLoading}
        />
      ) : null}
    </div>
  )
}
