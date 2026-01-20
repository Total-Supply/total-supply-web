'use client'

import { DashboardHeader } from '@/src/components/admin/dashboard/dashboard-header'
import { useDashboardMetrics } from '@/src/components/admin/dashboard/dashboard-metrics'
import { DataRetentionCard } from '@/src/components/admin/dashboard/data-retention-card'
import { QuickActions } from '@/src/components/admin/dashboard/quick-actions'
import { RecentActivity } from '@/src/components/admin/dashboard/recent-activity'
import { StatsGrid } from '@/src/components/admin/dashboard/stats-grid'

export default function AdminDashboardPage() {
  const { stats, isLoading, isRefreshing, handleRefresh } =
    useDashboardMetrics()

  // Mock recent activities - replace with real data
  const recentActivities = [
    {
      id: '1',
      type: 'user',
      message: 'New user registration',
      time: '2 minutes ago',
    },
    {
      id: '2',
      type: 'order',
      message: 'Order #1234 completed',
      time: '15 minutes ago',
    },
    {
      id: '3',
      type: 'service',
      message: 'Service request assigned',
      time: '1 hour ago',
    },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <StatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity activities={recentActivities} isLoading={isLoading} />
      </div>

      <DataRetentionCard />
    </div>
  )
}
