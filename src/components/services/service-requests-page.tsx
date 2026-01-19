'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import {
  Badge,
  Box,
  Container,
  HStack,
  SimpleGrid,
  Stack,
  Table,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

type ServiceSummary = {
  id: number
  requestNumber: string
  type: string
  status: string
  priority: string
  title?: string | null
  createdAt: string
}

type ServiceResponse = {
  data: ServiceSummary[]
  meta?: {
    page: number
    totalPages: number
  }
}

const STATUS_OPTIONS = [
  'ALL',
  'RECEIVED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
]
const PRIORITY_OPTIONS = ['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW']
const TYPE_OPTIONS = ['ALL', 'CLEANING', 'IT_SUPPORT']

export function ServiceRequestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status') || 'ALL'
  const priorityParam = searchParams.get('priority') || 'ALL'
  const typeParam = searchParams.get('type') || 'ALL'
  const searchParam = searchParams.get('search') || ''
  const pageParam = Number(searchParams.get('page') || 1)

  const [items, setItems] = useState<ServiceSummary[]>([])
  const [status, setStatus] = useState(statusParam)
  const [priority, setPriority] = useState(priorityParam)
  const [type, setType] = useState(typeParam)
  const [search, setSearch] = useState(searchParam)
  const [page, setPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    setStatus(statusParam)
    setPriority(priorityParam)
    setType(typeParam)
    setSearch(searchParam)
    setPage(pageParam)
  }, [statusParam, priorityParam, typeParam, searchParam, pageParam])

  useEffect(() => {
    const params = new URLSearchParams()
    if (status !== 'ALL') params.set('status', status)
    if (priority !== 'ALL') params.set('priority', priority)
    if (type !== 'ALL') params.set('type', type)
    if (search) params.set('search', search)
    if (page > 1) params.set('page', String(page))
    const query = params.toString()
    router.replace(query ? `/services/requests?${query}` : '/services/requests')
  }, [status, priority, type, search, page, router])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(pageParam),
          limit: '10',
        })
        if (statusParam !== 'ALL') params.set('status', statusParam)
        if (priorityParam !== 'ALL') params.set('priority', priorityParam)
        if (typeParam !== 'ALL') params.set('type', typeParam)
        if (searchParam) params.set('search', searchParam)
        const response = await fetch(
          `/api/service-requests?${params.toString()}`,
        )
        const data = (await response.json()) as ServiceResponse
        if (!response.ok) {
          throw new Error(data as unknown as string)
        }
        setItems(data.data || [])
        setTotalPages(data.meta?.totalPages || 1)
      } catch (error) {
        console.error('Failed to load service requests', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [statusParam, priorityParam, typeParam, searchParam, pageParam])

  const handleView = (id: number) => {
    router.push(`/services/${id}`)
  }

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
              My Service Requests
            </Text>
          </MotionBox>
          <Text color="muted">Track cleaning and IT support bookings.</Text>
        </Stack>

        <Stack gap={4} mt={8}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            <Input
              placeholder="Search request number"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
            <AppSelect
              value={type}
              onChange={(value) => {
                setType(value)
                setPage(1)
              }}
              options={TYPE_OPTIONS.map((option) => ({
                label: option.replace(/_/g, ' '),
                value: option,
              }))}
            />
            <AppSelect
              value={priority}
              onChange={(value) => {
                setPriority(value)
                setPage(1)
              }}
              options={PRIORITY_OPTIONS.map((option) => ({
                label: option.replace(/_/g, ' '),
                value: option,
              }))}
            />
            <AppSelect
              value={status}
              onChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
              options={STATUS_OPTIONS.map((option) => ({
                label: option.replace(/_/g, ' '),
                value: option,
              }))}
            />
          </SimpleGrid>

          {isLoading ? (
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              borderStyle="dashed"
              py={12}
            >
              <Text textAlign="center">Loading requests...</Text>
            </Box>
          ) : items.length === 0 ? (
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              borderStyle="dashed"
              py={12}
            >
              <Text textAlign="center">No service requests yet.</Text>
            </Box>
          ) : isMobile ? (
            <Stack gap={4}>
              {items.map((item) => (
                <Box
                  key={item.id}
                  borderWidth="1px"
                  borderRadius="2xl"
                  p={4}
                  cursor="pointer"
                  onClick={() => handleView(item.id)}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="600">{item.requestNumber}</Text>
                    <Badge textTransform="capitalize">
                      {item.status.toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="muted" mt={1}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" color="muted" mt={2}>
                    {item.type.replace(/_/g, ' ')} · {item.priority}
                  </Text>
                  <Button size="sm" variant="outline" mt={3}>
                    View request
                  </Button>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box borderWidth="1px" borderRadius="2xl" overflow="hidden">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Request #</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Priority</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Action</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.requestNumber}</Table.Cell>
                      <Table.Cell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{item.type.replace(/_/g, ' ')}</Table.Cell>
                      <Table.Cell>{item.priority}</Table.Cell>
                      <Table.Cell textTransform="capitalize">
                        {item.status.toLowerCase().replace(/_/g, ' ')}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(item.id)}
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

          {items.length > 0 && (
            <HStack justify="space-between">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                isDisabled={page <= 1}
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
                isDisabled={page >= totalPages}
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
