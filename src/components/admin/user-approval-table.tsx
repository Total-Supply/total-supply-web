'use client'

import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
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
    } catch (err: any) {
      setError(err.message || 'Failed to load users')
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
    } catch (err: any) {
      setError(err.message || 'Approval failed')
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
    } catch (err: any) {
      setError(err.message || 'Bulk approval failed')
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
    } catch (err: any) {
      setError(err.message || 'Rejection failed')
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
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Pending approvals
          </h2>
          <p className="text-sm text-slate-500">
            Verified users waiting for admin approval.
          </p>
        </div>
        <Button
          onClick={handleBulkApprove}
          disabled={!selectedIds.length || isLoading}
        >
          Approve selected
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="w-12 py-3">
                <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
              </th>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Registered</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-3">
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={() => toggleSelection(user.id)}
                  />
                </td>
                <td className="py-3 font-medium text-slate-900">{user.name}</td>
                <td className="py-3 text-slate-600">{user.email}</td>
                <td className="py-3 text-slate-600">{user.phone || '-'}</td>
                <td className="py-3 text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
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
        </table>

        {!users.length && !isLoading && (
          <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            No pending approvals right now.
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-xs text-slate-500">
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

      <Dialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject user</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {rejectTarget?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            />
            <div className="flex justify-end gap-2">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
