'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { Calendar, CheckCircle2, Info, MapPin, User, X } from 'lucide-react'

type AcceptServiceDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting: boolean
  service: {
    requestNumber: string
    customer: { name: string }
    address: { line1: string; city: string } | null
    requestedDate: string | null
  }
}

export function AcceptServiceDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  service,
}: AcceptServiceDialogProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not specified'
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && !isSubmitting && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-lg">
          <Dialog.CloseTrigger
            className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Accept Service
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Confirm service acceptance
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-500/10 p-3.5 border border-blue-500/20">
                <div className="flex gap-2.5">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You are about to accept service{' '}
                    <strong>#{service.requestNumber}</strong>. The customer will
                    be notified immediately.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-sm font-medium">
                      {service.customer.name}
                    </p>
                  </div>
                </div>

                {service.address && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">
                        {service.address.line1}, {service.address.city}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Scheduled Time
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(service.requestedDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              colorPalette="green"
              onClick={onConfirm}
              loading={isSubmitting}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept Service
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
