'use client'

import { useToast } from '@/src/hooks/use-toast'
import { AlertCircle } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

import { AcceptServiceDialog } from './accept-service-dialog'
import { CompleteServiceDialog } from './complete-service-dialog'
import { ITServiceCard } from './it-service-card'
import { ITServicesHeader } from './it-services-header'
import { ProgressUpdateDialog } from './progress-update-dialog'

type ITAssignment = {
  id: number
  status: string
  assignedAt: string
  acceptedAt?: string | null
  startedAt?: string | null
  notes?: string | null
  timeSpentMinutes?: number | null
  request: {
    id: number
    requestNumber: string
    type: string
    status: string
    priority: string
    requestedDate?: string | null
    createdAt: string
    description: string
    notes?: string | null
    customer: {
      id: number
      name: string
      phone?: string | null
    }
    address: {
      line1: string
      line2?: string | null
      city: string
      postalCode: string
      country?: string | null
    } | null
    photos: Array<{ id: number; url: string; type: string }>
    history: Array<{
      id: number
      requestNumber: string
      status: string
      createdAt: string
    }>
  }
}

const STORAGE_KEY = 'total-supply-it-last-seen'

export default function ITServicesPage() {
  const toast = useToast()

  const [services, setServices] = useState<ITAssignment[]>([])
  const [status, setStatus] = useState('ALL')
  const [priority, setPriority] = useState('ALL')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ITAssignment | null>(
    null,
  )

  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 0
  })

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') params.set('status', status)
      if (priority !== 'ALL') params.set('priority', priority)
      if (date) params.set('date', date)

      const response = await fetch(
        `/api/staff/it/services?${params.toString()}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load services')
      }

      const list = (data.data || []) as ITAssignment[]
      list.sort((a, b) => {
        const aDate = a.request.requestedDate || a.request.createdAt
        const bDate = b.request.requestedDate || b.request.createdAt
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      })
      setServices(list)
    } catch (error) {
      toast({
        title: 'Failed to load services',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await fetchServices()
      setIsLoading(false)
    }
    load()
  }, [status, priority, date])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchServices()
    setIsRefreshing(false)
    toast({
      title: 'Services refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const markAllSeen = () => {
    const latestTime = Date.now()
    setLastSeen(latestTime)
    window.localStorage.setItem(STORAGE_KEY, String(latestTime))
    toast({
      title: 'All marked as read',
      status: 'success',
      duration: 2000,
    })
  }

  const newCount = useMemo(() => {
    if (!lastSeen) return 0
    return services.filter(
      (service) => new Date(service.request.createdAt).getTime() > lastSeen,
    ).length
  }, [services, lastSeen])

  const uploadPhotos = async (files: File[]) => {
    const uploads = files.slice(0, 5)
    const results: string[] = []
    for (const file of uploads) {
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
      results.push(data.data.publicUrl as string)
    }
    return results
  }

  const handleAccept = async () => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/it/services/${selectedService.request.id}/accept`,
        { method: 'POST' },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to accept service')
      }

      toast({
        title: 'Service accepted',
        description: 'Customer has been notified',
        status: 'success',
        duration: 2500,
      })

      setAcceptDialogOpen(false)
      setSelectedService(null)
      await fetchServices()
    } catch (error) {
      toast({
        title: 'Action failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleProgress = async (data: {
    notes?: string
    photos: string[]
    timeSpentMinutes?: number
  }) => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/it/services/${selectedService.request.id}/progress`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to update progress')
      }

      toast({
        title: 'Progress updated',
        description: 'Customer has been notified',
        status: 'success',
        duration: 2500,
      })

      setProgressDialogOpen(false)
      setSelectedService(null)
      await fetchServices()
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async (data: {
    completionNotes: string
    solutionSummary: string
    followUpRecommendations?: string
    photos: string[]
  }) => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/it/services/${selectedService.request.id}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to complete service')
      }

      toast({
        title: 'Service completed',
        description: 'Great job! Customer has been notified.',
        status: 'success',
        duration: 3000,
      })

      setCompleteDialogOpen(false)
      setSelectedService(null)
      await fetchServices()
    } catch (error) {
      toast({
        title: 'Completion failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <ITServicesHeader
        newCount={newCount}
        date={date}
        status={status}
        priority={priority}
        onDateChange={setDate}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onRefresh={handleRefresh}
        onMarkAllRead={markAllSeen}
        isRefreshing={isRefreshing}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[560px] animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">No services found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {status !== 'ALL' || priority !== 'ALL' || date
              ? 'Try adjusting your filters'
              : 'No assigned services yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ITServiceCard
              key={service.id}
              service={service}
              onAccept={() => {
                setSelectedService(service)
                setAcceptDialogOpen(true)
              }}
              onProgress={() => {
                setSelectedService(service)
                setProgressDialogOpen(true)
              }}
              onComplete={() => {
                setSelectedService(service)
                setCompleteDialogOpen(true)
              }}
              isLoading={actionLoading}
              isNew={new Date(service.request.createdAt).getTime() > lastSeen}
              isUrgent={
                service.request.priority === 'URGENT' ||
                service.request.priority === 'HIGH'
              }
            />
          ))}
        </div>
      )}

      {selectedService && (
        <AcceptServiceDialog
          isOpen={acceptDialogOpen}
          onClose={() => {
            setAcceptDialogOpen(false)
            setSelectedService(null)
          }}
          onConfirm={handleAccept}
          isSubmitting={actionLoading}
          service={{
            requestNumber: selectedService.request.requestNumber,
            priority: selectedService.request.priority,
            customer: selectedService.request.customer,
            address: selectedService.request.address,
            requestedDate: selectedService.request.requestedDate ?? null,
            description: selectedService.request.description,
          }}
        />
      )}

      <ProgressUpdateDialog
        isOpen={progressDialogOpen}
        onClose={() => {
          setProgressDialogOpen(false)
          setSelectedService(null)
        }}
        onSubmit={handleProgress}
        isSubmitting={actionLoading}
      />

      <CompleteServiceDialog
        isOpen={completeDialogOpen}
        onClose={() => {
          setCompleteDialogOpen(false)
          setSelectedService(null)
        }}
        onSubmit={handleComplete}
        isSubmitting={actionLoading}
      />
    </div>
  )
}
