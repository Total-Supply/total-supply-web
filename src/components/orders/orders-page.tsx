'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { AppSelect } from '@/src/components/ui/app-select'
import {
  Badge,
  Box,
  Container,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Table,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '../ui/button'

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
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status') || 'ALL'
  const searchParam = searchParams.get('search') || ''
  const fromParam = searchParams.get('fromDate') || ''
  const toParam = searchParams.get('toDate') || ''
  const pageParam = Number(searchParams.get('page') || 1)

  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(statusParam)
  const [searchValue, setSearchValue] = useState(searchParam)
  const [fromDate, setFromDate] = useState(fromParam)
  const [toDate, setToDate] = useState(toParam)
  const [page, setPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')

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

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
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
        console.error('Failed to load orders', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [statusParam, searchParam, fromParam, toParam, pageParam])

  const handleView = (orderNumber: string) => {
    router.push(`/orders/${orderNumber}`)
  }

  const canPrev = page > 1
  const canNext = page < totalPages

  const emptyState = !isLoading && orders.length === 0

  return (
    <Stack gap={10}>
      <BackgroundGradient height="240px" />
      <Container maxW="container.xl" pt={{ base: 8, md: 12 }} pb={16}>
        <Stack gap={3}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              My Orders
            </Text>
          </MotionBox>
          <Text color="muted" fontSize={{ base: 'sm', md: 'md' }}>
            Track current orders and revisit past purchases.
          </Text>
        </Stack>

        <Stack gap={4} mt={8}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            <Input
              placeholder="Search by order ID"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                setPage(1)
              }}
            />
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
            <Input
              type="date"
              value={fromDate}
              onChange={(event) => {
                setFromDate(event.target.value)
                setPage(1)
              }}
            />
            <Input
              type="date"
              value={toDate}
              onChange={(event) => {
                setToDate(event.target.value)
                setPage(1)
              }}
            />
          </SimpleGrid>

          {isLoading ? (
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              borderStyle="dashed"
              py={12}
              textAlign="center"
            >
              <Text fontWeight="600">Loading orders...</Text>
            </Box>
          ) : emptyState ? (
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              borderStyle="dashed"
              py={16}
              textAlign="center"
            >
              <Text fontWeight="600">No orders yet</Text>
              <Text color="muted" fontSize="sm">
                Start shopping to place your first order.
              </Text>
            </Box>
          ) : isMobile ? (
            <Stack gap={4}>
              {orders.map((order) => (
                <Box
                  key={order.id}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="2xl"
                  p={4}
                  bg={cardBg}
                  cursor="pointer"
                  onClick={() => handleView(order.orderNumber)}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="600">{order.orderNumber}</Text>
                    <Badge textTransform="capitalize">
                      {order.status.toLowerCase()}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="muted" mt={1}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                  <Text fontWeight="600" mt={2}>
                    LKR {Number(order.totalPrice).toFixed(2)}
                  </Text>
                  <Button size="sm" variant="outline" mt={3}>
                    View order
                  </Button>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="2xl"
              overflow="hidden"
            >
              <Table.Root>
                <Table.Header bg={cardBg}>
                  <Table.Row>
                    <Table.ColumnHeader>Order #</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Total
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Action</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {orders.map((order) => (
                    <Table.Row key={order.id}>
                      <Table.Cell>{order.orderNumber}</Table.Cell>
                      <Table.Cell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell textTransform="capitalize">
                        {order.status.toLowerCase()}
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        LKR {Number(order.totalPrice).toFixed(2)}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(order.orderNumber)}
                        >
                          View
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}

          {!emptyState && (
            <HStack justify="space-between">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                isDisabled={!canPrev}
              >
                Previous
              </Button>
              <Text fontSize="sm" color="muted">
                Page {page} of {totalPages}
              </Text>
              <Button
                variant="outline"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                isDisabled={!canNext}
              >
                Next
              </Button>
            </HStack>
          )}
        </Stack>
      </Container>
    </Stack>
  )
}
