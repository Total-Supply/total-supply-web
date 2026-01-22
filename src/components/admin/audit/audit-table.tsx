'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { AuditLogRow } from './audit-log-row'

type AuditLog = {
  id: number
  entityType: string
  entityId: number
  action: string
  actorId: number | null
  actor: {
    id: number
    name: string
    email: string
    role: string
  } | null
  ipAddress: string | null
  userAgent: string | null
  details: Record<string, unknown>
  createdAt: string
}

type AuditTableProps = {
  logs: AuditLog[]
  isLoading: boolean
  onViewDetails: (log: AuditLog) => void
}

export function AuditTable({
  logs,
  isLoading,
  onViewDetails,
}: AuditTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">ID</th>
          <th className="px-4 py-3 text-left">Timestamp</th>
          <th className="px-4 py-3 text-left">Actor</th>
          <th className="px-4 py-3 text-left">Action</th>
          <th className="px-4 py-3 text-left">Entity</th>
          <th className="px-4 py-3 text-left">Entity ID</th>
          <th className="px-4 py-3 text-left">IP Address</th>
          <th className="px-4 py-3 text-right">Details</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={8} rows={10} />
        ) : logs.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={8}
            >
              No audit logs found.
            </td>
          </tr>
        ) : (
          logs.map((log) => (
            <AuditLogRow key={log.id} log={log} onViewDetails={onViewDetails} />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
