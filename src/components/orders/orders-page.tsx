'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { OrderCard } from '@/src/components/orders/order-card'
import { OrderFilters } from '@/src/components/orders/order-filters'
import { OrderStats } from '@/src/components/orders/order-stats'
import { OrdersEmptyState } from '@/src/components/orders/orders-empty-state'
import { OrdersHeader } from '@/src/components/orders/orders-header'
import { OrdersPagination } from '@/src/components/orders/orders-pagination'
import {
  OrdersCardSkeleton,
  OrdersTableSkeleton,
} from '@/src/components/orders/orders-skeleton'
import { OrdersTable } from '@/src/components/orders/orders-table'
import { useToast } from '@/src/hooks/use-toast'
import { Container, Stack, useBreakpointValue } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

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

export function OrdersPage() {
  const router = useRouter()
  const toast = useToast()
  const searchParams = useSearchParams()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const statusParam = searchParams.get('status') || 'ALL'
  const searchParam = searchParams.get('search') || ''
  const fromParam = searchParams.get('fromDate') || ''
  const toParam = searchParams.get('toDate') || ''
  const pageParam = Number(searchParams.get('page') || 1)

  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState(statusParam)
  const [searchValue, setSearchValue] = useState(searchParam)
  const [fromDate, setFromDate] = useState(fromParam)
  const [toDate, setToDate] = useState(toParam)
  const [page, setPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)

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

  useEffect(() => {
    setStatusFilter(statusParam)
    setSearchValue(searchParam)
    setFromDate(fromParam)
    setToDate(toParam)
    setPage(pageParam)
  }, [statusParam, searchParam, fromParam, toParam, pageParam])

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter && statusFilter !== 'ALL') {
      params.set('status', statusFilter)
    }
    if (searchValue) {
      params.set('search', searchValue)
    }
    if (fromDate) {
      params.set('fromDate', fromDate)
    }
    if (toDate) {
      params.set('toDate', toDate)
    }
    if (page > 1) {
      params.set('page', String(page))
    }
    const query = params.toString()
    router.replace(query ? `/orders?${query}` : '/orders')
  }, [statusFilter, searchValue, fromDate, toDate, page, router])

  const loadOrders = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams()
      if (statusParam && statusParam !== 'ALL') {
        params.set('status', statusParam)
      }
      if (searchParam) {
        params.set('search', searchParam)
      }
      if (fromParam) {
        params.set('fromDate', fromParam)
      }
      if (toParam) {
        params.set('toDate', toParam)
      }
      params.set('page', String(pageParam))
      params.set('limit', '10')

      const response = await fetch(`/api/orders?${params.toString()}`)
      const data = (await response.json()) as OrdersResponse
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      setOrders(data.data || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load orders',
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
    loadOrders()
  }, [statusParam, searchParam, fromParam, toParam, pageParam])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadOrders(false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Orders refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleView = (orderNumber: string) => {
    router.push(`/orders/${orderNumber}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleFromDateChange = (value: string) => {
    setFromDate(value)
    setPage(1)
  }

  const handleToDateChange = (value: string) => {
    setToDate(value)
    setPage(1)
  }

  const emptyState = !isLoading && orders.length === 0

  return (
    <Stack gap={10}>
      <BackgroundGradient height="240px" />
      <Container maxW="container.xl" pt={{ base: 8, md: 12 }} pb={16}>
        <Stack gap={6}>
          <OrdersHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

          {!isLoading && !emptyState && (
            <OrderStats stats={orderStats} isLoading={isLoading} />
          )}

          <OrderFilters
            searchValue={searchValue}
            statusFilter={statusFilter}
            fromDate={fromDate}
            toDate={toDate}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onFromDateChange={handleFromDateChange}
            onToDateChange={handleToDateChange}
            statusOptions={STATUS_FILTERS}
          />

          {isLoading ? (
            isMobile ? (
              <OrdersCardSkeleton />
            ) : (
              <OrdersTableSkeleton />
            )
          ) : emptyState ? (
            <OrdersEmptyState hasFilters={hasFilters} />
          ) : isMobile ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={handleView}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <OrdersTable orders={orders} onView={handleView} />
          )}

          {!emptyState && !isLoading && (
            <OrdersPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </Stack>
      </Container>
    </Stack>
  )
}
