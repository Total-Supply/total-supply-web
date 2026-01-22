'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { ServiceRequestFilters } from '@/src/components/admin/services/requests/service-request-filters'
import { ServiceRequestsTable } from '@/src/components/admin/services/requests/service-requests-table'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { useToast } from '@/src/hooks/use-toast'
import { RefreshCw } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

type ServiceRow = {
  id: number
  requestNumber: string
  type: string
  status: string
  priority: string
  createdAt: string
  customer: {
    id: number
    name: string
    email: string
  }
}

type StaffOption = {
  id: number
  name: string
}

type ServiceResponse = {
  data: ServiceRow[]
  meta?: {
    page: number
    totalPages: number
  }
}

const STATUS_OPTIONS = ['RECEIVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
const PRIORITY_OPTIONS = ['URGENT', 'HIGH', 'MEDIUM', 'LOW']

export function AdminServiceRequestsPage() {
  const toast = useToast()
  const [rows, setRows] = useState<ServiceRow[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('ALL')
  const [priority, setPriority] = useState('ALL')
  const [type, setType] = useState('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [cleaners, setCleaners] = useState<StaffOption[]>([])
  const [itStaff, setItStaff] = useState<StaffOption[]>([])

  const staffByType = useMemo(
    () => ({
      CLEANING: cleaners,
      IT_SUPPORT: itStaff,
    }),
    [cleaners, itStaff],
  )

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((item) => ({
        label: item.replace(/_/g, ' '),
        value: item,
      })),
    [],
  )

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const loadByRole = async (role: string) => {
          const params = new URLSearchParams({
            role,
            status: 'ACTIVE',
            page: '1',
            limit: '100',
          })
          const response = await fetch(`/api/users?${params.toString()}`)
          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to load staff')
          }
          type User = { id: number; name: string }
          return (data.data || []).map((user: User) => ({
            id: user.id,
            name: user.name,
          }))
        }

        const [cleanerList, itList] = await Promise.all([
          loadByRole('CLEANER'),
          loadByRole('IT_STAFF'),
        ])
        setCleaners(cleanerList)
        setItStaff(itList)
      } catch (error) {
        toast({
          title: 'Failed to load staff',
          status: 'error',
          duration: 2500,
        })
      }
    }

    loadStaff()
  }, [toast])

  const loadRequests = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      })
      if (status !== 'ALL') params.set('status', status)
      if (priority !== 'ALL') params.set('priority', priority)
      if (type !== 'ALL') params.set('type', type)
      if (search) params.set('search', search)

      const response = await fetch(`/api/service-requests?${params.toString()}`)
      const data = (await response.json()) as ServiceResponse
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      setRows(data.data || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load requests',
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
  }, [page, priority, search, status, type])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadRequests(false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Requests refreshed',
      status: 'success',
      duration: 2000,
    })
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

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <AdminTableShell
        title="Service requests"
        description="Assign staff and track completion."
        actions={
          <div className="flex items-center gap-2">
            <IconActionButton
              icon={RefreshCw}
              label="Refresh requests"
              variant="refresh"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            />
            <ServiceRequestFilters
              search={search}
              type={type}
              priority={priority}
              status={status}
              onSearchChange={handleSearchChange}
              onTypeChange={handleTypeChange}
              onPriorityChange={handlePriorityChange}
              onStatusChange={handleStatusChange}
              statusOptions={STATUS_OPTIONS}
              priorityOptions={PRIORITY_OPTIONS}
            />
          </div>
        }
      >
        <ServiceRequestsTable
          rows={rows}
          isLoading={isLoading}
          staffByType={staffByType}
          statusOptions={statusOptions}
        />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </AdminTableShell>
    </div>
  )
}
