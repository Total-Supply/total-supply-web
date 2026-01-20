'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'
import { Checkbox } from '@/src/components/ui/checkbox'

import { ApprovalRow } from './approval-row'

type ApprovalUser = {
  id: number
  email: string
  name: string
  phone?: string | null
  status: string
  createdAt: string
}

type ApprovalsTableProps = {
  users: ApprovalUser[]
  selectedIds: number[]
  isAllSelected: boolean
  isLoading: boolean
  onToggle: (id: number) => void
  onToggleAll: () => void
  onApprove: (userId: number) => void
  onReject: (userId: number) => void
}

export function ApprovalsTable({
  users,
  selectedIds,
  isAllSelected,
  isLoading,
  onToggle,
  onToggleAll,
  onApprove,
  onReject,
}: ApprovalsTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="w-12 px-4 py-3">
            <Checkbox checked={isAllSelected} onCheckedChange={onToggleAll} />
          </th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-left">Registered</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={6} rows={10} />
        ) : users.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={6}
            >
              No pending approvals right now.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <ApprovalRow
              key={user.id}
              user={user}
              isSelected={selectedIds.includes(user.id)}
              onToggle={onToggle}
              onApprove={onApprove}
              onReject={onReject}
              isLoading={isLoading}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
