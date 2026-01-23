'use client'

import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useState } from 'react'

import { DeliveryChart } from './delivery-chart'
import { DriverDashboardHeader } from './driver-dashboard-header'
import { DriverDeliveriesPage } from './driver-deliveries-page'
import { DriverStatsOverview } from './driver-stats-overview'
import { PerformanceMetrics } from './performance-metrics'

type DriverStats = {
  deliveriesToday: number
  completedCount: number
  pendingCount: number
  averageDeliveryMinutes: number
  completionRate: number
  averageRating: number | null
  chart: Array<{ date: string; count: number }>
}

export default function DriverDashboardPage() {
  const toast = useToast()
  const [stats, setStats] = useState<DriverStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadStats = async () => {
    try {
      const response = await fetch('/api/staff/driver/stats')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load stats')
      }

      setStats(data.data)
    } catch (error) {
      console.error('Failed to load stats', error)
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

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <DriverDashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {stats && (
        <DriverStatsOverview
          stats={{
            deliveriesToday: stats.deliveriesToday,
            pendingCount: stats.pendingCount,
            completedCount: stats.completedCount,
            completionRate: stats.completionRate,
            averageDeliveryMinutes: stats.averageDeliveryMinutes,
            averageRating: stats.averageRating,
          }}
          isLoading={isLoading}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {stats && (
            <DeliveryChart data={stats.chart || []} isLoading={isLoading} />
          )}
        </div>
        <div>
          {stats && (
            <PerformanceMetrics
              averageDeliveryMinutes={stats.averageDeliveryMinutes}
              averageRating={stats.averageRating}
              completionRate={stats.completionRate}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 shadow-lg overflow-hidden">
        <div className="border-b border-border/60 bg-gradient-to-r from-card/50 to-card/30 px-6 py-4">
          <h2 className="text-lg font-semibold">Delivery Queue</h2>
          <p className="text-sm text-muted-foreground">
            Active and pending deliveries
          </p>
        </div>
        <div className="p-6">
          <DriverDeliveriesPage />
        </div>
      </div>
    </div>
  )
}
