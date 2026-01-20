'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { AlertCircle, Filter, Search, Tag } from 'lucide-react'

type ServiceFiltersProps = {
  search: string
  type: string
  priority: string
  status: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onStatusChange: (value: string) => void
  typeOptions: string[]
  priorityOptions: string[]
  statusOptions: string[]
}

export function ServiceFilters({
  search,
  type,
  priority,
  status,
  onSearchChange,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  typeOptions,
  priorityOptions,
  statusOptions,
}: ServiceFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search request number"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={type}
          onChange={onTypeChange}
          options={typeOptions.map((option) => ({
            label: option.replace(/_/g, ' '),
            value: option,
          }))}
        />
      </div>

      <div className="relative">
        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={priority}
          onChange={onPriorityChange}
          options={priorityOptions.map((option) => ({
            label: option.replace(/_/g, ' '),
            value: option,
          }))}
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={status}
          onChange={onStatusChange}
          options={statusOptions.map((option) => ({
            label: option.replace(/_/g, ' '),
            value: option,
          }))}
        />
      </div>
    </div>
  )
}
