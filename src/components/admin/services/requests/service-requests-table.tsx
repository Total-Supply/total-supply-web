'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { ServiceRequestRow } from './service-request-row'

type ServiceRow = {
  id: number
  requestNumber: string
  type: string
  status: string
  priority: string
  createdAt: string
  customer: {
    id: number
    name: string
    email: string
  }
}

type StaffOption = {
  id: number
  name: string
}

type ServiceRequestsTableProps = {
  rows: ServiceRow[]
  isLoading: boolean
  staffByType: {
    CLEANING: StaffOption[]
    IT_SUPPORT: StaffOption[]
  }
  statusOptions: { label: string; value: string }[]
}

export function ServiceRequestsTable({
  rows,
  isLoading,
  staffByType,
  statusOptions,
}: ServiceRequestsTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">Request #</th>
          <th className="px-4 py-3 text-left">Customer</th>
          <th className="px-4 py-3 text-left">Type</th>
          <th className="px-4 py-3 text-left">Priority</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={6} rows={10} />
        ) : rows.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={6}
            >
              No service requests found.
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <ServiceRequestRow
              key={row.id}
              row={row}
              staffOptions={
                staffByType[row.type as 'CLEANING' | 'IT_SUPPORT'] || []
              }
              statusOptions={statusOptions}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
