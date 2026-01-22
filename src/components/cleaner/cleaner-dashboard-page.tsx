'use client'

import { CleanerHeader } from '@/src/components/staff/cleaner/cleaner-header'
import { CleanerStats } from '@/src/components/staff/cleaner/cleaner-stats'
import { CompleteDialog } from '@/src/components/staff/cleaner/complete-dialog'
import { CompletionChart } from '@/src/components/staff/cleaner/completion-chart'
import { ProgressDialog } from '@/src/components/staff/cleaner/progress-dialog'
import { ServiceCard } from '@/src/components/staff/cleaner/service-card'
import { useToast } from '@/src/hooks/use-toast'

import { useEffect, useState } from 'react'

type Service = {
  id: number
  status: string
  assignedAt: string
  acceptedAt: string | null
  startedAt: string | null
  request: {
    id: number
    requestNumber: string
    description: string
    requestedDate: string | null
    customer: {
      name: string
      phone: string | null
    }
    address: {
      line1: string
      city: string
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
  chart: Array<{ date: string; count: number }>
  topCategories: Array<{ name: string; count: number }>
}

export default function CleanerDashboardPage() {
  const toast = useToast()

  const [services, setServices] = useState<Service[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadServices = async () => {
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (date) params.set('date', date)

      const response = await fetch(
        `/api/staff/cleaner/services?${params.toString()}`,
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error?.message || 'Failed to load services')
      setServices(data.data)
    } catch (error) {
      toast({
        title: 'Failed to load services',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/staff/cleaner/stats')
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error?.message || 'Failed to load stats')
      setStats(data.data)
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await Promise.all([loadServices(), loadStats()])
      setIsLoading(false)
    }
    load()
  }, [date, status])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([loadServices(), loadStats()])
    setIsRefreshing(false)
    toast({
      title: 'Services refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleAccept = async (serviceId: number) => {
    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/cleaner/services/${serviceId}/accept`,
        {
          method: 'POST',
        },
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error?.message || 'Failed to accept service')

      toast({
        title: 'Service accepted',
        status: 'success',
        duration: 2000,
      })
      await loadServices()
      await loadStats()
    } catch (error) {
      toast({
        title: 'Action failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleStart = async (serviceId: number) => {
    setActionLoading(true)
    try {
      const response = await fetch(
        `/api/staff/cleaner/services/${serviceId}/start`,
        {
          method: 'POST',
        },
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error?.message || 'Failed to start service')

      toast({
        title: 'Service started',
        status: 'success',
        duration: 2000,
      })
      await loadServices()
      await loadStats()
    } catch (error) {
      toast({
        title: 'Action failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
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
        `/api/staff/cleaner/services/${selectedService}/progress`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.error?.message || 'Failed to update progress')

      toast({
        title: 'Progress updated',
        status: 'success',
        duration: 2000,
      })
      setProgressDialogOpen(false)
      setSelectedService(null)
      await loadServices()
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
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
        `/api/staff/cleaner/services/${selectedService}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.error?.message || 'Failed to complete service')

      toast({
        title: 'Service completed',
        status: 'success',
        duration: 2000,
      })
      setCompleteDialogOpen(false)
      setSelectedService(null)
      await loadServices()
      await loadStats()
    } catch (error) {
      toast({
        title: 'Completion failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <CleanerHeader
        date={date}
        status={status}
        onDateChange={setDate}
        onStatusChange={setStatus}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {stats && (
        <>
          <CleanerStats stats={stats} isLoading={isLoading} />
          <CompletionChart data={stats.chart} isLoading={isLoading} />
        </>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Services</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-xl bg-muted/50"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
            <p className="text-muted-foreground">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAccept={() => handleAccept(service.request.id)}
                onStart={() => handleStart(service.request.id)}
                onProgress={() => {
                  setSelectedService(service.request.id)
                  setProgressDialogOpen(true)
                }}
                onComplete={() => {
                  setSelectedService(service.request.id)
                  setCompleteDialogOpen(true)
                }}
                isLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>

      <ProgressDialog
        isOpen={progressDialogOpen}
        onClose={() => {
          setProgressDialogOpen(false)
          setSelectedService(null)
        }}
        onSubmit={handleProgress}
        isSubmitting={actionLoading}
      />

      <CompleteDialog
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
