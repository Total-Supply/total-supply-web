'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { UserRow } from './user-row'

type AdminUser = {
  id: number
  email: string
  name: string
  role: string
  status: string
  createdAt: string
}

type UsersTableProps = {
  users: AdminUser[]
  isLoading: boolean
  onView: (userId: number) => void
  onEdit: (userId: number) => void
  onSuspend: (userId: number) => void
  onActivate: (userId: number) => void
}

export function UsersTable({
  users,
  isLoading,
  onView,
  onEdit,
  onSuspend,
  onActivate,
}: UsersTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">User</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Role</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Joined</th>
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
              No users found.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onView={onView}
              onEdit={onEdit}
              onSuspend={onSuspend}
              onActivate={onActivate}
              isLoading={isLoading}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
