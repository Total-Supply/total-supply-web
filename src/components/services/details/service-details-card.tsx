import { MotionBox } from '@/src/components/motion/box'
import { Calendar, FileText, MapPin, StickyNote } from 'lucide-react'

import { ServiceDetail } from './service-request-detail-page'

type ServiceDetailsCardProps = {
  service: ServiceDetail
}

export function ServiceDetailsCard({ service }: ServiceDetailsCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Service Details</h3>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
          <p className="text-xs text-muted-foreground mb-2">Description</p>
          <p className="text-sm leading-relaxed">{service.description}</p>
        </div>

        {/* Special Instructions */}
        {service.notes && (
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
            <div className="flex items-start gap-2 mb-2">
              <StickyNote className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Special Instructions
              </p>
            </div>
            <p className="text-sm leading-relaxed">{service.notes}</p>
          </div>
        )}

        {/* Requested Date */}
        {service.requestedDate && (
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">
                Preferred Date & Time
              </p>
            </div>
            <p className="text-sm font-semibold">
              {new Date(service.requestedDate).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}

        {/* Service Address */}
        {service.address && (
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">Service Address</p>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium">{service.address.line1}</p>
              {service.address.line2 && (
                <p className="text-muted-foreground">{service.address.line2}</p>
              )}
              <p className="text-muted-foreground">
                {service.address.city}, {service.address.postalCode}
              </p>
              <p className="text-muted-foreground">Sri Lanka</p>
            </div>
          </div>
        )}
      </div>
    </MotionBox>
  )
}
