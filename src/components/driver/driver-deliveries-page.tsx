'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/ui/collapsible'
import { Input } from '@/src/components/ui/input'
import { Separator } from '@/src/components/ui/separator'
import { Textarea } from '@/src/components/ui/textarea'
import { ChevronDown, MapPin } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

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
  deliveryAddress?: {
    line1: string
    line2?: string | null
    city: string
    postalCode: string
  } | null
}

const STATUS_OPTIONS = ['ALL', 'PREPARING', 'OUT_FOR_DELIVERY']
const STORAGE_KEY = 'total-supply-driver-last-seen'

export function DriverDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [status, setStatus] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [actionMessage, setActionMessage] = useState<Record<number, string>>({})
  const [confirmNotes, setConfirmNotes] = useState<Record<number, string>>({})
  const [confirmFiles, setConfirmFiles] = useState<Record<number, File | null>>(
    {},
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

  const buildMapLink = (delivery: Delivery) => {
    if (!delivery.deliveryAddress) return '#'
    const address = [
      delivery.deliveryAddress.line1,
      delivery.deliveryAddress.line2,
      delivery.deliveryAddress.city,
      delivery.deliveryAddress.postalCode,
    ]
      .filter(Boolean)
      .join(', ')
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
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

  const handleAccept = async (delivery: Delivery) => {
    setActionLoading(delivery.id)
    setActionMessage((prev) => ({ ...prev, [delivery.id]: '' }))
    try {
      const response = await fetch(
        `/api/staff/driver/deliveries/${delivery.orderNumber}/accept`,
        { method: 'POST' },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Accept failed')
      }
      setActionMessage((prev) => ({
        ...prev,
        [delivery.id]: 'Delivery accepted. Head to the customer.',
      }))
      await fetchDeliveries()
    } catch (error) {
      console.error('Failed to accept delivery', error)
      setActionMessage((prev) => ({
        ...prev,
        [delivery.id]: 'Unable to accept this delivery.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[delivery.id]
          return next
        })
      }, 4000)
    }
  }

  const handleConfirm = async (delivery: Delivery) => {
    setActionLoading(delivery.id)
    setActionMessage((prev) => ({ ...prev, [delivery.id]: '' }))
    try {
      const file = confirmFiles[delivery.id]
      if (!file) {
        throw new Error('Upload a delivery photo before confirming.')
      }
      const photoUrl = await uploadDeliveryPhoto(file)
      const response = await fetch(
        `/api/staff/driver/deliveries/${delivery.orderNumber}/confirm`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoUrl,
            notes: confirmNotes[delivery.id]?.trim() || undefined,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Confirm failed')
      }
      setConfirmNotes((prev) => ({ ...prev, [delivery.id]: '' }))
      setConfirmFiles((prev) => ({ ...prev, [delivery.id]: null }))
      setActionMessage((prev) => ({
        ...prev,
        [delivery.id]: 'Delivery confirmed successfully.',
      }))
      await fetchDeliveries()
    } catch (error) {
      console.error('Failed to confirm delivery', error)
      setActionMessage((prev) => ({
        ...prev,
        [delivery.id]:
          error instanceof Error && error.message
            ? error.message
            : 'Unable to confirm delivery.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[delivery.id]
          return next
        })
      }, 4000)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 pt-2">
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold">Deliveries</h1>
          <p className="text-sm text-muted-foreground">
            Orders ready for delivery and in transit.
          </p>
        </div>
        <Button variant="outline" onClick={markSeen}>
          Mark all as read
        </Button>
      </MotionBox>

      <div className="flex flex-wrap items-center gap-3">
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={status === option ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatus(option)}
          >
            {option.replace(/_/g, ' ')}
          </Button>
        ))}
        {newCount > 0 && <Badge variant="secondary">{newCount} new</Badge>}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          Loading deliveries...
        </div>
      ) : deliveries.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          No deliveries assigned yet.
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <Collapsible
              key={delivery.id}
              className="rounded-xl border border-border/60 bg-card"
            >
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between gap-4 p-4 text-left">
                  <div>
                    <p className="text-sm font-semibold">
                      {delivery.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {delivery.customer.name} - {delivery.itemsCount} items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {delivery.status.toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                    {new Date(delivery.createdAt).getTime() > lastSeen && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium">Customer</p>
                      <p className="text-muted-foreground">
                        {delivery.customer.name}
                        {delivery.customer.phone
                          ? ` - ${delivery.customer.phone}`
                          : ''}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Delivery address</p>
                      <p className="text-muted-foreground">
                        {delivery.deliveryAddress?.line1 ||
                          'No address on file'}
                        {delivery.deliveryAddress?.line2
                          ? `, ${delivery.deliveryAddress.line2}`
                          : ''}
                        {delivery.deliveryAddress
                          ? `, ${delivery.deliveryAddress.city} ${delivery.deliveryAddress.postalCode}`
                          : ''}
                      </p>
                    </div>
                    {delivery.notes && (
                      <div>
                        <p className="font-medium">Special notes</p>
                        <p className="text-muted-foreground">
                          {delivery.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-muted-foreground">
                        {new Date(delivery.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-fit"
                    >
                      <a
                        href={buildMapLink(delivery)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Open in Maps
                      </a>
                    </Button>
                    <div className="flex flex-wrap items-center gap-3">
                      {delivery.status === 'PREPARING' ? (
                        <Button
                          size="sm"
                          onClick={() => handleAccept(delivery)}
                          disabled={actionLoading === delivery.id}
                        >
                          Accept Delivery
                        </Button>
                      ) : delivery.status === 'OUT_FOR_DELIVERY' ? (
                        <Button
                          size="sm"
                          onClick={() => handleConfirm(delivery)}
                          disabled={actionLoading === delivery.id}
                        >
                          Confirm Delivery
                        </Button>
                      ) : null}
                      {actionMessage[delivery.id] && (
                        <span className="text-xs text-muted-foreground">
                          {actionMessage[delivery.id]}
                        </span>
                      )}
                    </div>
                  </div>
                  {delivery.status === 'OUT_FOR_DELIVERY' && (
                    <div className="md:col-span-2">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Textarea
                          placeholder="Delivery notes (optional)"
                          value={confirmNotes[delivery.id] || ''}
                          onChange={(event) =>
                            setConfirmNotes((prev) => ({
                              ...prev,
                              [delivery.id]: event.target.value,
                            }))
                          }
                        />
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              setConfirmFiles((prev) => ({
                                ...prev,
                                [delivery.id]: event.target.files?.[0] || null,
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Required photo proof (max 5MB).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  )
}
