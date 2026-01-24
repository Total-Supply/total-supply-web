'use client'

import { ServiceFilters } from '@/src/components/services/requests/service-filters'
import { ServiceRequestsEmptyState } from '@/src/components/services/requests/service-requests-empty-state'
import { ServiceRequestsHeader } from '@/src/components/services/requests/service-requests-header'
import {
  ServiceRequestsCardSkeleton,
  ServiceRequestsTableSkeleton,
} from '@/src/components/services/requests/service-requests-skeleton'
import { ServiceStats } from '@/src/components/services/requests/service-stats'
import { useToast } from '@/src/hooks/use-toast'
import { Container, useBreakpointValue } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { OrdersPagination } from '../../orders/order-pagination'
import { ServiceRequestCard } from './service-request-card'
import { ServiceRequestsTable } from './service-requests-table'

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
  const toast = useToast()
  const searchParams = useSearchParams()
  const isMobile = useBreakpointValue({ base: true, md: false })

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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const serviceStats = useMemo(() => {
    return {
      total: items.length,
      received: items.filter((r) => r.status === 'RECEIVED').length,
      inProgress: items.filter((r) =>
        ['ASSIGNED', 'IN_PROGRESS'].includes(r.status),
      ).length,
      resolved: items.filter((r) => r.status === 'RESOLVED').length,
    }
  }, [items])

  const hasFilters =
    status !== 'ALL' || priority !== 'ALL' || type !== 'ALL' || search

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

  const loadRequests = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: '10',
      })
      if (statusParam !== 'ALL') params.set('status', statusParam)
      if (priorityParam !== 'ALL') params.set('priority', priorityParam)
      if (typeParam !== 'ALL') params.set('type', typeParam)
      if (searchParam) params.set('search', searchParam)

      const response = await fetch(`/api/service-requests?${params.toString()}`)
      const data = (await response.json()) as ServiceResponse
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      setItems(data.data || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load service requests',
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
    loadRequests()
  }, [statusParam, priorityParam, typeParam, searchParam, pageParam])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadRequests(false)
    setIsRefreshing(false)
    toast({
      title: 'Requests refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleView = (id: number) => {
    router.push(`/services/${id}`)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    setPage(1)
  }

  const handlePriorityChange = (value: string) => {
    setPriority(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    setPage(1)
  }

  const emptyState = !isLoading && items.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12"
        >
          <ServiceRequestsHeader
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </Container>
      </div>

      {/* Main Content */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        {/* Stats Cards */}
        {!isLoading && !emptyState && (
          <div className="mb-6">
            <ServiceStats stats={serviceStats} isLoading={isLoading} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm">
          <ServiceFilters
            search={search}
            type={type}
            priority={priority}
            status={status}
            onSearchChange={handleSearchChange}
            onTypeChange={handleTypeChange}
            onPriorityChange={handlePriorityChange}
            onStatusChange={handleStatusChange}
            typeOptions={TYPE_OPTIONS}
            priorityOptions={PRIORITY_OPTIONS}
            statusOptions={STATUS_OPTIONS}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          isMobile ? (
            <ServiceRequestsCardSkeleton />
          ) : (
            <ServiceRequestsTableSkeleton />
          )
        ) : emptyState ? (
          <ServiceRequestsEmptyState hasFilters={!!hasFilters} />
        ) : isMobile ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <ServiceRequestCard
                key={item.id}
                request={item}
                onView={handleView}
                index={index}
              />
            ))}
          </div>
        ) : (
          <ServiceRequestsTable requests={items} onView={handleView} />
        )}

        {/* Pagination */}
        {!emptyState && !isLoading && totalPages > 1 && (
          <div className="mt-6">
            <OrdersPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Container>
    </div>
  )
}
