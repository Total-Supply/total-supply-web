import { MotionBox } from '@/src/components/motion/box'
import { CheckCircle2, Clock, Phone, Star, User, Wrench } from 'lucide-react'

import { useMemo } from 'react'

import { StaffInfo } from './service-request-detail-page'

type ServiceStaffCardProps = {
  staff: StaffInfo
  status: string
}

export function ServiceStaffCard({ staff, status }: ServiceStaffCardProps) {
  const arrivalEstimate = useMemo(() => {
    if (!staff.assignedAt || status === 'RESOLVED') return null
    const base = new Date(staff.assignedAt)
    const eta = new Date(base.getTime() + 90 * 60 * 1000)
    return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [staff.assignedAt, status])

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
          <User className="h-5 w-5 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold">Assigned Staff</h3>
      </div>

      <div className="flex items-start gap-4">
        {/* Staff Avatar */}
        <div className="relative">
          <div className="h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/30">
            {staff.profileImage ? (
              <img
                src={staff.profileImage}
                alt={staff.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-primary">
                {staff.name.charAt(0)}
              </div>
            )}
          </div>
          {status === 'IN_PROGRESS' && (
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
              <Wrench className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Staff Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-lg font-semibold">{staff.name}</h4>
            <div className="flex items-center gap-4 mt-1">
              {/* Rating */}
              {staff.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">
                    {staff.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({staff.ratingCount || 0})
                  </span>
                </div>
              )}

              {/* Time Spent */}
              {staff.timeSpentMinutes && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{staff.timeSpentMinutes} min</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            {staff.phone && (
              <a
                href={`tel:${staff.phone}`}
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {staff.phone}
              </a>
            )}

            {/* ETA */}
            {arrivalEstimate && status !== 'RESOLVED' && (
              <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Estimated Arrival
                    </p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {arrivalEstimate}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Completion Time */}
            {staff.completedAt && (
              <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Completed At
                    </p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {new Date(staff.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Staff Notes */}
          {staff.notes && (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground mb-1">Staff Notes</p>
              <p className="text-sm">{staff.notes}</p>
            </div>
          )}

          {/* IT Support Specific */}
          {staff.solutionSummary && (
            <div className="space-y-2">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Solution Summary
                </p>
                <p className="text-sm">{staff.solutionSummary}</p>
              </div>

              {staff.followUpRecommendations && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Recommendations
                  </p>
                  <p className="text-sm">{staff.followUpRecommendations}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MotionBox>
  )
}
