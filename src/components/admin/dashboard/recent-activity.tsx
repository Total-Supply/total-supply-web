'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Activity } from 'lucide-react'

type ActivityItem = {
  id: string
  type: string
  message: string
  time: string
}

type RecentActivityProps = {
  activities: ActivityItem[]
  isLoading: boolean
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 ring-1 ring-purple-500/30">
          <Activity className="h-5 w-5 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-lg bg-muted/50"
            />
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent activity
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/40 p-3 transition-colors hover:bg-card/60"
            >
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </MotionBox>
  )
}
