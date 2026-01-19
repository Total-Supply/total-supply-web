'use client'

import { ITServicesPage } from '@/src/components/it/it-services-page'
import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@chakra-ui/react'
import Link from 'next/link'

import { useEffect, useMemo, useState } from 'react'

type ITStats = {
  acceptedToday: number
  inProgressCount: number
  resolvedCount: number
  completionRate: number
  averageRating: number | null
  averageDiagnosisMinutes: number
  chart: { date: string; count: number }[]
}

export function ITDashboardPage() {
  const [stats, setStats] = useState<ITStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/staff/it/stats')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load stats')
        }
        setStats(data.data)
      } catch (error) {
        console.error('Failed to load IT stats', error)
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
          <h1 className="text-2xl font-semibold">IT staff dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track active tickets, progress, and resolution metrics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it/services">View queue</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it/tickets">Tickets</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/it">Refresh</Link>
          </Button>
        </div>
      </MotionBox>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Accepted today"
          value={isLoading ? '...' : String(stats?.acceptedToday ?? 0)}
          helper="Assignments accepted today"
        />
        <StatCard
          label="In progress"
          value={isLoading ? '...' : String(stats?.inProgressCount ?? 0)}
          helper="Active IT tickets"
        />
        <StatCard
          label="Resolved"
          value={isLoading ? '...' : String(stats?.resolvedCount ?? 0)}
          helper="Tickets completed"
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
              <p className="text-sm font-semibold">Tickets resolved (7d)</p>
              <p className="text-xs text-muted-foreground">
                Rolling week performance
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
              <span>Avg diagnosis time</span>
              <span className="font-semibold text-foreground">
                {isLoading
                  ? '...'
                  : `${stats?.averageDiagnosisMinutes ?? 0} min`}
              </span>
            </div>
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
              <span>Completion rate</span>
              <span className="font-semibold text-foreground">
                {isLoading ? '...' : `${stats?.completionRate ?? 0}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <ITServicesPage />
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Ticket workspace</p>
            <p className="text-xs text-muted-foreground">
              Organize diagnostics and follow-ups in one place.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it/tickets">Open tickets</Link>
          </Button>
        </div>
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
