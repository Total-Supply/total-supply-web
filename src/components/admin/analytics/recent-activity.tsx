'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Activity, Clock, User } from 'lucide-react'

import { ActionBadge } from '../audit/action-badge'
import { EntityBadge } from '../audit/entity-badge'

type RecentActivityProps = {
  activities: Array<{
    id: number
    entityType: string
    entityId: number
    action: string
    actor: {
      id: number
      name: string
      email: string
      role: string
    } | null
    createdAt: string
  }>
  isLoading: boolean
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest system actions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-muted/50"
            />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          No recent activity
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    {activity.actor?.name || 'System'}
                  </p>
                  <ActionBadge action={activity.action} size="sm" />
                  <EntityBadge entityType={activity.entityType} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.actor?.email || 'system@totalsupply.com'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(activity.createdAt)}</span>
                  <span>·</span>
                  <span className="font-mono">ID: {activity.entityId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MotionBox>
  )
}
