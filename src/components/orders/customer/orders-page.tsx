'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { OrderStatusBadge } from './order-status-badge'

type OrderSummary = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
}

type OrdersResponse = {
  data: OrderSummary[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const STATUS_FILTERS = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELED',
]

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-500/20 text-amber-400 ring-amber-500/40',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-blue-500/20 text-blue-400 ring-blue-500/40',
    icon: CheckCircle2,
  },
  PREPARING: {
    label: 'Preparing',
    color: 'bg-purple-500/20 text-purple-400 ring-purple-500/40',
    icon: Package,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'bg-cyan-500/20 text-cyan-400 ring-cyan-500/40',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/40',
    icon: CheckCircle2,
  },
  CANCELED: {
    label: 'Canceled',
    color: 'bg-red-500/20 text-red-400 ring-red-500/40',
    icon: AlertCircle,
  },
}

export function OrdersPageEnhanced() {
  const router = useRouter()
  const toast = useToast()
  const searchParams = useSearchParams()

  // URL params
  const statusParam = searchParams.get('status') || 'ALL'
  const searchParam = searchParams.get('search') || ''
  const fromParam = searchParams.get('fromDate') || ''
  const toParam = searchParams.get('toDate') || ''
  const pageParam = Number(searchParams.get('page')) || 1

  // State
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState(statusParam)
  const [searchValue, setSearchValue] = useState(searchParam)
  const [fromDate, setFromDate] = useState(fromParam)
  const [toDate, setToDate] = useState(toParam)
  const [page, setPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Stats
  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      inProgress: orders.filter((o) =>
        ['ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status),
      ).length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    }
  }, [orders])

  const hasFilters =
    statusFilter !== 'ALL' ||
    Boolean(searchValue) ||
    Boolean(fromDate) ||
    Boolean(toDate)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter && statusFilter !== 'ALL')
      params.set('status', statusFilter)
    if (searchValue) params.set('search', searchValue)
    if (fromDate) params.set('fromDate', fromDate)
    if (toDate) params.set('toDate', toDate)
    if (page !== 1) params.set('page', String(page))

    const query = params.toString()
    router.replace(query ? `/orders?${query}` : '/orders')
  }, [statusFilter, searchValue, fromDate, toDate, page, router])

  // Load orders
  const loadOrders = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'ALL')
        params.set('status', statusFilter)
      if (searchValue) params.set('search', searchValue)
      if (fromDate) params.set('fromDate', fromDate)
      if (toDate) params.set('toDate', toDate)
      params.set('page', String(page))
      params.set('limit', '12')

      const response = await fetch(`/api/orders?${params.toString()}`)
      const data = (await response.json()) as OrdersResponse

      if (!response.ok) {
        throw new Error(
          (data as unknown as { error?: { message?: string } }).error
            ?.message || 'Failed to load orders',
        )
      }

      setOrders(data.data)
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load orders',
        status: 'error',
        duration: 2500,
      })
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter, searchValue, fromDate, toDate, page])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadOrders(false)
    setIsRefreshing(false)
    toast({
      title: 'Orders refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleClearFilters = () => {
    setStatusFilter('ALL')
    setSearchValue('')
    setFromDate('')
    setToDate('')
    setPage(1)
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'ALL')
        params.set('status', statusFilter)
      if (fromDate) params.set('fromDate', fromDate)
      if (toDate) params.set('toDate', toDate)

      const response = await fetch(`/api/orders/export?${params.toString()}`)
      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Export successful',
        description: 'Your orders have been downloaded',
        status: 'success',
        duration: 2500,
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Unable to export orders',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const emptyState = !isLoading && orders.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track and manage your orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={orders.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {!isLoading && orders.length > 0 && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: 'Total Orders',
                  value: orderStats.total,
                  icon: ShoppingBag,
                  color:
                    'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
                },
                {
                  label: 'Pending',
                  value: orderStats.pending,
                  icon: Clock,
                  color:
                    'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
                },
                {
                  label: 'In Progress',
                  value: orderStats.inProgress,
                  icon: Truck,
                  color:
                    'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
                },
                {
                  label: 'Delivered',
                  value: orderStats.delivered,
                  icon: CheckCircle2,
                  color:
                    'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
                },
              ].map((stat, index) => (
                <MotionBox
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </MotionBox>
              ))}
            </div>
          )}
        </MotionBox>

        {/* Filters */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6"
        >
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <AppSelect
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value)
                    setPage(1)
                  }}
                  options={STATUS_FILTERS.map((status) => ({
                    label: status.replace(/_/g, ' '),
                    value: status,
                  }))}
                />
              </div>

              {/* Date From */}
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value)
                  setPage(1)
                }}
                placeholder="From date"
              />

              {/* Date To */}
              <Input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value)
                  setPage(1)
                }}
                placeholder="To date"
              />
            </div>

            {hasFilters && (
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                <p className="text-sm text-muted-foreground">
                  {orders.length} result{orders.length !== 1 ? 's' : ''} found
                </p>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </MotionBox>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-gradient-to-br from-card/90 to-card/60 border border-border/60"
              />
            ))}
          </div>
        ) : emptyState ? (
          /* Empty State */
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {hasFilters ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                {hasFilters
                  ? "Try adjusting your filters to find what you're looking for."
                  : 'Start shopping to place your first order and track it here.'}
              </p>
              {hasFilters ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  colorPalette="primary"
                  onClick={() => router.push('/shop')}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              )}
            </div>
          </MotionBox>
        ) : (
          <>
            {/* Orders Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {orders.map((order, index) => (
                <MotionBox
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => router.push(`/orders/${order.orderNumber}`)}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1 cursor-pointer"
                >
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-2xl" />

                  <div className="relative space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Order Number
                          </p>
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} size="sm" />
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          LKR{' '}
                          {Number(order.totalPrice).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-primary/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/orders/${order.orderNumber}`)
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-2" />
                      View Details
                    </Button>
                  </div>
                </MotionBox>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <span className="text-sm font-medium text-muted-foreground">
                    Page <span className="text-foreground">{page}</span> of{' '}
                    <span className="text-foreground">{totalPages}</span>
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </MotionBox>
            )}
          </>
        )}
      </div>
    </div>
  )
}
