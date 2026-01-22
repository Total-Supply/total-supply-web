'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { useToast } from '@/src/hooks/use-toast'
import {
  Badge,
  Box,
  Container,
  Dialog,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Link } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '../ui/button'

type OrderItem = {
  id: number
  quantity: number
  unitPrice: number | string
  foodItem: {
    id: number
    name: string
    image?: string | null
  }
}

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
  items: OrderItem[]
}

type StatusHistoryItem = NonNullable<OrderDetail['statusHistory']>[number]

const STATUS_STEPS = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const

const CANCEL_REASONS = [
  'Changed mind',
  'Out of stock',
  'Address issue',
  'Delivery time too long',
  'Other',
]

type PreparationMeta = {
  note?: string | null
  photoUrl?: string | null
  etaMinutes?: number | null
}

const parseStatusNote = (note?: string | null): PreparationMeta | null => {
  if (!note) return null
  try {
    const parsed = JSON.parse(note) as PreparationMeta
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
  } catch (error) {
    return null
  }
  return null
}

export function OrderTrackingPage() {
  const router = useRouter()
  const toast = useToast()
  const params = useParams()
  const orderNumber = params?.orderNumber as string | undefined
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0])
  const cancelModal = useDisclosure()
  const photoModal = useDisclosure()
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')
  const statusColor = useMemo(() => {
    switch (order?.status) {
      case 'DELIVERED':
        return 'green'
      case 'CANCELED':
        return 'red'
      case 'OUT_FOR_DELIVERY':
        return 'purple'
      case 'PREPARING':
        return 'orange'
      case 'ACCEPTED':
        return 'blue'
      default:
        return 'gray'
    }
  }, [order?.status])

  const timeline = useMemo(() => {
    const map = new Map<string, StatusHistoryItem>()
    order?.statusHistory?.forEach((entry) => {
      map.set(entry.to, entry)
    })
    return map
  }, [order?.statusHistory])

  const preparationMeta = useMemo(
    () => parseStatusNote(timeline.get('PREPARING')?.note),
    [timeline],
  )

  const estimatedDelivery = useMemo(() => {
    if (!order?.createdAt || order?.status === 'DELIVERED') return ''
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

  const helperText = useMemo(() => {
    switch (order?.status) {
      case 'PENDING':
        return 'We are confirming your order details.'
      case 'ACCEPTED':
        return 'Your order is accepted. Preparation starts soon.'
      case 'PREPARING':
        return 'Our team is preparing your items now.'
      case 'OUT_FOR_DELIVERY':
        return 'Your order is on the way.'
      case 'DELIVERED':
        return 'Delivery completed. Thank you for ordering.'
      case 'CANCELED':
        return 'This order was canceled.'
      default:
        return 'We will update you with the next status.'
    }
  }, [order?.status])

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
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [orderNumber])

  const handleCancel = async () => {
    if (!order) return
    setIsCanceling(true)
    try {
      const response = await fetch(`/api/orders/${order.orderNumber}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unable to cancel order')
      }
      toast({
        title: 'Order canceled',
        description: 'We have canceled your order.',
        status: 'success',
        duration: 2500,
      })
      cancelModal.onClose()
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
                  note: cancelReason,
                },
              ],
            }
          : prev,
      )
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message
      }
      toast({
        title: 'Cancellation failed',
        description: message,
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsCanceling(false)
    }
  }

  return (
    <Stack gap={10}>
      <BackgroundGradient height="240px" />
      <Container maxW="container.lg" pt={{ base: 8, md: 12 }} pb={16}>
        <Stack gap={3}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Order tracking
            </Text>
          </MotionBox>
          <Text color="muted" fontSize={{ base: 'sm', md: 'md' }}>
            Track your delivery status and order details.
          </Text>
        </Stack>

        {isLoading ? (
          <Stack mt={10} gap={3}>
            <Text>Loading order...</Text>
          </Stack>
        ) : order ? (
          <Stack mt={10} gap={6}>
            <Box
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="2xl"
              p={6}
              bg={cardBg}
            >
              <HStack justify="space-between" align="flex-start">
                <Stack gap={1}>
                  <Text fontSize="lg" fontWeight="600">
                    {order.orderNumber}
                  </Text>
                  <Text fontSize="sm" color="muted">
                    Placed {new Date(order.createdAt).toLocaleString()}
                  </Text>
                  {order.salesman?.name && (
                    <Text fontSize="sm" color="muted">
                      Salesman: {order.salesman.name}
                    </Text>
                  )}
                </Stack>
                <Badge colorPalette={statusColor} textTransform="capitalize">
                  {order.status.toLowerCase()}
                </Badge>
              </HStack>
              <Text fontSize="lg" fontWeight="700" mt={4}>
                Total: LKR {Number(order.totalPrice).toFixed(2)}
              </Text>
              {estimatedDelivery && order.status !== 'DELIVERED' && (
                <Text fontSize="sm" color="muted" mt={2}>
                  Estimated delivery by {estimatedDelivery}
                </Text>
              )}
              {['PENDING', 'ACCEPTED'].includes(order.status) && (
                <Button
                  mt={4}
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                  onClick={cancelModal.onOpen}
                >
                  Cancel order
                </Button>
              )}
            </Box>

            {order.address && (
              <Box
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="2xl"
                p={6}
                bg={cardBg}
              >
                <Text fontSize="lg" fontWeight="600" mb={2}>
                  Delivery address
                </Text>
                <Text fontSize="sm" color="muted">
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ''}
                  {`, ${order.address.city} ${order.address.postalCode}`}
                </Text>
              </Box>
            )}

            <Box
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="2xl"
              p={6}
              bg={cardBg}
            >
              <Text fontSize="lg" fontWeight="600" mb={2}>
                Status timeline
              </Text>
              <Text fontSize="sm" color="muted" mb={4}>
                {helperText}
              </Text>
              <Stack gap={3}>
                {STATUS_STEPS.map((step) => {
                  const entry = timeline.get(step)
                  const isActive = order.status === step
                  const isComplete = !!entry
                  return (
                    <HStack key={step} gap={4} align="flex-start">
                      <Box
                        boxSize="10px"
                        borderRadius="full"
                        mt="6px"
                        bg={
                          isComplete
                            ? 'green.400'
                            : isActive
                              ? 'blue.400'
                              : 'gray.300'
                        }
                      />
                      <Stack gap={0}>
                        <Text fontWeight={isActive ? '600' : '500'}>
                          {step.replace(/_/g, ' ').toLowerCase()}
                        </Text>
                        {entry ? (
                          <Text fontSize="xs" color="muted">
                            {new Date(entry.changedAt).toLocaleString()}
                            {entry.changedBy?.name
                              ? ` - ${entry.changedBy.name}`
                              : ''}
                          </Text>
                        ) : (
                          <Text fontSize="xs" color="muted">
                            Pending
                          </Text>
                        )}
                      </Stack>
                    </HStack>
                  )
                })}
              </Stack>
            </Box>

            <Box
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="2xl"
              p={6}
              bg={cardBg}
            >
              <Text fontSize="lg" fontWeight="600" mb={4}>
                Items
              </Text>
              <Stack gap={3}>
                {order.items.map((item) => (
                  <HStack key={item.id} gap={3} align="flex-start">
                    <Box
                      boxSize="56px"
                      borderRadius="lg"
                      overflow="hidden"
                      bg="gray.100"
                    >
                      {item.foodItem.image ? (
                        <Image
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      ) : (
                        <Box
                          w="full"
                          h="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="gray.400"
                          fontSize="xs"
                        >
                          No image
                        </Box>
                      )}
                    </Box>
                    <Stack gap={0} flex="1">
                      <Text fontSize="sm" fontWeight="600">
                        {item.foodItem.name}
                      </Text>
                      <Text fontSize="xs" color="muted">
                        Qty {item.quantity}
                      </Text>
                    </Stack>
                    <Text fontSize="sm" fontWeight="600">
                      LKR {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Box>

            {(preparationMeta?.note || preparationMeta?.photoUrl) && (
              <Box
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="2xl"
                p={6}
                bg={cardBg}
              >
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  Preparation update
                </Text>
                {preparationMeta.note && (
                  <Text fontSize="sm" color="muted" mb={3}>
                    {preparationMeta.note}
                  </Text>
                )}
                {preparationMeta.photoUrl && (
                  <Stack gap={3}>
                    <Box borderRadius="xl" overflow="hidden">
                      <Image
                        src={preparationMeta.photoUrl}
                        alt="Preparation update"
                        w="full"
                        maxH="280px"
                        objectFit="cover"
                      />
                    </Box>
                    <Box>
                      <a
                        href={preparationMeta.photoUrl}
                        download
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="outline" size="sm" as="span">
                          Download photo
                        </Button>
                      </a>
                    </Box>
                  </Stack>
                )}
              </Box>
            )}

            {order.status === 'DELIVERED' && order.deliveryProof && (
              <Box
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="2xl"
                p={6}
                bg={cardBg}
              >
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  Delivery photo
                </Text>
                <Text fontSize="sm" color="muted" mb={3}>
                  Delivered at{' '}
                  {new Date(order.deliveryProof.deliveredAt).toLocaleString()}
                  {order.deliveryProof.driver?.name
                    ? ` - ${order.deliveryProof.driver.name}`
                    : ''}
                </Text>
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={photoModal.onOpen}
                >
                  <Image
                    src={order.deliveryProof.photoUrl}
                    alt="Delivery proof"
                    w="full"
                    maxH="300px"
                    objectFit="cover"
                  />
                </Box>
                <HStack mt={4}>
                  <Box>
                    <a
                      href={order.deliveryProof.photoUrl}
                      download
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="outline" size="sm" as="span">
                        Download photo
                      </Button>
                    </a>
                  </Box>
                </HStack>
              </Box>
            )}

            <HStack>
              <Text fontSize="sm" color="muted">
                Need help?
              </Text>
              <Text fontSize="sm" fontWeight="600">
                Contact support.
              </Text>
              <Box flex="1" />
              <Text
                fontSize="sm"
                fontWeight="600"
                color="primary.500"
                cursor="pointer"
                onClick={() => router.push('/shop')}
              >
                Continue shopping
              </Text>
            </HStack>
          </Stack>
        ) : (
          <Stack mt={10} gap={3}>
            <Text fontWeight="600">Order not found</Text>
            <Text fontSize="sm" color="muted">
              Please check your tracking link.
            </Text>
          </Stack>
        )}
      </Container>

      <Dialog.Root
        open={cancelModal.open}
        onOpenChange={(details) => {
          if (!details.open) {
            cancelModal.onClose()
          }
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl" bg={cardBg}>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Cancel order</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={3}>
                <Text fontSize="sm" color="muted">
                  Choose a reason for cancellation.
                </Text>
                <AppSelect
                  value={cancelReason}
                  onChange={(value) => setCancelReason(value)}
                  options={CANCEL_REASONS.map((reason) => ({
                    label: reason,
                    value: reason,
                  }))}
                />
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3} w="full">
                <Button
                  variant="outline"
                  flex="1"
                  onClick={cancelModal.onClose}
                >
                  Keep order
                </Button>
                <Button
                  colorPalette="red"
                  flex="1"
                  onClick={handleCancel}
                  loading={isCanceling}
                >
                  Cancel order
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {order?.deliveryProof && (
        <Dialog.Root
          open={photoModal.open}
          onOpenChange={(details) => {
            if (!details.open) {
              photoModal.onClose()
            }
          }}
        >
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl" bg={cardBg}>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>Delivery photo</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Image
                  src={order.deliveryProof.photoUrl}
                  alt="Delivery proof full size"
                  w="full"
                  borderRadius="xl"
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Stack>
  )
}
