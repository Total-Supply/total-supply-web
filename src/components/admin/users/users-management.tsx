'use client'

import { AdminTableShell } from '@/src/components/admin/admin-table'
import { EditUserDialog } from '@/src/components/admin/users/edit-user-dialog'
import { UserFilters } from '@/src/components/admin/users/user-filters'
import { UserStats } from '@/src/components/admin/users/user-stats'
import { UsersEmptyState } from '@/src/components/admin/users/users-empty-state'
import { UsersHeader } from '@/src/components/admin/users/users-header'
import { UsersTable } from '@/src/components/admin/users/users-table'
import { useToast } from '@/src/hooks/use-toast'
import { useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { OrdersPagination } from '../../orders/order-pagination'

type AdminUser = {
  id: number
  email: string
  name: string
  role: string
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

const ROLE_OPTIONS = ['ALL', 'ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER']
const STATUS_OPTIONS = [
  'ALL',
  'ACTIVE',
  'PENDING_APPROVAL',
  'SUSPENDED',
  'REJECTED',
]

export function UsersManagement() {
  const router = useRouter()
  const toast = useToast()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [editTarget, setEditTarget] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: '' })
  const [isSaving, setIsSaving] = useState(false)

  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'ACTIVE').length,
      pending: users.filter((u) => u.status === 'PENDING_APPROVAL').length,
      suspended: users.filter((u) => u.status === 'SUSPENDED').length,
    }
  }, [users])

  const hasFilters = search || role !== 'ALL' || status !== 'ALL'

  const loadUsers = async (pageNumber: number, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams({
        page: String(pageNumber),
        limit: '10',
      })
      if (search) params.set('search', search)
      if (role !== 'ALL') params.set('role', role)
      if (status !== 'ALL') params.set('status', status)

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const data = (await response.json()) as ApiResponse<AdminUser[]>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load users')
      }
      setUsers(data.data)
      setTotalPages(data.meta?.totalPages || 1)
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
  }, [page, search, role, status])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await loadUsers(page, false)
    setIsRefreshing(false)
    setIsLoading(false)
    toast({
      title: 'Users refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleView = (userId: number) => {
    router.push(`/dashboard/admin/users/${userId}`)
  }

  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setEditTarget(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!editTarget) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = (await response.json()) as ApiResponse<AdminUser>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      toast({
        title: 'User updated',
        status: 'success',
        duration: 2000,
      })
      setEditTarget(null)
      await loadUsers(page, false)
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSuspend = async (userId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
      })
      const data = (await response.json()) as ApiResponse<AdminUser>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Suspension failed')
      }
      toast({
        title: 'User suspended',
        status: 'success',
        duration: 2000,
      })
      await loadUsers(page, false)
    } catch (error) {
      toast({
        title: 'Suspension failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivate = async (userId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
      })
      const data = (await response.json()) as ApiResponse<AdminUser>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Activation failed')
      }
      toast({
        title: 'User activated',
        status: 'success',
        duration: 2000,
      })
      await loadUsers(page, false)
    } catch (error) {
      toast({
        title: 'Activation failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = () => {
    router.push('/dashboard/admin/users/new')
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRoleChange = (value: string) => {
    setRole(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    setPage(1)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancelEdit = () => {
    setEditTarget(null)
    setFormData({ name: '', email: '', role: '' })
  }

  return (
    <div className="space-y-6">
      <UsersHeader
        onRefresh={handleRefresh}
        onAddUser={handleAddUser}
        isRefreshing={isRefreshing}
      />

      {!isLoading && users.length > 0 && (
        <UserStats stats={userStats} isLoading={isLoading} />
      )}

      <UserFilters
        search={search}
        role={role}
        status={status}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        roleOptions={ROLE_OPTIONS}
        statusOptions={STATUS_OPTIONS}
      />

      <AdminTableShell
        title="All Users"
        description="Manage user accounts and permissions."
      >
        {users.length === 0 && !isLoading ? (
          <UsersEmptyState
            hasFilters={!!hasFilters}
            onAddUser={handleAddUser}
          />
        ) : (
          <>
            <UsersTable
              users={users}
              isLoading={isLoading}
              onView={handleView}
              onEdit={handleEdit}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
            />

            {users.length > 0 && (
              <OrdersPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </AdminTableShell>

      <EditUserDialog
        user={editTarget}
        formData={formData}
        onFormChange={handleFormChange}
        onConfirm={handleSaveEdit}
        onCancel={handleCancelEdit}
        isSaving={isSaving}
        roleOptions={ROLE_OPTIONS.filter((r) => r !== 'ALL')}
      />
    </div>
  )
}
