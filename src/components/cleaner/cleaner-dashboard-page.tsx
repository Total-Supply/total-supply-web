'use client'

import { CleanerServicesPage } from '@/src/components/cleaner/cleaner-services-page'
import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@chakra-ui/react'
import Link from 'next/link'

import { useEffect, useMemo, useState } from 'react'

type CleanerStats = {
  completedToday: number
  pendingCount: number
  completedMonth: number
  completionRate: number
  averageRating: number | null
  ratingCount: number
  chart: { date: string; count: number }[]
  topCategories: { name: string; count: number }[]
}

export function CleanerDashboardPage() {
  const [stats, setStats] = useState<CleanerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/staff/cleaner/stats')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load stats')
        }
        setStats(data.data)
      } catch (error) {
        console.error('Failed to load stats', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const chartMax = useMemo(() => {
    if (!stats?.chart?.length) return 1
    return Math.max(...stats.chart.map((entry) => entry.count), 1)
  }, [stats?.chart])

  return (
    <div className="flex flex-col gap-6 p-6 pt-2">
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold">Cleaner dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track cleaning performance and active jobs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/cleaner/services">View services</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/cleaner">Refresh</Link>
          </Button>
        </div>
      </MotionBox>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Completed today"
          value={isLoading ? '...' : String(stats?.completedToday ?? 0)}
          helper="Resolved since midnight"
        />
        <StatCard
          label="Pending"
          value={isLoading ? '...' : String(stats?.pendingCount ?? 0)}
          helper="Assigned or in progress"
        />
        <StatCard
          label="Completed this month"
          value={isLoading ? '...' : String(stats?.completedMonth ?? 0)}
          helper="Rolling 30 days"
        />
        <StatCard
          label="Completion rate"
          value={isLoading ? '...' : `${stats?.completionRate ?? 0}%`}
          helper="Resolved vs assigned"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Services completed (7d)</p>
              <p className="text-xs text-muted-foreground">
                Weekly completed services
              </p>
            </div>
            <Badge variant="subtle">Weekly</Badge>
          </div>
          <div className="mt-4 flex items-end gap-2">
            {(stats?.chart || []).map((entry) => (
              <div
                key={entry.date}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-md bg-primary/70"
                  style={{
                    height: `${Math.max(12, (entry.count / chartMax) * 120)}px`,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {entry.date.slice(5)}
                </span>
              </div>
            ))}
            {(!stats?.chart || stats.chart.length === 0) && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold">Performance</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Average rating</span>
              <span className="font-semibold text-foreground">
                {isLoading
                  ? '...'
                  : stats?.averageRating
                    ? stats.averageRating.toFixed(1)
                    : 'No ratings'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ratings</span>
              <span className="font-semibold text-foreground">
                {isLoading ? '...' : (stats?.ratingCount ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completion rate</span>
              <span className="font-semibold text-foreground">
                {isLoading ? '...' : `${stats?.completionRate ?? 0}%`}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase text-muted-foreground">
                Top categories
              </p>
              <div className="mt-2 space-y-2">
                {(stats?.topCategories || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No data yet.</p>
                ) : (
                  stats?.topCategories.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{entry.name.replace(/_/g, ' ')}</span>
                      <span className="font-semibold text-foreground">
                        {entry.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <CleanerServicesPage />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  )
}
