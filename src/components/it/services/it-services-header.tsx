'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Input } from '@/src/components/ui/input'
import { Calendar, Check, Filter, RefreshCw, Wrench } from 'lucide-react'

type ITServicesHeaderProps = {
  newCount: number
  date: string
  status: string
  priority: string
  onDateChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onRefresh: () => void
  onMarkAllRead: () => void
  isRefreshing: boolean
}

const STATUS_OPTIONS = [
  { label: 'All Services', value: 'ALL' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
]

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: 'ALL' },
  { label: 'Urgent', value: 'URGENT' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
]

export function ITServicesHeader({
  newCount,
  date,
  status,
  priority,
  onDateChange,
  onStatusChange,
  onPriorityChange,
  onRefresh,
  onMarkAllRead,
  isRefreshing,
}: ITServicesHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My IT Services</h1>
            <p className="text-sm text-muted-foreground">
              Assigned IT support jobs and diagnostics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllRead}
              className="relative"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark {newCount} as read
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {newCount}
              </span>
            </Button>
          )}
          <IconActionButton
            icon={RefreshCw}
            label="Refresh services"
            variant="refresh"
            isLoading={isRefreshing}
            onClick={onRefresh}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={status === option.value ? 'solid' : 'outline'}
                colorPalette={status === option.value ? 'blue' : undefined}
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Priority:</span>
            {PRIORITY_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={priority === option.value ? 'solid' : 'outline'}
                colorPalette={priority === option.value ? 'orange' : undefined}
                onClick={() => onPriorityChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-44"
            />
            {date && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDateChange('')}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
