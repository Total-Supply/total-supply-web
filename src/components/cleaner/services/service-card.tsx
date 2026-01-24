'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
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
      type: string
      status: string
      description: string
      requestedDate: string | null
      notes: string | null
      customer: {
        name: string
        phone: string | null
      }
      address: {
        line1: string
        line2?: string | null
        city: string
        postalCode: string
      } | null
      beforePhotos: Array<{ id: number; url: string }>
    }
  }
  onAccept: () => void
  onStart: () => void
  onProgress: () => void
  onComplete: () => void
  isLoading?: boolean
  isNew?: boolean
  isUpcoming?: boolean
}

export function ServiceCard({
  service,
  onAccept,
  onStart,
  onProgress,
  onComplete,
  isLoading = false,
  isNew = false,
  isUpcoming = false,
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

  const getActionButtons = () => {
    const { status } = service.request
    const { acceptedAt, startedAt } = service

    if (status === 'ASSIGNED' && !acceptedAt) {
      return (
        <Button
          onClick={onAccept}
          disabled={isLoading}
          className="w-full"
          colorPalette="green"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Accept Service
        </Button>
      )
    }

    if (status === 'ASSIGNED' && acceptedAt && !startedAt) {
      return (
        <Button
          onClick={onStart}
          disabled={isLoading}
          className="w-full"
          colorPalette="blue"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Start Cleaning
        </Button>
      )
    }

    if (status === 'IN_PROGRESS') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onProgress} disabled={isLoading} variant="outline">
            <ArrowRight className="mr-2 h-4 w-4" />
            Update
          </Button>
          <Button
            onClick={onComplete}
            disabled={isLoading}
            colorPalette="green"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
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
      className={`rounded-xl border bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
        isUpcoming
          ? 'border-amber-500/40 ring-2 ring-amber-500/20'
          : 'border-border/60'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-semibold text-primary">
                #{service.request.requestNumber}
              </p>
              {isNew && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
              )}
            </div>
            <ServiceStatusBadge status={service.request.status} />
          </div>
          <div className="flex flex-col items-end gap-2">
            {isUpcoming && (
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
                <Clock className="h-3 w-3" />
                Upcoming
              </div>
            )}
            {service.request.beforePhotos.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                <ImageIcon className="h-3 w-3" />
                {service.request.beforePhotos.length}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-sm leading-relaxed line-clamp-2">
            {service.request.description}
          </p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{service.request.customer.name}</span>
          </div>
          {service.request.customer.phone && (
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Phone className="h-4 w-4 text-emerald-500" />
              </div>
              <a
                href={`tel:${service.request.customer.phone}`}
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {service.request.customer.phone}
              </a>
            </div>
          )}
        </div>

        {/* Address */}
        {service.request.address && (
          <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{service.request.address.line1}</p>
              {service.request.address.line2 && (
                <p className="text-muted-foreground">
                  {service.request.address.line2}
                </p>
              )}
              <p className="text-muted-foreground">
                {service.request.address.city}{' '}
                {service.request.address.postalCode}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-2 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">Scheduled</span>
            </div>
            <span className="font-medium tabular-nums">
              {formatDate(service.request.requestedDate)}
            </span>
          </div>
          {service.acceptedAt && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="font-medium">Accepted</span>
              </div>
              <span className="font-medium tabular-nums">
                {formatDate(service.acceptedAt)}
              </span>
            </div>
          )}
          {service.startedAt && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-purple-500">
                <PlayCircle className="h-3.5 w-3.5" />
                <span className="font-medium">Started</span>
              </div>
              <span className="font-medium tabular-nums">
                {formatDate(service.startedAt)}
              </span>
            </div>
          )}
        </div>

        {/* Special Notes */}
        {service.request.notes && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Special Instructions
                </p>
                <p className="text-sm text-amber-700/90 dark:text-amber-300/90">
                  {service.request.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Before Photos */}
        {service.request.beforePhotos.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2.5">
              Before Photos
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {service.request.beforePhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => window.open(photo.url, '_blank')}
                  className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-border transition-all hover:ring-2 hover:ring-primary"
                >
                  <img
                    src={photo.url}
                    alt="Before"
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2">{getActionButtons()}</div>
      </div>
    </MotionBox>
  )
}
