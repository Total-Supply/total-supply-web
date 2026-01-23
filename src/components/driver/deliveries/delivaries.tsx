'use client'

import { useToast } from '@/src/hooks/use-toast'
import { AlertCircle } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

import { AcceptDeliveryDialog } from './accept-delivery-dialog'
import { ConfirmDeliveryDialog } from './confirm-delivery-dialog'
import { DeliveriesHeader } from './deliveries-header'
import { DeliveryCard } from './delivery-card'

type Delivery = {
  id: number
  orderNumber: string
  status: string
  createdAt: string
  notes?: string | null
  itemsCount: number
  customer: {
    id: number
    name: string
    phone?: string | null
  }
  deliveryAddress: {
    line1: string
    line2?: string | null
    city: string
    postalCode: string
  } | null
}

const STORAGE_KEY = 'total-supply-driver-last-seen'

export default function DeliveriesPage() {
  const toast = useToast()

  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [status, setStatus] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  )

  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 0
  })

  const fetchDeliveries = async () => {
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') params.set('status', status)

      const response = await fetch(
        `/api/staff/driver/deliveries?${params.toString()}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load deliveries')
      }

      setDeliveries(data.data || [])
    } catch (error) {
      toast({
        title: 'Failed to load deliveries',
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
      await fetchDeliveries()
      setIsLoading(false)
    }
    load()
  }, [status])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchDeliveries()
    setIsRefreshing(false)
    toast({
      title: 'Deliveries refreshed',
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
    return deliveries.filter(
      (delivery) => new Date(delivery.createdAt).getTime() > lastSeen,
    ).length
  }, [deliveries, lastSeen])

  const handleAccept = async () => {
    if (!selectedDelivery) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/driver/deliveries/${selectedDelivery.orderNumber}/accept`,
        { method: 'POST' },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to accept delivery')
      }

      toast({
        title: 'Delivery accepted',
        description: 'Customer has been notified of your ETA',
        status: 'success',
        duration: 2500,
      })

      setAcceptDialogOpen(false)
      setSelectedDelivery(null)
      await fetchDeliveries()
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

  const uploadDeliveryPhoto = async (file: File) => {
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

  const handleConfirm = async (data: { photoUrl: string; notes?: string }) => {
    if (!selectedDelivery) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/driver/deliveries/${selectedDelivery.orderNumber}/confirm`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to confirm delivery')
      }

      toast({
        title: 'Delivery confirmed',
        description: 'Great job! Customer has been notified.',
        status: 'success',
        duration: 3000,
      })

      setConfirmDialogOpen(false)
      setSelectedDelivery(null)
      await fetchDeliveries()
    } catch (error) {
      toast({
        title: 'Confirmation failed',
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
      <DeliveriesHeader
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
              className="h-[420px] animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">No deliveries found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {status !== 'ALL'
              ? 'Try adjusting your filters'
              : 'No assigned deliveries yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onAccept={() => {
                setSelectedDelivery(delivery)
                setAcceptDialogOpen(true)
              }}
              onConfirm={() => {
                setSelectedDelivery(delivery)
                setConfirmDialogOpen(true)
              }}
              isLoading={actionLoading}
              isNew={new Date(delivery.createdAt).getTime() > lastSeen}
            />
          ))}
        </div>
      )}

      {selectedDelivery && (
        <AcceptDeliveryDialog
          isOpen={acceptDialogOpen}
          onClose={() => {
            setAcceptDialogOpen(false)
            setSelectedDelivery(null)
          }}
          onConfirm={handleAccept}
          isSubmitting={actionLoading}
          delivery={{
            orderNumber: selectedDelivery.orderNumber,
            customer: selectedDelivery.customer,
            deliveryAddress: selectedDelivery.deliveryAddress,
            itemsCount: selectedDelivery.itemsCount,
          }}
        />
      )}

      <ConfirmDeliveryDialog
        isOpen={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false)
          setSelectedDelivery(null)
        }}
        onSubmit={handleConfirm}
        isSubmitting={actionLoading}
      />
    </div>
  )
}
