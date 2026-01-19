'use client'

import { AdminTable, AdminTableShell } from '@/src/components/admin/admin-table'
import { Dialog } from '@chakra-ui/react'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'

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
  const [users, setUsers] = useState<ApprovalUser[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<ApprovalUser | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

  const isAllSelected = useMemo(
    () => users.length > 0 && selectedIds.length === users.length,
    [users, selectedIds],
  )

  const loadUsers = async (pageNumber: number) => {
    setIsLoading(true)
    setError(null)
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load users')
      } else {
        setError('Failed to load users')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers(page)
  }, [page])

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
      await loadUsers(page)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Approval failed')
      } else {
        setError('Approval failed')
      }
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
      await loadUsers(page)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Bulk approval failed')
      } else {
        setError('Bulk approval failed')
      }
      setIsLoading(false)
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
      setRejectTarget(null)
      setRejectReason('')
      await loadUsers(page)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Rejection failed')
      } else {
        setError('Rejection failed')
      }
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

  return (
    <AdminTableShell
      title="Pending approvals"
      description="Verified users waiting for admin approval."
      actions={
        <Button
          onClick={handleBulkApprove}
          disabled={!selectedIds.length || isLoading}
        >
          Approve selected
        </Button>
      }
    >
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <AdminTable>
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="w-12 px-4 py-3">
              <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
            </th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Registered</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-border/60 transition hover:bg-muted/30"
            >
              <td className="px-4 py-3">
                <Checkbox
                  checked={selectedIds.includes(user.id)}
                  onCheckedChange={() => toggleSelection(user.id)}
                />
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                {user.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {user.phone || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.id)}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRejectTarget(user)}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      {!users.length && !isLoading && (
        <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          No pending approvals right now.
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || isLoading}
        >
          Next
        </Button>
      </div>

      <Dialog.Root
        open={!!rejectTarget}
        onOpenChange={(details) => {
          if (!details.open) {
            setRejectTarget(null)
          }
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Reject user</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted-foreground">
                Provide a reason for rejecting {rejectTarget?.name}.
              </p>
              <div className="mt-3 space-y-3">
                <Input
                  placeholder="Reason for rejection"
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                />
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReject}
                  disabled={!rejectReason || isRejecting}
                >
                  Confirm reject
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </AdminTableShell>
  )
}
