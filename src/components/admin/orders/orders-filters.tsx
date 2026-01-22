'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'

type OrdersFiltersProps = {
  search: string
  status: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  statusOptions: string[]
}

export function OrdersFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  statusOptions,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-full min-w-[200px] sm:w-64">
        <Input
          placeholder="Search order number"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="min-w-[180px]">
        <AppSelect
          placeholder="All statuses"
          value={status}
          options={[
            { label: 'All statuses', value: 'ALL' },
            ...statusOptions.map((entry) => ({
              label: entry.replace(/_/g, ' '),
              value: entry,
            })),
          ]}
          onChange={onStatusChange}
        />
      </div>
    </div>
  )
}
