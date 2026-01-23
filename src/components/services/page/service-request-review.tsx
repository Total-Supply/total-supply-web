'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Package,
  Sparkles,
  Wrench,
} from 'lucide-react'

import { ServiceRequestFormData } from './service-request-form'

type ServiceRequestReviewProps = {
  data: ServiceRequestFormData
  photoUrls: string[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

const PRIORITY_COLORS = {
  LOW: 'from-slate-500/20 to-slate-600/10 text-slate-700 dark:text-slate-400',
  MEDIUM: 'from-blue-500/20 to-blue-600/10 text-blue-700 dark:text-blue-400',
  HIGH: 'from-amber-500/20 to-amber-600/10 text-amber-700 dark:text-amber-400',
  URGENT: 'from-red-500/20 to-red-600/10 text-red-700 dark:text-red-400',
}

export function ServiceRequestReview({
  data,
  photoUrls,
  onBack,
  onSubmit,
  isSubmitting,
}: ServiceRequestReviewProps) {
  const ServiceIcon = data.type === 'CLEANING' ? Sparkles : Wrench

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Review Your Request</h3>
            <p className="text-sm text-muted-foreground">
              Please verify all details before submitting
            </p>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <ServiceIcon className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold">Service Details</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Service Type</p>
              <p className="text-sm font-semibold">
                {data.type === 'IT_SUPPORT'
                  ? 'IT Support'
                  : 'Cleaning Services'}
              </p>
            </div>
            {data.type === 'CLEANING' && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-sm font-semibold capitalize">
                  {data.category.replace(/_/g, ' ').toLowerCase()}
                </p>
              </div>
            )}
          </div>

          {data.serviceOfferingName && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Service Package</p>
              </div>
              <p className="text-sm font-semibold">
                {data.serviceOfferingName}
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Description</p>
            </div>
            <p className="text-sm leading-relaxed">{data.description}</p>
          </div>

          {data.notes && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
              <p className="text-xs text-muted-foreground mb-2">
                Special Instructions
              </p>
              <p className="text-sm leading-relaxed">{data.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule & Priority */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <h4 className="text-lg font-semibold">Schedule & Priority</h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.requestedDate && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
              <p className="text-xs text-muted-foreground mb-1">
                Preferred Date & Time
              </p>
              <p className="text-sm font-semibold">
                {new Date(data.requestedDate).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
            <p className="text-xs text-muted-foreground mb-2">Priority Level</p>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-br ring-1 ring-border/30 ${
                PRIORITY_COLORS[data.priority]
              }`}
            >
              <AlertCircle className="h-3 w-3" />
              {data.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Service Address */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
            <MapPin className="h-5 w-5 text-emerald-500" />
          </div>
          <h4 className="text-lg font-semibold">Service Address</h4>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-card/50 to-card/30 border border-border/60">
          <p className="text-sm font-medium">{data.line1}</p>
          {data.line2 && (
            <p className="text-sm text-muted-foreground mt-1">{data.line2}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {data.city}, {data.postalCode}
          </p>
          <p className="text-sm text-muted-foreground">Sri Lanka</p>
        </div>
      </div>

      {/* Photos */}
      {photoUrls.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
              <Camera className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Before Photos</h4>
              <p className="text-xs text-muted-foreground">
                {photoUrls.length} photo{photoUrls.length !== 1 ? 's' : ''}{' '}
                attached
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {photoUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted"
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Edit
        </Button>
        <Button
          colorPalette="primary"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Submit Request
            </>
          )}
        </Button>
      </div>

      {/* Info Message */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground text-center">
          💡 After submission, our team will review your request and contact you
          within 2 hours to confirm the booking and provide a final quote.
        </p>
      </div>
    </MotionBox>
  )
}
