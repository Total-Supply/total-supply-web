'use client'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Image as ImageIcon,
  Lightbulb,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react'

import { ITServiceStatusBadge } from '../services/it-service-status-badge'

type TicketDetailDialogProps = {
  isOpen: boolean
  onClose: () => void
  ticket: {
    id: number
    requestNumber: string
    status: string
    priority: string
    description: string
    notes: string | null
    createdAt: string
    requestedDate: string | null
    customer: {
      name: string
      phone: string | null
    }
    address: {
      line1: string
      line2: string | null
      city: string
      postalCode: string
    } | null
    assignment: {
      id: number
      assignedAt: string
      acceptedAt: string | null
      startedAt: string | null
      completedAt: string | null
      notes: string | null
      timeSpentMinutes: number | null
      completionNotes: string | null
      solutionSummary: string | null
      followUpRecommendations: string | null
    } | null
    photos: Array<{
      id: number
      url: string
      type: string
      createdAt: string
    }>
  }
}

export function TicketDetailDialog({
  isOpen,
  onClose,
  ticket,
}: TicketDetailDialogProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set'
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const photosByType = {
    BEFORE: ticket.photos.filter((p) => p.type === 'BEFORE'),
    PROGRESS: ticket.photos.filter((p) => p.type === 'PROGRESS'),
    AFTER: ticket.photos.filter((p) => p.type === 'AFTER'),
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold flex items-center gap-2">
                      Ticket #{ticket.requestNumber}
                      {ticket.status === 'RESOLVED' && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      )}
                    </Dialog.Title>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Created {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ITServiceStatusBadge status={ticket.status} />
                  <ITServiceStatusBadge
                    status={ticket.status}
                    priority={ticket.priority}
                  />
                </div>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6 space-y-6">
            {/* Issue Description */}
            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold">Issue Description</h3>
              </div>
              <p className="text-sm leading-relaxed">{ticket.description}</p>
            </div>

            {/* Customer & Location */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Customer</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{ticket.customer.name}</p>
                  {ticket.customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <a
                        href={`tel:${ticket.customer.phone}`}
                        className="text-primary hover:underline"
                      >
                        {ticket.customer.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {ticket.address && (
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Location</h3>
                  </div>
                  <div className="text-sm space-y-0.5">
                    <p>{ticket.address.line1}</p>
                    {ticket.address.line2 && <p>{ticket.address.line2}</p>}
                    <p className="text-muted-foreground">
                      {ticket.address.city} {ticket.address.postalCode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Special Notes */}
            {ticket.notes && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">
                      Special Instructions
                    </h3>
                    <p className="text-sm text-amber-700/90 dark:text-amber-300/90">
                      {ticket.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {ticket.assignment && (
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Timeline</h3>
                  {ticket.assignment.timeSpentMinutes && (
                    <Badge variant="subtle" className="ml-auto gap-1.5">
                      <Clock className="h-3 w-3" />
                      {ticket.assignment.timeSpentMinutes}m total
                    </Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                  {ticket.assignment.acceptedAt && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Accepted</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(ticket.assignment.acceptedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  {ticket.assignment.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                        <CheckCircle2 className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(ticket.assignment.completedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Troubleshooting Notes */}
            {ticket.assignment?.notes && (
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Troubleshooting Log</h3>
                </div>
                <div className="space-y-1 text-sm whitespace-pre-line text-muted-foreground font-mono">
                  {ticket.assignment.notes}
                </div>
              </div>
            )}

            {/* Solution Summary */}
            {ticket.assignment?.solutionSummary && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                      Solution Summary
                    </h3>
                    <p className="text-sm text-emerald-700/90 dark:text-emerald-300/90 leading-relaxed">
                      {ticket.assignment.solutionSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Completion Notes */}
            {ticket.assignment?.completionNotes && (
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Completion Notes</h3>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {ticket.assignment.completionNotes}
                </p>
              </div>
            )}

            {/* Follow-up Recommendations */}
            {ticket.assignment?.followUpRecommendations && (
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Follow-up Recommendations
                    </h3>
                    <p className="text-sm text-blue-700/90 dark:text-blue-300/90 leading-relaxed">
                      {ticket.assignment.followUpRecommendations}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Photos */}
            {ticket.photos.length > 0 && (
              <div className="space-y-4">
                {Object.entries(photosByType).map(
                  ([type, photos]) =>
                    photos.length > 0 && (
                      <div
                        key={type}
                        className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold">
                            {type === 'BEFORE' && 'Diagnostic Photos'}
                            {type === 'PROGRESS' && 'Progress Photos'}
                            {type === 'AFTER' && 'Completion Photos'}
                          </h3>
                          <Badge variant="subtle">{photos.length}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {photos.map((photo) => (
                            <button
                              key={photo.id}
                              onClick={() => window.open(photo.url, '_blank')}
                              className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-border transition-all hover:ring-2 hover:ring-primary"
                            >
                              <img
                                src={photo.url}
                                alt={`${type} photo`}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            )}
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
