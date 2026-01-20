'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { ServiceOfferingRow } from './service-offering-row'

type ServiceOffering = {
  id: number
  name: string
  slug: string
  type: string
  category?: string | null
  description?: string | null
  basePrice?: number | null
  isActive: boolean
  createdAt: string
}

type ServiceOfferingsTableProps = {
  offerings: ServiceOffering[]
  isLoading: boolean
  onEdit: (offering: ServiceOffering) => void
  onDelete: (offering: ServiceOffering) => void
}

export function ServiceOfferingsTable({
  offerings,
  isLoading,
  onEdit,
  onDelete,
}: ServiceOfferingsTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">Offering</th>
          <th className="px-4 py-3 text-left">Type</th>
          <th className="px-4 py-3 text-left">Category</th>
          <th className="px-4 py-3 text-right">Base price</th>
          <th className="px-4 py-3 text-center">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={6} rows={10} />
        ) : offerings.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={6}
            >
              No offerings found.
            </td>
          </tr>
        ) : (
          offerings.map((offering) => (
            <ServiceOfferingRow
              key={offering.id}
              offering={offering}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
