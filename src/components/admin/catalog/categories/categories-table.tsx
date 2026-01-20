'use client'

import {
  AdminTable,
  AdminTableSkeleton,
} from '@/src/components/admin/admin-table'

import { CategoryRow } from './category-row'

type CatalogCategory = {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  itemCount?: number
}

type CategoriesTableProps = {
  categories: CatalogCategory[]
  isLoading: boolean
  onEdit: (category: CatalogCategory) => void
  onDelete: (category: CatalogCategory) => void
}

export function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 text-left">Category</th>
          <th className="px-4 py-3 text-left">Slug</th>
          <th className="px-4 py-3 text-right">Items</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AdminTableSkeleton columns={4} rows={10} />
        ) : categories.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-muted-foreground"
              colSpan={4}
            >
              No categories found.
            </td>
          </tr>
        ) : (
          categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </AdminTable>
  )
}
