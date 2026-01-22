'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { Filter, Search } from 'lucide-react'

type OrderFiltersProps = {
  searchValue: string
  statusFilter: string
  fromDate: string
  toDate: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  statusOptions: string[]
}

export function OrderFilters({
  searchValue,
  statusFilter,
  fromDate,
  toDate,
  onSearchChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  statusOptions,
}: OrderFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={statusFilter}
          onChange={onStatusChange}
          options={statusOptions.map((status) => ({
            label: status.replace(/_/g, ' '),
            value: status,
          }))}
        />
      </div>

      <Input
        type="date"
        value={fromDate}
        onChange={(event) => onFromDateChange(event.target.value)}
        placeholder="From date"
      />

      <Input
        type="date"
        value={toDate}
        onChange={(event) => onToDateChange(event.target.value)}
        placeholder="To date"
      />
    </div>
  )
}
