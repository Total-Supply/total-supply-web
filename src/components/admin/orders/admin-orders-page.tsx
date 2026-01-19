'use client'

import { AdminTable, AdminTableShell } from '@/src/components/admin/admin-table'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useState } from 'react'

type AdminOrder = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
}

type OrdersResponse = {
  data: AdminOrder[]
  meta?: {
    page: number
    totalPages: number
  }
}

const STATUS_OPTIONS = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELED',
]

const inputClassName =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

export function AdminOrdersPage() {
  const toast = useToast()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '10',
        })
        if (status !== 'ALL') {
          params.set('status', status)
        }
        if (search) {
          params.set('search', search)
        }
        const response = await fetch(`/api/orders?${params.toString()}`)
        const data = (await response.json()) as OrdersResponse
        if (!response.ok) {
          throw new Error(data as unknown as string)
        }
        setOrders(data.data || [])
        setTotalPages(data.meta?.totalPages || 1)
      } catch (error) {
        toast({
          title: 'Failed to load orders',
          status: 'error',
          duration: 2500,
        })
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [page, search, status, toast])

  return (
    <div className="container mx-auto space-y-6 p-6">
      <AdminTableShell
        title="Order management"
        description="Update statuses and upload delivery proof."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search order number"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="min-w-[180px]">
              <AppSelect
                placeholder="All statuses"
                value={status}
                options={[
                  { label: 'All statuses', value: 'ALL' },
                  ...STATUS_OPTIONS.map((entry) => ({
                    label: entry.replace(/_/g, ' '),
                    value: entry,
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
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <AdminOrderRow key={order.id} order={order} />
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

function AdminOrderRow({ order }: { order: AdminOrder }) {
  const toast = useToast()
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofUrl, setProofUrl] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!proofFile) return null
    const safeFilename = proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: safeFilename,
        contentType: proofFile.type,
        fileSize: proofFile.size,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload initialization failed')
    }
    const uploadResponse = await fetch(data.data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': proofFile.type,
      },
      body: proofFile,
    })
    if (!uploadResponse.ok) {
      throw new Error('Image upload failed')
    }
    return data.data.publicUrl as string
  }

  const handleUpdate = async () => {
    setIsSaving(true)
    try {
      let deliveryProofUrl = proofUrl
      if (status === 'DELIVERED' && proofFile && !deliveryProofUrl) {
        deliveryProofUrl = await handleUpload()
        setProofUrl(deliveryProofUrl)
      }

      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: notes || undefined,
          deliveryProofUrl: deliveryProofUrl || undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      toast({
        title: 'Order updated',
        status: 'success',
        duration: 2000,
      })
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        message = (error as { message?: string }).message as string
      }
      toast({
        title: 'Update failed',
        description: message,
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const statusOptions = STATUS_OPTIONS.map((entry) => ({
    label: entry.replace(/_/g, ' '),
    value: entry,
  }))

  return (
    <tr className="border-t border-border/60 align-top hover:bg-muted/30">
      <td className="px-4 py-4 font-medium text-foreground">
        {order.orderNumber}
      </td>
      <td className="px-4 py-4 text-muted-foreground">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-muted-foreground">
        <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase">
          {status.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-4 py-4 text-right text-muted-foreground">
        LKR {Number(order.totalPrice).toFixed(2)}
      </td>
      <td className="px-4 py-4">
        <div className="grid gap-2">
          <AppSelect
            value={status}
            options={statusOptions}
            onChange={setStatus}
          />
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          {status === 'DELIVERED' && (
            <input
              type="file"
              accept="image/*"
              className={inputClassName}
              onChange={(event) =>
                setProofFile(event.target.files?.[0] || null)
              }
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(`/orders/${order.orderNumber}`, '_blank')
              }
            >
              View
            </Button>
            <Button size="sm" onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </td>
    </tr>
  )
}
