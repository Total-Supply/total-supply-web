'use client'

import { AcceptServiceDialog } from '@/src/components/cleaner/services/accept-service-dialog'
import { CleanerServicesHeader } from '@/src/components/cleaner/services/cleaner-services-header'
import { CleanerStatsOverview } from '@/src/components/cleaner/services/cleaner-stats-overview'
import { CompleteServiceDialog } from '@/src/components/cleaner/services/complete-service-dialog'
import { ProgressUpdateDialog } from '@/src/components/cleaner/services/progress-update-dialog'
import { ServiceCard } from '@/src/components/cleaner/services/service-card'
import { StartServiceDialog } from '@/src/components/cleaner/services/start-service-dialog'
import { useToast } from '@/src/hooks/use-toast'
import { AlertCircle } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

type ServiceAssignment = {
  id: number
  status: string
  assignedAt: string
  acceptedAt: string | null
  startedAt: string | null
  request: {
    id: number
    requestNumber: string
    type: string
    status: string
    requestedDate: string | null
    createdAt: string
    description: string
    notes: string | null
    customer: {
      id: number
      name: string
      phone: string | null
    }
    address: {
      line1: string
      line2?: string | null
      city: string
      postalCode: string
      country?: string | null
    } | null
    beforePhotos: Array<{ id: number; url: string }>
  }
}

type Stats = {
  completedToday: number
  pendingCount: number
  completedMonth: number
  completionRate: number
  averageRating: number | null
  ratingCount: number
}

const STORAGE_KEY = 'total-supply-cleaner-last-seen'

export default function CleanerServicesPage() {
  const toast = useToast()

  const [services, setServices] = useState<ServiceAssignment[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [startDialogOpen, setStartDialogOpen] = useState(false)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] =
    useState<ServiceAssignment | null>(null)

  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 0
  })

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (date) params.set('date', date)

      const response = await fetch(
        `/api/staff/cleaner/services?${params.toString()}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load services')
      }

      setServices(data.data || [])
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/staff/cleaner/stats')
      const data = await response.json()

      if (!response.ok) throw new Error('Failed to load stats')

      setStats(data.data)
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await Promise.all([fetchServices(), fetchStats()])
      setIsLoading(false)
    }
    load()
  }, [status, date])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchServices(), fetchStats()])
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

  const isUpcoming = (entry: ServiceAssignment) => {
    if (!entry.request.requestedDate) return false
    const scheduled = new Date(entry.request.requestedDate).getTime()
    const now = Date.now()
    return scheduled > now && scheduled - now < 48 * 60 * 60 * 1000 // 48 hours
  }

  const handleAccept = async () => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/cleaner/services/${selectedService.request.id}/accept`,
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
      await Promise.all([fetchServices(), fetchStats()])
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

  const handleStart = async () => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/cleaner/services/${selectedService.request.id}/start`,
        { method: 'POST' },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to start service')
      }

      toast({
        title: 'Service started',
        description: 'Customer has been notified',
        status: 'success',
        duration: 2500,
      })

      setStartDialogOpen(false)
      setSelectedService(null)
      await Promise.all([fetchServices(), fetchStats()])
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

  const handleProgress = async (data: { notes?: string; photos: string[] }) => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/cleaner/services/${selectedService.request.id}/progress`,
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

  const handleComplete = async (data: { notes: string; photos: string[] }) => {
    if (!selectedService) return

    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/cleaner/services/${selectedService.request.id}/complete`,
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
      await Promise.all([fetchServices(), fetchStats()])
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
      <CleanerServicesHeader
        newCount={newCount}
        date={date}
        status={status}
        onDateChange={setDate}
        onStatusChange={setStatus}
        onRefresh={handleRefresh}
        onMarkAllRead={markAllSeen}
        isRefreshing={isRefreshing}
      />

      {stats && <CleanerStatsOverview stats={stats} isLoading={isLoading} />}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[540px] animate-pulse rounded-xl bg-muted/50"
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
            {status || date
              ? 'Try adjusting your filters'
              : 'No assigned services yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onAccept={() => {
                setSelectedService(service)
                setAcceptDialogOpen(true)
              }}
              onStart={() => {
                setSelectedService(service)
                setStartDialogOpen(true)
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
              isUpcoming={isUpcoming(service)}
            />
          ))}
        </div>
      )}

      {selectedService && (
        <>
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
              customer: selectedService.request.customer,
              address: selectedService.request.address,
              requestedDate: selectedService.request.requestedDate,
            }}
          />

          <StartServiceDialog
            isOpen={startDialogOpen}
            onClose={() => {
              setStartDialogOpen(false)
              setSelectedService(null)
            }}
            onConfirm={handleStart}
            isSubmitting={actionLoading}
            requestNumber={selectedService.request.requestNumber}
          />
        </>
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
