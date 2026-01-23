'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { AuditDetailsModal } from '@/src/components/admin/audit/audit-details-modal'
import { AuditFilters } from '@/src/components/admin/audit/audit-filters'
import { AuditHeader } from '@/src/components/admin/audit/audit-header'
import { AuditStats } from '@/src/components/admin/audit/audit-stats'
import { AuditTable } from '@/src/components/admin/audit/audit-table'
import { OrdersPagination } from '@/src/components/orders/order-pagination'
import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useMemo, useState } from 'react'

type AuditLog = {
  id: number
  entityType: string
  entityId: number
  action: string
  actorId: number | null
  actor: {
    id: number
    name: string
    email: string
    role: string
  } | null
  ipAddress: string | null
  userAgent: string | null
  details: Record<string, unknown>
  createdAt: string
}

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: {
    message: string
  }
}

const ENTITY_TYPES = [
  'ALL',
  'USER',
  'ORDER',
  'PRODUCT',
  'SERVICE',
  'PAYMENT',
  'DELIVERY',
  'SETTINGS',
  'SECURITY',
]

const ACTIONS = [
  'ALL',
  'CREATE',
  'UPDATE',
  'DELETE',
  'VIEW',
  'APPROVE',
  'REJECT',
]

export default function AuditLogsPage() {
  const toast = useToast()

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [search, setSearch] = useState('')
  const [entityType, setEntityType] = useState('ALL')
  const [action, setAction] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const auditStats = useMemo(() => {
    return {
      total: logs.length,
      creates: logs.filter((l) => l.action === 'CREATE').length,
      updates: logs.filter((l) => l.action === 'UPDATE').length,
      deletes: logs.filter((l) => l.action === 'DELETE').length,
      views: logs.filter((l) => l.action === 'VIEW').length,
    }
  }, [logs])

  const loadLogs = async (pageNumber: number, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(pageNumber),
        limit: '20',
      })
      if (search) params.set('search', search)
      if (entityType !== 'ALL') params.set('entityType', entityType)
      if (action !== 'ALL') params.set('action', action)
      if (fromDate) params.set('fromDate', fromDate)
      if (toDate) params.set('toDate', toDate)

      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`)
      const data = (await response.json()) as ApiResponse<AuditLog[]>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load audit logs')
      }
      setLogs(data.data)
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      toast({
        title: 'Failed to load audit logs',
        description:
          error instanceof Error ? error.message : 'Please try again.',
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
    loadLogs(page)
  }, [page, search, entityType, action, fromDate, toDate])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadLogs(page, false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Audit logs refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (entityType !== 'ALL') params.set('entityType', entityType)
      if (action !== 'ALL') params.set('action', action)
      if (fromDate) params.set('fromDate', fromDate)
      if (toDate) params.set('toDate', toDate)

      const response = await fetch(
        `/api/admin/audit-logs/export?${params.toString()}`,
      )
      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `audit-logs-${new Date().toISOString()}.csv`
      anchor.click()
      URL.revokeObjectURL(url)

      toast({
        title: 'Audit logs exported',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleEntityTypeChange = (value: string) => {
    setEntityType(value)
    setPage(1)
  }

  const handleActionChange = (value: string) => {
    setAction(value)
    setPage(1)
  }

  const handleFromDateChange = (value: string) => {
    setFromDate(value)
    setPage(1)
  }

  const handleToDateChange = (value: string) => {
    setToDate(value)
    setPage(1)
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <AuditHeader
        onRefresh={handleRefresh}
        onExport={handleExport}
        isRefreshing={isRefreshing}
      />

      {!isLoading && logs.length > 0 && (
        <AuditStats stats={auditStats} isLoading={isLoading} />
      )}

      <AuditFilters
        search={search}
        entityType={entityType}
        action={action}
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={handleSearchChange}
        onEntityTypeChange={handleEntityTypeChange}
        onActionChange={handleActionChange}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        entityTypes={ENTITY_TYPES}
        actions={ACTIONS}
      />

      <AdminTableShell
        title="Activity Log"
        description="Complete history of system actions."
      >
        <AuditTable
          logs={logs}
          isLoading={isLoading}
          onViewDetails={setSelectedLog}
        />

        {logs.length > 0 && (
          <OrdersPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </AdminTableShell>

      <AuditDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  )
}
