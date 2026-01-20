'use client'

import { TableActions } from '@/src/components/admin/table-actions'
import { StatusBadge } from '@/src/components/ui/status-badge'

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

type ServiceOfferingRowProps = {
  offering: ServiceOffering
  onEdit: (offering: ServiceOffering) => void
  onDelete: (offering: ServiceOffering) => void
}

export function ServiceOfferingRow({
  offering,
  onEdit,
  onDelete,
}: ServiceOfferingRowProps) {
  return (
    <tr className="border-t border-border/60 transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="font-medium text-foreground">{offering.name}</div>
          <div className="text-xs text-muted-foreground">{offering.slug}</div>
        </div>
      </td>
      <td className="px-4 py-4 text-muted-foreground">
        {offering.type.replace(/_/g, ' ')}
      </td>
      <td className="px-4 py-4 text-muted-foreground">
        {offering.category ? offering.category.replace(/_/g, ' ') : '-'}
      </td>
      <td className="px-4 py-4 text-right text-muted-foreground">
        {offering.basePrice
          ? `LKR ${offering.basePrice.toLocaleString()}`
          : '-'}
      </td>
      <td className="px-4 py-4 text-center">
        <StatusBadge isActive={offering.isActive} />
      </td>
      <td className="px-4 py-4">
        <TableActions
          onEdit={() => onEdit(offering)}
          onDelete={() => onDelete(offering)}
        />
      </td>
    </tr>
  )
}
