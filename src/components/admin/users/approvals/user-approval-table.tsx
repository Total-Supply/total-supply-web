'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { ApprovalStats } from '@/src/components/admin/users/approvals/approval-stats'
import { ApprovalsEmptyState } from '@/src/components/admin/users/approvals/approvals-empty-state'
import { ApprovalsHeader } from '@/src/components/admin/users/approvals/approvals-header'
import { ApprovalsTable } from '@/src/components/admin/users/approvals/approvals-table'
import { RejectDialog } from '@/src/components/admin/users/approvals/reject-dialog'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

type ApprovalUser = {
  id: number
  email: string
  name: string
  phone?: string | null
  status: string
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

export function UserApprovalTable() {
  const toast = useToast()
  const [users, setUsers] = useState<ApprovalUser[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<ApprovalUser | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

  // Mock stats - replace with real API data
  const approvalStats = useMemo(
    () => ({
      total: users.length,
      pending: users.length,
      approved: 0,
      rejected: 0,
    }),
    [users],
  )

  const isAllSelected = useMemo(
    () => users.length > 0 && selectedIds.length === users.length,
    [users, selectedIds],
  )

  const loadUsers = async (pageNumber: number, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const response = await fetch(
        `/api/admin/users?status=PENDING_APPROVAL&page=${pageNumber}&limit=10`,
      )
      const data = (await response.json()) as ApiResponse<ApprovalUser[]>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load users')
      }
      setUsers(data.data)
      setTotalPages(data.meta?.totalPages || 1)
      setSelectedIds([])
    } catch (error) {
      toast({
        title: 'Failed to load users',
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
    loadUsers(page)
  }, [page])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadUsers(page, false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Approvals refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleApprove = async (userId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/approve/${userId}`, {
        method: 'POST',
      })
      const data = (await response.json()) as ApiResponse<ApprovalUser>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Approval failed')
      }
      toast({
        title: 'User approved',
        status: 'success',
        duration: 2000,
      })
      await loadUsers(page, false)
    } catch (error) {
      toast({
        title: 'Approval failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkApprove = async () => {
    if (!selectedIds.length) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = (await response.json()) as ApiResponse<ApprovalUser[]>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Bulk approval failed')
      }
      toast({
        title: `${selectedIds.length} users approved`,
        status: 'success',
        duration: 2000,
      })
      await loadUsers(page, false)
    } catch (error) {
      toast({
        title: 'Bulk approval failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectClick = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setRejectTarget(user)
    }
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    setIsRejecting(true)
    try {
      const response = await fetch(
        `/api/admin/users/reject/${rejectTarget.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: rejectReason }),
        },
      )
      const data = (await response.json()) as ApiResponse<ApprovalUser>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Rejection failed')
      }
      toast({
        title: 'User rejected',
        status: 'success',
        duration: 2000,
      })
      setRejectTarget(null)
      setRejectReason('')
      await loadUsers(page, false)
    } catch (error) {
      toast({
        title: 'Rejection failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(users.map((user) => user.id))
    }
  }

  const handleCancelReject = () => {
    setRejectTarget(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-6">
      <ApprovalsHeader
        selectedCount={selectedIds.length}
        onRefresh={handleRefresh}
        onBulkApprove={handleBulkApprove}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
      />

      {!isLoading && users.length > 0 && (
        <ApprovalStats stats={approvalStats} isLoading={isLoading} />
      )}

      <AdminTableShell
        title="Pending Approvals"
        description="Verified users waiting for admin approval."
      >
        {users.length === 0 && !isLoading ? (
          <ApprovalsEmptyState />
        ) : (
          <>
            <ApprovalsTable
              users={users}
              selectedIds={selectedIds}
              isAllSelected={isAllSelected}
              isLoading={isLoading}
              onToggle={toggleSelection}
              onToggleAll={toggleAll}
              onApprove={handleApprove}
              onReject={handleRejectClick}
            />

            {users.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4">
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1 || isLoading}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page <span className="text-foreground">{page}</span> of{' '}
                  <span className="text-foreground">{totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page >= totalPages || isLoading}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </AdminTableShell>

      <RejectDialog
        user={rejectTarget}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onConfirm={handleReject}
        onCancel={handleCancelReject}
        isRejecting={isRejecting}
      />
    </div>
  )
}
