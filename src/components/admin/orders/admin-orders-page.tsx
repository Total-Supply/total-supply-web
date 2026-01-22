'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { OrderStats } from '@/src/components/admin/orders/order-stats'
import { OrdersFilters } from '@/src/components/admin/orders/orders-filters'
import { OrdersHeader } from '@/src/components/admin/orders/orders-header'
import { OrdersTable } from '@/src/components/admin/orders/orders-table'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useMemo, useState } from 'react'

type AdminOrder = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
}

type OrdersResponse = {
  data: AdminOrder[]
  meta?: {
    page: number
    totalPages: number
  }
}

const STATUS_OPTIONS = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELED',
]

export function AdminOrdersPage() {
  const toast = useToast()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((entry) => ({
        label: entry.replace(/_/g, ' '),
        value: entry,
      })),
    [],
  )

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      delivering: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    }
  }, [orders])

  const loadOrders = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      })
      if (status !== 'ALL') {
        params.set('status', status)
      }
      if (search) {
        params.set('search', search)
      }
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
  }, [page, search, status])

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

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <OrdersHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <OrderStats stats={orderStats} isLoading={isLoading} />

      <AdminTableShell
        className="max-w-full"
        title=""
        actions={
          <OrdersFilters
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            statusOptions={STATUS_OPTIONS}
          />
        }
      >
        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          statusOptions={statusOptions}
        />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </AdminTableShell>
    </div>
  )
}
