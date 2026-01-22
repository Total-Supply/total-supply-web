'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { CatalogItemRow } from './catalog-item-row'

type CatalogCategory = {
  id: number
  name: string
  slug: string
}

type CatalogItem = {
  id: number
  name: string
  slug: string
  price: number | string
  stock: number
  sku?: string | null
  isActive: boolean
  mainImageUrl?: string | null
  categories: CatalogCategory[]
}

type CatalogItemsTableProps = {
  items: CatalogItem[]
  isLoading: boolean
  onEdit: (item: CatalogItem) => void
  onDelete: (item: CatalogItem) => void
}

export function CatalogItemsTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: CatalogItemsTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">Item</th>
          <th className="px-4 py-3 text-left">Categories</th>
          <th className="px-4 py-3 text-right">Price</th>
          <th className="px-4 py-3 text-right">Stock</th>
          <th className="px-4 py-3 text-center">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={6} rows={10} />
        ) : items.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={6}
            >
              No items found.
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <CatalogItemRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
