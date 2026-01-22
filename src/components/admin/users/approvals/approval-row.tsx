'use client'

import { Checkbox } from '@/src/components/ui/checkbox'
import { Calendar, Mail, Phone, User } from 'lucide-react'

import { ApprovalActions } from './approval-actions'

type ApprovalUser = {
  id: number
  email: string
  name: string
  phone?: string | null
  status: string
  createdAt: string
}

type ApprovalRowProps = {
  user: ApprovalUser
  isSelected: boolean
  onToggle: (id: number) => void
  onApprove: (userId: number) => void
  onReject: (userId: number) => void
  isLoading: boolean
}

export function ApprovalRow({
  user,
  isSelected,
  onToggle,
  onApprove,
  onReject,
  isLoading,
}: ApprovalRowProps) {
  return (
    <tr className="border-t border-border/60 align-middle transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4 w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(user.id)}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{user.phone || '-'}</span>
        </div>
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
        <ApprovalActions
          userId={user.id}
          onApprove={onApprove}
          onReject={onReject}
          isLoading={isLoading}
        />
      </td>
    </tr>
  )
}
