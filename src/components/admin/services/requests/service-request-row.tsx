'use client'

import { PriorityBadge } from '@/src/components/ui/priority-badge'
import { useToast } from '@/src/hooks/use-toast'

import { useState } from 'react'

import { ServiceRequestActions } from './service-request-actions'
import { ServiceRequestFormFields } from './service-request-form-fields'
import { ServiceStatusBadge } from './service-status-badge'

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

type ServiceRequestRowProps = {
  row: ServiceRow
  staffOptions: StaffOption[]
  statusOptions: { label: string; value: string }[]
}

export function ServiceRequestRow({
  row,
  staffOptions,
  statusOptions,
}: ServiceRequestRowProps) {
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
      toast({
        title: 'Photos uploaded',
        status: 'success',
        duration: 2000,
      })
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (error instanceof Error) {
        message = error.message
      }
      toast({
        title: 'Upload failed',
        description: message,
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
    } catch (error: unknown) {
      let message = 'Please try again.'
      if (error instanceof Error) {
        message = error.message
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

  const handleView = () => {
    window.open(`/services/${row.id}`, '_blank')
  }

  return (
    <tr className="border-t border-border/60 align-top transition-colors duration-150 hover:bg-muted/30">
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
      <td className="px-4 py-4">
        <PriorityBadge priority={row.priority} />
      </td>
      <td className="px-4 py-4">
        <ServiceStatusBadge status={status} />
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <ServiceRequestFormFields
            status={status}
            staffId={staffId}
            notes={notes}
            onStatusChange={setStatus}
            onStaffChange={setStaffId}
            onNotesChange={setNotes}
            statusOptions={statusOptions}
            staffOptions={staffOptions}
            isUploading={isUploading}
            onFileUpload={handleUploadAfter}
          />
          <ServiceRequestActions
            requestId={row.id}
            onView={handleView}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </td>
    </tr>
  )
}
