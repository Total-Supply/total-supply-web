'use client'

import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useState } from 'react'

type DashboardStats = {
  totalUsers: number
  totalOrders: number
  totalServices: number
}

export function useDashboardMetrics() {
  const toast = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalServices: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadStats = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }

    try {
      // Fetch dashboard stats from API
      const [usersRes, ordersRes, servicesRes] = await Promise.all([
        fetch('/api/admin/users?limit=1'),
        fetch('/api/admin/orders?limit=1'),
        fetch('/api/admin/services/offerings?limit=1'),
      ])

      const [usersData, ordersData, servicesData] = await Promise.all([
        usersRes.json(),
        ordersRes.json(),
        servicesRes.json(),
      ])

      setStats({
        totalUsers: usersData.meta?.total || 0,
        totalOrders: ordersData.meta?.total || 0,
        totalServices: servicesData.meta?.total || 0,
      })
    } catch (error) {
      toast({
        title: 'Failed to load dashboard stats',
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
    loadStats()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadStats(false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Dashboard refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  return {
    stats,
    isLoading,
    isRefreshing,
    handleRefresh,
  }
}
