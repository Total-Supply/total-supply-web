'use client'

import { AnalyticsHeader } from '@/src/components/admin/analytics/analytics-header'
import { OrdersDistribution } from '@/src/components/admin/analytics/orders-distribution'
import { OverviewStats } from '@/src/components/admin/analytics/overview-stats'
import { RecentActivity } from '@/src/components/admin/analytics/recent-activity'
import { RevenueChart } from '@/src/components/admin/analytics/revenue-chart'
import { TopProducts } from '@/src/components/admin/analytics/top-products'
import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useState } from 'react'

type AnalyticsData = {
  overview: {
    totalUsers: number
    activeUsers: number
    pendingUsers: number
    suspendedUsers: number
    customerCount: number
    staffCount: number
    totalOrders: number
    pendingOrders: number
    deliveredOrders: number
    canceledOrders: number
    totalRevenue: number
    totalServiceRequests: number
    receivedServiceRequests: number
    resolvedServiceRequests: number
    canceledServiceRequests: number
    cleaningServices: number
    itServices: number
    totalMessages: number
    openMessages: number
    resolvedMessages: number
  }
  topProducts: Array<{
    id: number
    name: string
    price: number
    totalSold: number
    orderCount: number
  }>
  ordersByStatus: Array<{ status: string; count: number }>
  servicesByType: Array<{ type: string; count: number }>
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>
  dailyUsers: Array<{ date: string; count: number }>
  recentActivity: Array<{
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
}

type ApiResponse = {
  success: boolean
  data: AnalyticsData
  error?: {
    message: string
  }
}

export default function AnalyticsPage() {
  const toast = useToast()

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadAnalytics = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams()
      if (fromDate) params.set('fromDate', fromDate)
      if (toDate) params.set('toDate', toDate)

      const response = await fetch(`/api/admin/analytics?${params.toString()}`)
      const result = (await response.json()) as ApiResponse
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to load analytics')
      }
      setData(result.data)
    } catch (error) {
      toast({
        title: 'Failed to load analytics',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [fromDate, toDate])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadAnalytics(false)
    setIsRefreshing(false)
    toast({
      title: 'Analytics refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleExport = async () => {
    try {
      // Export analytics as CSV
      const csvContent = generateCSV(data)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `analytics-report-${new Date().toISOString()}.csv`
      anchor.click()
      URL.revokeObjectURL(url)

      toast({
        title: 'Report exported',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const generateCSV = (analyticsData: AnalyticsData | null) => {
    if (!analyticsData) return ''

    const rows = [
      ['Total Supply Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Overview Metrics'],
      ['Total Users', analyticsData.overview.totalUsers],
      ['Active Users', analyticsData.overview.activeUsers],
      ['Total Orders', analyticsData.overview.totalOrders],
      ['Delivered Orders', analyticsData.overview.deliveredOrders],
      ['Total Revenue (LKR)', analyticsData.overview.totalRevenue],
      ['Service Requests', analyticsData.overview.totalServiceRequests],
      ['Resolved Services', analyticsData.overview.resolvedServiceRequests],
      ['Open Messages', analyticsData.overview.openMessages],
    ]

    return rows.map((row) => row.join(',')).join('\n')
  }

  if (!data) {
    return (
      <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <div className="h-96 animate-pulse rounded-2xl bg-muted/50" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <AnalyticsHeader
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onRefresh={handleRefresh}
        onExport={handleExport}
        isRefreshing={isRefreshing}
      />

      <OverviewStats stats={data.overview} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={data.dailyRevenue} isLoading={isLoading} />
        <OrdersDistribution data={data.ordersByStatus} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProducts products={data.topProducts} isLoading={isLoading} />
        <RecentActivity
          activities={data.recentActivity}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
