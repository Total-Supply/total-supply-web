'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { AlertCircle, Filter } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

import { AcceptDeliveryDialog } from '../deliveries/accept-delivery-dialog'
import { ConfirmDeliveryDialog } from '../deliveries/confirm-delivery-dialog'
import { DeliveryCard } from '../deliveries/delivery-card'

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

const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Preparing', value: 'PREPARING' },
  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
]
const STORAGE_KEY = 'total-supply-driver-last-seen'

export function DriverDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [status, setStatus] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
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
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') {
        params.set('status', status)
      }
      const response = await fetch(
        `/api/staff/driver/deliveries?${params.toString()}`,
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load deliveries')
      }
      setDeliveries(data.data || [])
    } catch (error) {
      console.error('Failed to load deliveries', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [status])

  useEffect(() => {
    const interval = setInterval(fetchDeliveries, 15000)
    return () => clearInterval(interval)
  }, [status])

  const newCount = useMemo(() => {
    if (!lastSeen) return 0
    return deliveries.filter(
      (order) => new Date(order.createdAt).getTime() > lastSeen,
    ).length
  }, [deliveries, lastSeen])

  const markSeen = () => {
    const latest = deliveries[0]?.createdAt
    const latestTime = latest ? new Date(latest).getTime() : Date.now()
    setLastSeen(latestTime)
    window.localStorage.setItem(STORAGE_KEY, String(latestTime))
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
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })
    if (!uploadResponse.ok) {
      throw new Error('Image upload failed')
    }
    return data.data.publicUrl as string
  }

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
        throw new Error(data.error?.message || 'Accept failed')
      }
      setAcceptDialogOpen(false)
      setSelectedDelivery(null)
      await fetchDeliveries()
    } catch (error) {
      console.error('Failed to accept delivery', error)
    } finally {
      setActionLoading(false)
    }
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
      if (!result.ok) {
        throw new Error(result.error?.message || 'Confirm failed')
      }
      setConfirmDialogOpen(false)
      setSelectedDelivery(null)
      await fetchDeliveries()
    } catch (error) {
      console.error('Failed to confirm delivery', error)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold">Active Deliveries</h2>
          <p className="text-sm text-muted-foreground">
            Orders ready for delivery and in transit
          </p>
        </div>
        {newCount > 0 && (
          <Button variant="outline" size="sm" onClick={markSeen}>
            Mark all as read
          </Button>
        )}
      </MotionBox>

      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={status === option.value ? 'solid' : 'outline'}
                colorPalette={status === option.value ? 'blue' : undefined}
                size="sm"
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {newCount > 0 && (
            <Badge colorPalette="green" variant="subtle">
              {newCount} new
            </Badge>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[420px] animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 mb-3">
            <AlertCircle className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold">No deliveries found</p>
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
        <>
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

          <ConfirmDeliveryDialog
            isOpen={confirmDialogOpen}
            onClose={() => {
              setConfirmDialogOpen(false)
              setSelectedDelivery(null)
            }}
            onSubmit={handleConfirm}
            isSubmitting={actionLoading}
          />
        </>
      )}
    </div>
  )
}
