'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import { ServiceDetailHeader } from './service-detail-header'
import { ServiceDetailsCard } from './service-details-card'
import { ServiceITHistory } from './service-it-history'
import { ServicePhotosSection } from './service-photos-section.tsx'
import { ServiceProgressTracker } from './service-progress-tracker'
import { ServiceRatingForm } from './service-rating-form'
import { ServiceStaffCard } from './service-staff-card'

export type ServicePhoto = {
  id: number
  url: string
  type: string
}

export type TimelineEntry = {
  status: string
  at: string
  by: string
}

export type StaffInfo = {
  id: number
  name: string
  phone?: string | null
  profileImage?: string | null
  rating?: number | null
  ratingCount?: number
  assignedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  notes?: string | null
  timeSpentMinutes?: number | null
  completionNotes?: string | null
  solutionSummary?: string | null
  followUpRecommendations?: string | null
}

export type RatingInfo = {
  id: number
  score: number
  review?: string | null
  wouldRecommend: boolean
}

export type ServiceDetail = {
  id: number
  requestNumber: string
  type: string
  category?: string | null
  status: string
  priority: string
  description: string
  notes?: string | null
  createdAt: string
  requestedDate?: string | null
  address?: {
    line1: string
    line2?: string | null
    city: string
    postalCode: string
  } | null
  beforePhotos: ServicePhoto[]
  progressPhotos: ServicePhoto[]
  afterPhotos: ServicePhoto[]
  timeline: TimelineEntry[]
  staff?: StaffInfo | null
  rating?: RatingInfo | null
  itHistory?: {
    id: number
    requestNumber: string
    status: string
    createdAt: string
    description?: string | null
    notes?: string | null
  }[]
}

export const STATUS_STEPS = ['RECEIVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

export default function ServiceRequestDetailPageEnhanced() {
  const params = useParams()
  const requestId = params?.id as string | undefined
  const toast = useToast()

  const [service, setService] = useState<ServiceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previousStatus, setPreviousStatus] = useState<string | null>(null)

  const fetchService = async () => {
    if (!requestId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/service-requests/${requestId}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unable to load service')
      }
      setService(data.data)
    } catch (error) {
      console.error('Failed to load service request', error)
      toast({
        title: 'Failed to load service',
        description:
          error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchService()
  }, [requestId])

  // Status change notifications
  useEffect(() => {
    if (!service?.status) return

    if (previousStatus && previousStatus !== service.status) {
      if (service.status === 'IN_PROGRESS') {
        toast({
          title: 'Staff arrived! 🚗',
          description: 'Your service is now in progress',
          status: 'info',
          duration: 3000,
        })
      } else if (service.status === 'RESOLVED') {
        toast({
          title: 'Service completed! ✅',
          description: 'Please rate your experience',
          status: 'success',
          duration: 4000,
        })
      }
    }

    setPreviousStatus(service.status)
  }, [service?.status, previousStatus])

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchService()
    }, 15000)
    return () => clearInterval(interval)
  }, [requestId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <Container maxW="container.xl" className="px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Loading service request...
            </p>
          </div>
        </Container>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <Container maxW="container.xl" className="px-4 py-16">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">
              Service Request Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              This service request doesn&#39;t exist or you don&#39;t have
              access to it.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container maxW="container.xl" className="relative px-4 py-8 md:py-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>

          <ServiceDetailHeader service={service} />
        </Container>
      </div>

      {/* Main Content */}
      <Container maxW="container.xl" className="px-4 py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            <ServiceProgressTracker
              status={service.status}
              timeline={service.timeline}
            />

            {/* Service Details */}
            <ServiceDetailsCard service={service} />

            {/* Staff Card */}
            {service.staff && (
              <ServiceStaffCard staff={service.staff} status={service.status} />
            )}

            {/* Photos */}
            <ServicePhotosSection service={service} />

            {/* Rating Form (if resolved and no rating) */}
            {service.status === 'RESOLVED' && !service.rating && (
              <ServiceRatingForm
                serviceId={service.id}
                onRatingSubmitted={fetchService}
              />
            )}

            {/* IT History (if IT Support) */}
            {service.type === 'IT_SUPPORT' && service.itHistory && (
              <ServiceITHistory
                currentDescription={service.description}
                currentNotes={service.notes}
                history={service.itHistory}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm sticky top-24"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  📞 Contact Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  📄 Download Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  🔄 Request Update
                </Button>
              </div>
            </MotionBox>
          </div>
        </div>
      </Container>
    </div>
  )
}
