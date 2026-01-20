'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { Filter, Search, Shield } from 'lucide-react'

type UserFiltersProps = {
  search: string
  role: string
  status: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
  roleOptions: string[]
  statusOptions: string[]
}

export function UserFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  roleOptions,
  statusOptions,
}: UserFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="relative">
        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <AppSelect
          value={role}
          onChange={onRoleChange}
          options={roleOptions.map((option) => ({
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
