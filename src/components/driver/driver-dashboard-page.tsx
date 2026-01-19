'use client'

import { DriverDeliveriesPage } from '@/src/components/driver/driver-deliveries-page'
import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@chakra-ui/react'
import Link from 'next/link'

import { useEffect, useMemo, useState } from 'react'

type DriverStats = {
  deliveriesToday: number
  completedCount: number
  pendingCount: number
  averageDeliveryMinutes: number
  completionRate: number
  averageRating: number | null
  chart: { date: string; count: number }[]
}

export function DriverDashboardPage() {
  const [stats, setStats] = useState<DriverStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/staff/driver/stats')
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
    <div className="flex flex-col gap-6 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold">Driver dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor deliveries and confirm handoffs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/driver/deliveries">View queue</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/driver">Refresh</Link>
          </Button>
        </div>
      </MotionBox>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Deliveries today"
          value={isLoading ? '...' : String(stats?.deliveriesToday ?? 0)}
          helper="Out for delivery since midnight"
        />
        <StatCard
          label="Pending"
          value={isLoading ? '...' : String(stats?.pendingCount ?? 0)}
          helper="Orders awaiting handoff"
        />
        <StatCard
          label="Completed"
          value={isLoading ? '...' : String(stats?.completedCount ?? 0)}
          helper="Delivered orders"
        />
        <StatCard
          label="Completion rate"
          value={isLoading ? '...' : `${stats?.completionRate ?? 0}%`}
          helper="Delivered vs accepted"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Deliveries completed (7d)</p>
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
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold">Performance</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Avg delivery time</span>
              <span className="font-semibold text-foreground">
                {isLoading
                  ? '...'
                  : `${stats?.averageDeliveryMinutes ?? 0} min`}
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

      <div className="rounded-xl border border-border/60 bg-card shadow-sm">
        <DriverDeliveriesPage />
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
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  )
}
