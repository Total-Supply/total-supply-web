'use client'

import { useToast } from '@/src/hooks/use-toast'
import { AlertCircle } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

import { AcceptOrderDialog } from './dash/accept-order-dialog'
import { DeclineOrderDialog } from './dash/decline-order-dialog'
import { OrderCard } from './dash/order-card'
import { OrdersHeader } from './dash/orders-header'
import { PrepareOrderDialog } from './dash/prepare-order-dialog'

type SalesmanOrder = {
  id: number
  orderNumber: string
  status: string
  createdAt: string
  notes?: string | null
  customer: {
    id: number
    name: string
    phone?: string | null
    email: string
  }
  deliveryAddress?: {
    line1: string
    line2?: string | null
    city: string
    postalCode: string
  } | null
  items: Array<{
    id: number
    quantity: number
    unitPrice: number
    foodItem: {
      id: number
      name: string
    }
  }>
}

const STORAGE_KEY = 'total-supply-salesman-last-seen'

export default function SalesmanOrdersPage() {
  const toast = useToast()

  const [orders, setOrders] = useState<SalesmanOrder[]>([])
  const [status, setStatus] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false)
  const [prepareDialogOpen, setPrepareDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<SalesmanOrder | null>(null)

  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 0
  })

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') params.set('status', status)

      const response = await fetch(
        `/api/staff/salesman/orders?${params.toString()}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load orders')
      }

      setOrders(data.data || [])
    } catch (error) {
      toast({
        title: 'Failed to load orders',
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
      await fetchOrders()
      setIsLoading(false)
    }
    load()
  }, [status])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchOrders()
    setIsRefreshing(false)
    toast({
      title: 'Orders refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const markAllSeen = () => {
    const latestTime = Date.now()
    setLastSeen(latestTime)
    window.localStorage.setItem(STORAGE_KEY, String(latestTime))
    toast({
      title: 'All marked as read',
      status: 'success',
      duration: 2000,
    })
  }

  const newCount = useMemo(() => {
    if (!lastSeen) return 0
    return orders.filter(
      (order) => new Date(order.createdAt).getTime() > lastSeen,
    ).length
  }, [orders, lastSeen])

  const uploadPreparationPhoto = async (file: File) => {
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: safeFilename,
        contentType: file.type,
        fileSize: file.size,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload initialization failed')
    }
    const uploadResponse = await fetch(data.data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    if (!uploadResponse.ok) {
      throw new Error('Image upload failed')
    }
    return data.data.publicUrl as string
  }

  const handleAccept = async () => {
    if (!selectedOrder) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/salesman/orders/${selectedOrder.orderNumber}/accept`,
        { method: 'POST' },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to accept order')
      }

      toast({
        title: 'Order accepted',
        description: 'Start preparing when ready',
        status: 'success',
        duration: 2500,
      })

      setAcceptDialogOpen(false)
      setSelectedOrder(null)
      await fetchOrders()
    } catch (error) {
      toast({
        title: 'Action failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handlePrepare = async (data: { notes?: string; photoUrl?: string }) => {
    if (!selectedOrder) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/salesman/orders/${selectedOrder.orderNumber}/prepare`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to update order')
      }

      toast({
        title: 'Order marked as preparing',
        description: 'Customer has been notified',
        status: 'success',
        duration: 2500,
      })

      setPrepareDialogOpen(false)
      setSelectedOrder(null)
      await fetchOrders()
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDecline = async (data: {
    reason: string
    notes?: string
    notifyCustomer: boolean
  }) => {
    if (!selectedOrder) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/salesman/orders/${selectedOrder.orderNumber}/decline`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to decline order')
      }

      toast({
        title: 'Order declined',
        description: 'Order has been reassigned',
        status: 'success',
        duration: 2500,
      })

      setDeclineDialogOpen(false)
      setSelectedOrder(null)
      await fetchOrders()
    } catch (error) {
      toast({
        title: 'Decline failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <OrdersHeader
        newCount={newCount}
        status={status}
        onStatusChange={setStatus}
        onRefresh={handleRefresh}
        onMarkAllRead={markAllSeen}
        isRefreshing={isRefreshing}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[520px] animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {status !== 'ALL' ? 'Try adjusting your filters' : 'All caught up!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                createdAt: order.createdAt,
                notes: order.notes,
                customer: {
                  name: order.customer.name,
                  phone: order.customer.phone,
                },
                deliveryAddress: order.deliveryAddress
                  ? {
                      line1: order.deliveryAddress.line1,
                      city: order.deliveryAddress.city,
                    }
                  : null,
                items: order.items.map((item) => ({
                  id: item.id,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  foodItem: {
                    id: item.foodItem.id,
                    name: item.foodItem.name,
                  },
                })),
              }}
              onAccept={() => {
                setSelectedOrder(order)
                setAcceptDialogOpen(true)
              }}
              onPrepare={() => {
                setSelectedOrder(order)
                setPrepareDialogOpen(true)
              }}
              onDecline={() => {
                setSelectedOrder(order)
                setDeclineDialogOpen(true)
              }}
              isLoading={actionLoading}
              isNew={new Date(order.createdAt).getTime() > lastSeen}
            />
          ))}
        </div>
      )}

      {selectedOrder && (
        <>
          <AcceptOrderDialog
            isOpen={acceptDialogOpen}
            onClose={() => {
              setAcceptDialogOpen(false)
              setSelectedOrder(null)
            }}
            onConfirm={handleAccept}
            isSubmitting={actionLoading}
            order={{
              orderNumber: selectedOrder.orderNumber,
              customer: selectedOrder.customer,
              deliveryAddress: selectedOrder.deliveryAddress ?? null,
              items: selectedOrder.items,
            }}
          />

          <DeclineOrderDialog
            isOpen={declineDialogOpen}
            onClose={() => {
              setDeclineDialogOpen(false)
              setSelectedOrder(null)
            }}
            onSubmit={handleDecline}
            isSubmitting={actionLoading}
            orderNumber={selectedOrder.orderNumber}
          />

          <PrepareOrderDialog
            isOpen={prepareDialogOpen}
            onClose={() => {
              setPrepareDialogOpen(false)
              setSelectedOrder(null)
            }}
            onSubmit={handlePrepare}
            isSubmitting={actionLoading}
            orderNumber={selectedOrder.orderNumber}
          />
        </>
      )}
    </div>
  )
}
