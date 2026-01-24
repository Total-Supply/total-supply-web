'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { useToast } from '@/src/hooks/use-toast'
import { Badge } from '@chakra-ui/react'
import {
  Calendar,
  FileText,
  List,
  RefreshCw,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'

import { useEffect, useMemo, useState } from 'react'

import { ITStatsOverview } from './dash/it-stats-overview'

type ITStats = {
  acceptedToday: number
  inProgressCount: number
  resolvedCount: number
  completionRate: number
  averageRating: number | null
  averageDiagnosisMinutes: number
  chart: Array<{ date: string; count: number }>
}

export default function ITDashboardPage() {
  const toast = useToast()
  const [stats, setStats] = useState<ITStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadStats = async () => {
    try {
      const response = await fetch('/api/staff/it/stats')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load stats')
      }
      setStats(data.data)
    } catch (error) {
      console.error('Failed to load IT stats', error)
      toast({
        title: 'Failed to load statistics',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await loadStats()
      setIsLoading(false)
    }
    load()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadStats()
    setIsRefreshing(false)
    toast({
      title: 'Dashboard refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const chartMax = useMemo(() => {
    if (!stats?.chart?.length) return 1
    return Math.max(...stats.chart.map((entry) => entry.count), 1)
  }, [stats?.chart])

  const totalWeekly = useMemo(() => {
    return stats?.chart.reduce((sum, item) => sum + item.count, 0) || 0
  }, [stats?.chart])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">IT Staff Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track active tickets, progress, and resolution metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it/services">
              <List className="mr-2 h-4 w-4" />
              View Queue
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it/tickets">
              <FileText className="mr-2 h-4 w-4" />
              Tickets
            </Link>
          </Button>
          <IconActionButton
            icon={RefreshCw}
            label="Refresh dashboard"
            variant="refresh"
            isLoading={isRefreshing}
            onClick={handleRefresh}
          />
        </div>
      </MotionBox>

      {stats && (
        <ITStatsOverview
          stats={{
            acceptedToday: stats.acceptedToday,
            inProgressCount: stats.inProgressCount,
            resolvedCount: stats.resolvedCount,
            completionRate: stats.completionRate,
            averageDiagnosisMinutes: stats.averageDiagnosisMinutes,
            averageRating: stats.averageRating,
          }}
          isLoading={isLoading}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Chart */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Weekly Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Tickets resolved this week
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{totalWeekly}</p>
              <p className="text-xs text-muted-foreground">Total resolved</p>
            </div>
          </div>

          {isLoading ? (
            <div className="h-48 animate-pulse rounded-lg bg-muted/50" />
          ) : stats?.chart?.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20">
              <div className="text-center">
                <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No activity data yet
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-end justify-between gap-2">
              {stats?.chart.map((item, index) => (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <div className="relative flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-300 hover:from-blue-400 hover:to-blue-300"
                      style={{
                        height: `${(item.count / chartMax) * 100}%`,
                        minHeight: item.count > 0 ? '8px' : '0',
                      }}
                    >
                      <div className="invisible absolute -top-14 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card p-2 shadow-lg group-hover:visible z-10">
                        <p className="text-xs font-semibold">
                          {formatDate(item.date)}
                        </p>
                        <p className="text-sm font-bold text-blue-400">
                          {item.count} resolved
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {formatDate(item.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </MotionBox>

        {/* Performance Metrics */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="space-y-4">
            {[
              {
                label: 'Avg Diagnosis Time',
                value: isLoading
                  ? '...'
                  : `${stats?.averageDiagnosisMinutes ?? 0} min`,
              },
              {
                label: 'Average Rating',
                value: isLoading
                  ? '...'
                  : stats?.averageRating
                    ? stats.averageRating.toFixed(1)
                    : 'No ratings',
              },
              {
                label: 'Completion Rate',
                value: isLoading ? '...' : `${stats?.completionRate ?? 0}%`,
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3 transition-all duration-200 hover:border-border hover:shadow-sm"
              >
                <span className="text-sm text-muted-foreground">
                  {metric.label}
                </span>
                {isLoading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-muted/50" />
                ) : (
                  <span className="text-sm font-bold tabular-nums">
                    {metric.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </MotionBox>
      </div>

      {/* Ticket Workspace */}
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Ticket Workspace
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Organize diagnostics and follow-ups in one place
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it/tickets">Open Tickets</Link>
          </Button>
        </div>
      </MotionBox>
    </div>
  )
}
