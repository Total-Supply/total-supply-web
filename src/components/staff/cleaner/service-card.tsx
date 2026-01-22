'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Phone,
  PlayCircle,
  User,
} from 'lucide-react'

import { ServiceStatusBadge } from './service-status-badge'

type ServiceCardProps = {
  service: {
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
  onAccept: () => void
  onStart: () => void
  onProgress: () => void
  onComplete: () => void
  isLoading: boolean
}

export function ServiceCard({
  service,
  onAccept,
  onStart,
  onProgress,
  onComplete,
  isLoading,
}: ServiceCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not specified'
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActionButton = () => {
    if (service.status === 'ASSIGNED' && !service.acceptedAt) {
      return (
        <Button
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
          colorPalette="green"
          onClick={onAccept}
          disabled={isLoading}
          className="w-full"
        >
          Accept Service
        </Button>
      )
    }

    if (
      service.status === 'ASSIGNED' &&
      service.acceptedAt &&
      !service.startedAt
    ) {
      return (
        <Button
          leftIcon={<PlayCircle className="h-4 w-4" />}
          colorPalette="blue"
          onClick={onStart}
          disabled={isLoading}
          className="w-full"
        >
          Start Service
        </Button>
      )
    }

    if (service.status === 'IN_PROGRESS') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button
            leftIcon={<ArrowRight className="h-4 w-4" />}
            variant="outline"
            onClick={onProgress}
            disabled={isLoading}
          >
            Update
          </Button>
          <Button
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            colorPalette="green"
            onClick={onComplete}
            disabled={isLoading}
          >
            Complete
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-sm font-medium text-primary">
              #{service.request.requestNumber}
            </p>
            <ServiceStatusBadge status={service.status} showIcon={true} />
          </div>
          {service.request.beforePhotos.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
              <ImageIcon className="h-3 w-3" />
              <span>{service.request.beforePhotos.length} photos</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.request.description}
          </p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{service.request.customer.name}</span>
          </div>
          {service.request.customer.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{service.request.customer.phone}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {service.request.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span>
              {service.request.address.line1}, {service.request.address.city}
            </span>
          </div>
        )}

        {/* Scheduled Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(service.request.requestedDate)}</span>
        </div>

        {/* Before Photos Preview */}
        {service.request.beforePhotos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {service.request.beforePhotos.slice(0, 3).map((photo) => (
              <img
                key={photo.id}
                src={photo.url}
                alt="Before"
                className="h-16 w-16 rounded-lg object-cover ring-1 ring-border"
              />
            ))}
            {service.request.beforePhotos.length > 3 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-xs font-medium">
                +{service.request.beforePhotos.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {getActionButton()}
      </div>
    </MotionBox>
  )
}
