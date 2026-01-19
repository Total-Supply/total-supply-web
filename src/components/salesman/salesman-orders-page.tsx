'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/ui/collapsible'
import { Input } from '@/src/components/ui/input'
import { Separator } from '@/src/components/ui/separator'
import { Badge, Label, Textarea } from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

type OrderItem = {
  id: number
  quantity: number
  unitPrice: number
  foodItem: {
    id: number
    name: string
  }
}

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
  items: OrderItem[]
}

const STATUS_OPTIONS = ['ALL', 'PENDING', 'ACCEPTED', 'PREPARING']
const DECLINE_REASONS = ['Out of stock', 'Not enough time', 'Other'] as const
const STORAGE_KEY = 'total-supply-salesman-last-seen'

export function SalesmanOrdersPage() {
  const [orders, setOrders] = useState<SalesmanOrder[]>([])
  const [status, setStatus] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [actionMessage, setActionMessage] = useState<Record<number, string>>({})
  const [prepareNotes, setPrepareNotes] = useState<Record<number, string>>({})
  const [prepareFiles, setPrepareFiles] = useState<Record<number, File | null>>(
    {},
  )
  const [declineReasons, setDeclineReasons] = useState<Record<number, string>>(
    {},
  )
  const [declineNotes, setDeclineNotes] = useState<Record<number, string>>({})
  const [declineNotify, setDeclineNotify] = useState<Record<number, boolean>>(
    {},
  )
  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 0
  })

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') {
        params.set('status', status)
      }
      const response = await fetch(
        `/api/staff/salesman/orders?${params.toString()}`,
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load orders')
      }
      setOrders(data.data || [])
    } catch (error) {
      console.error('Failed to load orders', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [status])

  useEffect(() => {
    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [status])

  const newCount = useMemo(() => {
    if (!lastSeen) return 0
    return orders.filter(
      (order) => new Date(order.createdAt).getTime() > lastSeen,
    ).length
  }, [orders, lastSeen])

  const markSeen = () => {
    const latest = orders[0]?.createdAt
    const latestTime = latest ? new Date(latest).getTime() : Date.now()
    setLastSeen(latestTime)
    window.localStorage.setItem(STORAGE_KEY, String(latestTime))
  }

  const handleAccept = async (order: SalesmanOrder) => {
    setActionLoading(order.id)
    setActionMessage((prev) => ({ ...prev, [order.id]: '' }))
    try {
      const response = await fetch(
        `/api/staff/salesman/orders/${order.orderNumber}/accept`,
        { method: 'POST' },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Accept failed')
      }
      setActionMessage((prev) => ({
        ...prev,
        [order.id]: 'Order accepted. Start preparing.',
      }))
      await fetchOrders()
    } catch (error) {
      console.error('Failed to accept order', error)
      setActionMessage((prev) => ({
        ...prev,
        [order.id]: 'Unable to accept this order right now.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[order.id]
          return next
        })
      }, 4000)
    }
  }

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

  const handlePrepare = async (order: SalesmanOrder) => {
    setActionLoading(order.id)
    setActionMessage((prev) => ({ ...prev, [order.id]: '' }))
    try {
      const file = prepareFiles[order.id]
      const note = prepareNotes[order.id]?.trim()
      let photoUrl: string | undefined
      if (file) {
        photoUrl = await uploadPreparationPhoto(file)
      }
      const response = await fetch(
        `/api/staff/salesman/orders/${order.orderNumber}/prepare`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: note || undefined,
            photoUrl,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Prepare failed')
      }
      setPrepareNotes((prev) => ({ ...prev, [order.id]: '' }))
      setPrepareFiles((prev) => ({ ...prev, [order.id]: null }))
      setActionMessage((prev) => ({
        ...prev,
        [order.id]: 'Order marked as preparing.',
      }))
      await fetchOrders()
    } catch (error) {
      console.error('Failed to mark order as preparing', error)
      setActionMessage((prev) => ({
        ...prev,
        [order.id]: 'Unable to update this order right now.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[order.id]
          return next
        })
      }, 4000)
    }
  }

  const handleDecline = async (order: SalesmanOrder) => {
    setActionLoading(order.id)
    setActionMessage((prev) => ({ ...prev, [order.id]: '' }))
    try {
      const response = await fetch(
        `/api/staff/salesman/orders/${order.orderNumber}/decline`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: declineReasons[order.id] || DECLINE_REASONS[0],
            notes: declineNotes[order.id]?.trim() || undefined,
            notifyCustomer: declineNotify[order.id] ?? true,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Decline failed')
      }
      setActionMessage((prev) => ({
        ...prev,
        [order.id]: 'Order declined and reassigned.',
      }))
      await fetchOrders()
    } catch (error) {
      console.error('Failed to decline order', error)
      setActionMessage((prev) => ({
        ...prev,
        [order.id]: 'Unable to decline this order right now.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[order.id]
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
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Orders assigned to you for preparation.
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
            variant={status === option ? 'solid' : 'outline'}
            size="sm"
            onClick={() => setStatus(option)}
          >
            {option.replace(/_/g, ' ')}
          </Button>
        ))}
        {newCount > 0 && <Badge variant="subtle">{newCount} new</Badge>}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          No assigned orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Collapsible
              key={order.id}
              className="rounded-xl border border-border/60 bg-card"
            >
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between gap-4 p-4 text-left">
                  <div>
                    <p className="text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer.name} -{' '}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {order.status.toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                    {new Date(order.createdAt).getTime() > lastSeen && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Items to prepare</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.foodItem.name}</span>
                          <span>x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Customer</p>
                      <p className="text-muted-foreground">
                        {order.customer.name} -{' '}
                        {order.customer.phone || order.customer.email}
                      </p>
                    </div>
                    {order.deliveryAddress && (
                      <div>
                        <p className="font-medium">Delivery address</p>
                        <p className="text-muted-foreground">
                          {order.deliveryAddress.line1}
                          {order.deliveryAddress.line2
                            ? `, ${order.deliveryAddress.line2}`
                            : ''}
                          , {order.deliveryAddress.city}{' '}
                          {order.deliveryAddress.postalCode}
                        </p>
                      </div>
                    )}
                    {order.notes && (
                      <div>
                        <p className="font-medium">Special notes</p>
                        <p className="text-muted-foreground">{order.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap items-center gap-3">
                      {order.status === 'PENDING' ? (
                        <Button
                          size="sm"
                          onClick={() => handleAccept(order)}
                          disabled={actionLoading === order.id}
                        >
                          Accept
                        </Button>
                      ) : order.status === 'ACCEPTED' ? (
                        <Button
                          size="sm"
                          onClick={() => handlePrepare(order)}
                          disabled={actionLoading === order.id}
                        >
                          Mark as Preparing
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Ready for Pickup
                        </Button>
                      )}
                      {['PENDING', 'ACCEPTED'].includes(order.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(order)}
                          disabled={actionLoading === order.id}
                        >
                          Decline
                        </Button>
                      )}
                      {actionMessage[order.id] && (
                        <span className="text-xs text-muted-foreground">
                          {actionMessage[order.id]}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {order.status === 'PENDING'
                          ? 'Accept to start preparing.'
                          : order.status === 'ACCEPTED'
                            ? 'Add optional notes or a photo before preparing.'
                            : 'Preparation step coming next.'}
                      </span>
                    </div>
                  </div>
                  {order.status === 'ACCEPTED' && (
                    <div className="md:col-span-2">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Textarea
                          placeholder="Preparation notes (optional)"
                          value={prepareNotes[order.id] || ''}
                          onChange={(event) =>
                            setPrepareNotes((prev) => ({
                              ...prev,
                              [order.id]: event.target.value,
                            }))
                          }
                        />
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              setPrepareFiles((prev) => ({
                                ...prev,
                                [order.id]: event.target.files?.[0] || null,
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Optional photo of items being prepared.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {['PENDING', 'ACCEPTED'].includes(order.status) && (
                    <div className="md:col-span-2">
                      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                              Decline reason
                            </Label>
                            <div className="min-w-[180px]">
                              <AppSelect
                                value={
                                  declineReasons[order.id] || DECLINE_REASONS[0]
                                }
                                onChange={(value) =>
                                  setDeclineReasons((prev) => ({
                                    ...prev,
                                    [order.id]: value,
                                  }))
                                }
                                options={DECLINE_REASONS.map((reason) => ({
                                  label: reason,
                                  value: reason,
                                }))}
                              />
                            </div>
                          </div>
                          <Textarea
                            placeholder="Additional notes (optional)"
                            value={declineNotes[order.id] || ''}
                            onChange={(event) =>
                              setDeclineNotes((prev) => ({
                                ...prev,
                                [order.id]: event.target.value,
                              }))
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`notify-${order.id}`}
                              checked={declineNotify[order.id] ?? true}
                              onCheckedChange={(value) =>
                                setDeclineNotify((prev) => ({
                                  ...prev,
                                  [order.id]: Boolean(value),
                                }))
                              }
                            />
                            <Label
                              htmlFor={`notify-${order.id}`}
                              className="text-xs"
                            >
                              Notify customer about delay
                            </Label>
                          </div>
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
