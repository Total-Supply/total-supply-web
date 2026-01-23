'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Mail,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { CancelOrderModal } from './cancel-order-modal'
import { DeliveryAddressCard } from './delivery-address-card'
import { DeliveryProof } from './delivery-proof'
import { ImageModal } from './image-modal'
import { OrderHeaderCard } from './order-header-card'
import { OrderItems } from './order-items'
import { OrderTimeline } from './order-timeline'
import { OrderTrackingHeader } from './order-tracking-header'
import { PreparationUpdate } from './preparation-update'

type OrderDetail = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
  notes?: string | null
  salesman?: {
    id: number
    name: string
  } | null
  address?: {
    line1: string
    line2?: string | null
    city: string
    postalCode: string
    country?: string | null
  } | null
  statusHistory?: {
    id: number
    from: string | null
    to: string
    changedAt: string
    note?: string | null
    changedBy?: {
      id: number
      name: string
    } | null
  }[]
  deliveryProof?: {
    photoUrl: string
    deliveredAt: string
    driver?: {
      id: number
      name: string
    } | null
  } | null
  items: {
    id: number
    quantity: number
    unitPrice: number | string
    foodItem: {
      id: number
      name: string
      image?: string | null
    }
  }[]
}

type PreparationMeta = {
  note?: string | null
  photoUrl?: string | null
  etaMinutes?: number | null
}

const parseStatusNote = (note?: string | null): PreparationMeta | null => {
  if (!note) return null
  try {
    const parsed = JSON.parse(note) as PreparationMeta
    if (parsed && typeof parsed === 'object') return parsed
  } catch (error) {
    return null
  }
  return null
}

export function OrderTrackingEnhanced() {
  const router = useRouter()
  const toast = useToast()
  const params = useParams()
  const orderNumber = params?.orderNumber as string | undefined

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const timeline = useMemo(() => {
    const map = new Map()
    order?.statusHistory?.forEach((entry) => map.set(entry.to, entry))
    return map
  }, [order?.statusHistory])

  const preparationMeta = useMemo(
    () => parseStatusNote(timeline.get('PREPARING')?.note),
    [timeline],
  )

  const estimatedDelivery = useMemo(() => {
    if (!order?.createdAt || order?.status === 'DELIVERED') return null

    const outForDelivery = timeline.get('OUT_FOR_DELIVERY')
    const preparing = timeline.get('PREPARING')

    const baseTime = outForDelivery?.changedAt
      ? new Date(outForDelivery.changedAt)
      : preparing?.changedAt
        ? new Date(preparing.changedAt)
        : new Date(order.createdAt)

    const estimateMinutes = outForDelivery
      ? 30
      : preparing
        ? (preparationMeta?.etaMinutes ?? 20)
        : 90

    const eta = new Date(baseTime.getTime() + estimateMinutes * 60 * 1000)
    return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [order?.createdAt, order?.status, preparationMeta?.etaMinutes, timeline])

  const canCancel = !!order && ['PENDING', 'ACCEPTED'].includes(order.status)

  useEffect(() => {
    if (!orderNumber) return

    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/orders/${orderNumber}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error?.message || 'Unable to load order')
        }

        setOrder(data.data)
      } catch (error) {
        console.error('Failed to load order', error)
        toast({
          title: 'Failed to load order',
          status: 'error',
          duration: 2500,
        })
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [orderNumber, toast])

  const handleCancelOrder = async (reason: string) => {
    if (!order) return

    const response = await fetch(`/api/orders/${order.orderNumber}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Unable to cancel order')
    }

    toast({
      title: 'Order canceled',
      description: 'We have canceled your order',
      status: 'success',
      duration: 2500,
    })

    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: 'CANCELED',
            statusHistory: [
              ...(prev.statusHistory || []),
              {
                id: Date.now(),
                from: prev.status,
                to: 'CANCELED',
                changedAt: new Date().toISOString(),
                note: reason,
              },
            ],
          }
        : prev,
    )
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <Container
          maxW="container.xl"
          className="relative px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have
                permission to view it.
              </p>
              <Button
                colorPalette="primary"
                onClick={() => router.push('/orders')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section - Match Other Pages */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12"
        >
          <OrderTrackingHeader
            orderNumber={order.orderNumber}
            status={order.status}
            itemCount={order.items.length}
          />
        </Container>
      </div>

      {/* Main Content */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        {/* Back Button */}
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/orders')}
            className="group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Button>
        </MotionBox>

        {/* Header Card */}
        <OrderHeaderCard
          orderNumber={order.orderNumber}
          status={order.status}
          totalPrice={order.totalPrice}
          createdAt={order.createdAt}
          salesmanName={order.salesman?.name}
          estimatedDelivery={estimatedDelivery}
          canCancel={canCancel}
          onCancel={() => setShowCancelModal(true)}
        />

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_360px] mt-6">
          {/* Left Column - Status & Address */}
          <div className="space-y-6">
            {/* Timeline */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
            >
              <OrderTimeline
                currentStatus={order.status}
                statusHistory={order.statusHistory}
              />
            </MotionBox>

            {/* Delivery Address */}
            {order.address && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
              >
                <DeliveryAddressCard address={order.address} />
              </MotionBox>
            )}

            {/* Preparation Update */}
            {preparationMeta &&
              (preparationMeta.note || preparationMeta.photoUrl) && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
                >
                  <PreparationUpdate
                    meta={preparationMeta}
                    onImageClick={openImageModal}
                  />
                </MotionBox>
              )}

            {/* Delivery Proof */}
            {order.status === 'DELIVERED' && order.deliveryProof && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
              >
                <DeliveryProof
                  proof={order.deliveryProof}
                  onImageClick={openImageModal}
                />
              </MotionBox>
            )}
          </div>

          {/* Right Column - Order Items & Actions */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Order Items */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm"
            >
              <OrderItems items={order.items} notes={order.notes} />
            </MotionBox>

            {/* Actions */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm space-y-3"
            >
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/shop')}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/orders')}
              >
                <Package className="h-4 w-4 mr-2" />
                View All Orders
              </Button>

              <div className="pt-3 border-t border-border/60">
                <p className="text-xs text-muted-foreground mb-2">Need help?</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </MotionBox>
          </div>
        </div>
      </Container>

      {/* Modals */}
      <CancelOrderModal
        isOpen={showCancelModal}
        orderNumber={order.orderNumber}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
      />

      <ImageModal
        isOpen={showImageModal}
        imageUrl={selectedImage}
        alt="Order image"
        onClose={() => setShowImageModal(false)}
      />
    </div>
  )
}
