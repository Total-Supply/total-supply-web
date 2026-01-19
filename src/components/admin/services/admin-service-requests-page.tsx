'use client'

import { AdminTable, AdminTableShell } from '@/src/components/admin/admin-table'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'
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

const inputClassName =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

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
  const [cleaners, setCleaners] = useState<StaffOption[]>([])
  const [itStaff, setItStaff] = useState<StaffOption[]>([])

  const staffByType = useMemo(
    () => ({
      CLEANING: cleaners,
      IT_SUPPORT: itStaff,
    }),
    [cleaners, itStaff],
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
          return (data.data || []).map((user: any) => ({
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

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
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
        setIsLoading(false)
      }
    }

    load()
  }, [page, priority, search, status, toast, type])

  return (
    <div className="container mx-auto space-y-6 p-6">
      <AdminTableShell
        title="Service requests"
        description="Assign staff and track completion."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search request # or customer"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                placeholder="All types"
                value={type}
                options={[
                  { label: 'All types', value: 'ALL' },
                  { label: 'Cleaning', value: 'CLEANING' },
                  { label: 'IT Support', value: 'IT_SUPPORT' },
                ]}
                onChange={(value) => {
                  setType(value)
                  setPage(1)
                }}
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                placeholder="All priorities"
                value={priority}
                options={[
                  { label: 'All priorities', value: 'ALL' },
                  ...PRIORITY_OPTIONS.map((item) => ({
                    label: item,
                    value: item,
                  })),
                ]}
                onChange={(value) => {
                  setPriority(value)
                  setPage(1)
                }}
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                placeholder="All statuses"
                value={status}
                options={[
                  { label: 'All statuses', value: 'ALL' },
                  ...STATUS_OPTIONS.map((item) => ({
                    label: item.replace(/_/g, ' '),
                    value: item,
                  })),
                ]}
                onChange={(value) => {
                  setStatus(value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        }
      >
        <AdminTable>
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Request #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Loading requests...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  No service requests found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <ServiceRowItem
                  key={row.id}
                  row={row}
                  staffOptions={
                    staffByType[row.type as 'CLEANING' | 'IT_SUPPORT'] || []
                  }
                />
              ))
            )}
          </tbody>
        </AdminTable>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
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

function ServiceRowItem({
  row,
  staffOptions,
}: {
  row: ServiceRow
  staffOptions: StaffOption[]
}) {
  const toast = useToast()
  const [status, setStatus] = useState(row.status)
  const [staffId, setStaffId] = useState('')
  const [notes, setNotes] = useState('')
  const [afterPhotos, setAfterPhotos] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadAfter = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const remaining = 3 - afterPhotos.length
    const batch = Array.from(files).slice(0, remaining)
    if (batch.length === 0) return
    setIsUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of batch) {
        const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: safeFilename,
            contentType: file.type,
            fileSize: file.size,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Upload initialization failed')
        }
        const uploadResponse = await fetch(data.data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed')
        }
        uploaded.push(data.data.publicUrl)
      }
      setAfterPhotos((prev) => [...prev, ...uploaded])
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error?.message || 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        status,
        staffId: staffId ? Number(staffId) : undefined,
        notes: notes || undefined,
        afterPhotos: afterPhotos.length ? afterPhotos : undefined,
      }
      const response = await fetch(`/api/service-requests/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      toast({
        title: 'Request updated',
        status: 'success',
        duration: 2000,
      })
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error?.message || 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const statusOptions = STATUS_OPTIONS.map((item) => ({
    label: item.replace(/_/g, ' '),
    value: item,
  }))
  const staffOptionsList = staffOptions.map((staff) => ({
    label: staff.name,
    value: String(staff.id),
  }))

  return (
    <tr className="border-t border-border/60 align-top hover:bg-muted/30">
      <td className="px-4 py-4 font-medium text-foreground">
        {row.requestNumber}
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="font-medium text-foreground">{row.customer.name}</div>
          <div className="text-xs text-muted-foreground">
            {row.customer.email}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-muted-foreground">
        {row.type.replace(/_/g, ' ')}
      </td>
      <td className="px-4 py-4 text-muted-foreground">{row.priority}</td>
      <td className="px-4 py-4 text-muted-foreground">
        <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase">
          {status.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="grid gap-2">
          <AppSelect value={status} options={statusOptions} onChange={setStatus} />
          <AppSelect
            placeholder="Assign staff"
            value={staffId}
            options={[{ label: 'Assign staff', value: '' }, ...staffOptionsList]}
            onChange={setStaffId}
          />
          <Input
            placeholder="Completion notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          {status === 'RESOLVED' && (
            <input
              type="file"
              accept="image/*"
              multiple
              className={inputClassName}
              disabled={isUploading}
              onChange={(event) => handleUploadAfter(event.target.files)}
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`/services/${row.id}`, '_blank')}
            >
              View
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </td>
    </tr>
  )
}


