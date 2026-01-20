'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'

type ServiceRequestFiltersProps = {
  search: string
  type: string
  priority: string
  status: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onStatusChange: (value: string) => void
  statusOptions: string[]
  priorityOptions: string[]
}

export function ServiceRequestFilters({
  search,
  type,
  priority,
  status,
  onSearchChange,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  statusOptions,
  priorityOptions,
}: ServiceRequestFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="w-full sm:w-64">
        <Input
          placeholder="Search request # or customer"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="min-w-[160px]">
        <AppSelect
          placeholder="All types"
          value={type}
          options={[
            { label: 'All types', value: 'ALL' },
            { label: 'Cleaning', value: 'CLEANING' },
            { label: 'IT Support', value: 'IT_SUPPORT' },
          ]}
          onChange={onTypeChange}
        />
      </div>
      <div className="min-w-[160px]">
        <AppSelect
          placeholder="All priorities"
          value={priority}
          options={[
            { label: 'All priorities', value: 'ALL' },
            ...priorityOptions.map((item) => ({
              label: item,
              value: item,
            })),
          ]}
          onChange={onPriorityChange}
        />
      </div>
      <div className="min-w-[160px]">
        <AppSelect
          placeholder="All statuses"
          value={status}
          options={[
            { label: 'All statuses', value: 'ALL' },
            ...statusOptions.map((item) => ({
              label: item.replace(/_/g, ' '),
              value: item,
            })),
          ]}
          onChange={onStatusChange}
        />
      </div>
    </div>
  )
}
