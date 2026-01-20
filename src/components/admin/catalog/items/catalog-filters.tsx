'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'

type CatalogCategory = {
  id: number
  name: string
}

type CatalogFiltersProps = {
  search: string
  categoryFilter: string
  statusFilter: string
  categories: CatalogCategory[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function CatalogFilters({
  search,
  categoryFilter,
  statusFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: CatalogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="w-full sm:w-64">
        <Input
          placeholder="Search name or SKU"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="min-w-[180px]">
        <AppSelect
          placeholder="All categories"
          value={categoryFilter}
          options={[
            { label: 'All categories', value: 'ALL' },
            ...categories.map((category) => ({
              label: category.name,
              value: String(category.id),
            })),
          ]}
          onChange={onCategoryChange}
        />
      </div>
      <div className="min-w-[160px]">
        <AppSelect
          placeholder="All statuses"
          value={statusFilter}
          options={[
            { label: 'All statuses', value: 'ALL' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
          ]}
          onChange={onStatusChange}
        />
      </div>
    </div>
  )
}
