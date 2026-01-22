'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Input } from '@/src/components/ui/input'
import { Calendar, Filter, RefreshCw, Sparkles } from 'lucide-react'

type CleanerHeaderProps = {
  date: string
  status: string
  onDateChange: (value: string) => void
  onStatusChange: (value: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

const statusOptions = [
  { label: 'All Services', value: '' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
]

export function CleanerHeader({
  date,
  status,
  onDateChange,
  onStatusChange,
  onRefresh,
  isRefreshing,
}: CleanerHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Cleaning Services
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your assigned cleaning tasks
            </p>
          </div>
        </div>
        <IconActionButton
          icon={RefreshCw}
          label="Refresh services"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            placeholder="Filter by date"
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <AppSelect
            value={status}
            onChange={onStatusChange}
            options={statusOptions}
          />
        </div>
      </div>
    </MotionBox>
  )
}
