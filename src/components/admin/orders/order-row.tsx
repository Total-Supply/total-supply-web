'use client'

import { useToast } from '@/src/hooks/use-toast'

import { useState } from 'react'

import { OrderActions } from './order-actions'
import { OrderRowForm } from './order-row-form'
import { OrderStatusBadge } from './order-status-badge'

type AdminOrder = {
  id: number
  orderNumber: string
  status: string
  totalPrice: number | string
  createdAt: string
}

type OrderRowProps = {
  order: AdminOrder
  statusOptions: { label: string; value: string }[]
}

export function OrderRow({ order, statusOptions }: OrderRowProps) {
  const toast = useToast()
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofUrl, setProofUrl] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!proofFile) return null

    setIsUploading(true)
    try {
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
        headers: { 'Content-Type': proofFile.type },
        body: proofFile,
      })
      if (!uploadResponse.ok) {
        throw new Error('Image upload failed')
      }

      return data.data.publicUrl as string
    } finally {
      setIsUploading(false)
    }
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

  const handleView = () => {
    window.open(`/orders/${order.orderNumber}`, '_blank')
  }

  return (
    <tr className="border-t border-border/60 align-top transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4 font-medium text-foreground">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">#{order.orderNumber}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-muted-foreground">
        {new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>
      <td className="px-4 py-4">
        <OrderStatusBadge status={status} />
      </td>
      <td className="px-4 py-4 text-right font-semibold text-foreground">
        LKR{' '}
        {Number(order.totalPrice).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <OrderRowForm
            status={status}
            notes={notes}
            onStatusChange={setStatus}
            onNotesChange={setNotes}
            onFileChange={setProofFile}
            statusOptions={statusOptions}
            proofFile={proofFile}
            isUploading={isUploading}
          />
          <OrderActions
            orderNumber={order.orderNumber}
            onView={handleView}
            onSave={handleUpdate}
            isSaving={isSaving || isUploading}
          />
        </div>
      </td>
    </tr>
  )
}
