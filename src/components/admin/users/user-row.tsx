'use client'

import { Calendar, Mail, User } from 'lucide-react'

import { UserStatusBadge } from './approvals/user-status-badge'
import { UserActions } from './user-actions'
import { UserRoleBadge } from './user-role-badge'

type AdminUser = {
  id: number
  email: string
  name: string
  role: string
  status: string
  createdAt: string
}

type UserRowProps = {
  user: AdminUser
  onView: (userId: number) => void
  onEdit: (userId: number) => void
  onSuspend: (userId: number) => void
  onActivate: (userId: number) => void
  isLoading: boolean
}

export function UserRow({
  user,
  onView,
  onEdit,
  onSuspend,
  onActivate,
  isLoading,
}: UserRowProps) {
  return (
    <tr className="border-t border-border/60 align-middle transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <UserRoleBadge role={user.role} showIcon={true} />
      </td>
      <td className="px-4 py-4">
        <UserStatusBadge status={user.status} />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <UserActions
          userId={user.id}
          status={user.status}
          onView={onView}
          onEdit={onEdit}
          onSuspend={onSuspend}
          onActivate={onActivate}
          isLoading={isLoading}
        />
      </td>
    </tr>
  )
}
