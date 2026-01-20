'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { Calendar, Filter, Search, Tag } from 'lucide-react'

type AuditFiltersProps = {
  search: string
  entityType: string
  action: string
  fromDate: string
  toDate: string
  onSearchChange: (value: string) => void
  onEntityTypeChange: (value: string) => void
  onActionChange: (value: string) => void
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  entityTypes: string[]
  actions: string[]
}

export function AuditFilters({
  search,
  entityType,
  action,
  fromDate,
  toDate,
  onSearchChange,
  onEntityTypeChange,
  onActionChange,
  onFromDateChange,
  onToDateChange,
  entityTypes,
  actions,
}: AuditFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by actor, IP, or user agent"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={entityType}
          onChange={onEntityTypeChange}
          options={entityTypes.map((type) => ({
            label: type.replace(/_/g, ' '),
            value: type,
          }))}
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={action}
          onChange={onActionChange}
          options={actions.map((act) => ({
            label: act.replace(/_/g, ' '),
            value: act,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 md:col-span-5">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
            placeholder="From date"
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
            placeholder="To date"
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
}
