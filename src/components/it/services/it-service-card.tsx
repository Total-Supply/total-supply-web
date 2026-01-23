'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  History,
  MapPin,
  Phone,
  User,
} from 'lucide-react'

import { ITServiceStatusBadge } from './it-service-status-badge'

type ITServiceCardProps = {
  service: {
    id: number
    status: string
    assignedAt: string
    acceptedAt?: string | null
    notes?: string | null
    timeSpentMinutes?: number | null
    request: {
      id: number
      requestNumber: string
      status: string
      priority: string
      description: string
      notes?: string | null
      requestedDate?: string | null
      customer: {
        name: string
        phone?: string | null
      }
      address: {
        line1: string
        line2?: string | null
        city: string
        postalCode: string
      } | null
      photos: Array<{ id: number; url: string }>
      history: Array<{ id: number; requestNumber: string; status: string }>
    }
  }
  onAccept: () => void
  onProgress: () => void
  onComplete: () => void
  isLoading?: boolean
  isNew?: boolean
  isUrgent?: boolean
}

export function ITServiceCard({
  service,
  onAccept,
  onProgress,
  onComplete,
  isLoading = false,
  isNew = false,
  isUrgent = false,
}: ITServiceCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled'
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

    if (status === 'ASSIGNED' && !service.acceptedAt) {
      return (
        <Button
          onClick={onAccept}
          disabled={isLoading}
          className="w-full"
          colorPalette="blue"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Accept Service
        </Button>
      )
    }

    if (status === 'IN_PROGRESS') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onProgress} disabled={isLoading} variant="outline">
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
        isUrgent
          ? 'border-red-500/40 ring-2 ring-red-500/20'
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
            <div className="flex items-center gap-2">
              <ITServiceStatusBadge status={service.request.status} />
              <ITServiceStatusBadge
                status={service.request.status}
                priority={service.request.priority}
              />
            </div>
          </div>
          {service.timeSpentMinutes && (
            <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-1.5 ring-1 ring-purple-500/20">
              <span className="text-sm font-semibold text-purple-400">
                {service.timeSpentMinutes}m
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Issue Description
          </p>
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

        {/* Diagnostic Photos */}
        {service.request.photos.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2.5 flex items-center gap-2">
              <FileText className="h-3 w-3" />
              Diagnostic Photos ({service.request.photos.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {service.request.photos.slice(0, 3).map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => window.open(photo.url, '_blank')}
                  className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-border transition-all hover:ring-2 hover:ring-primary"
                >
                  <img
                    src={photo.url}
                    alt="Diagnostic"
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

        {/* Service History */}
        {service.request.history.length > 0 && (
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <History className="h-3 w-3" />
              Previous IT History
            </p>
            <div className="space-y-1">
              {service.request.history.slice(0, 2).map((history) => (
                <div key={history.id} className="text-xs text-muted-foreground">
                  {history.requestNumber} - {history.status.toLowerCase()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-2 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Scheduled</span>
            <span className="font-medium tabular-nums">
              {formatDate(service.request.requestedDate ?? null)}
            </span>
          </div>
          {service.acceptedAt && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-500">Accepted</span>
              <span className="font-medium tabular-nums">
                {formatDate(service.acceptedAt)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2">{getActionButtons()}</div>
      </div>
    </MotionBox>
  )
}
