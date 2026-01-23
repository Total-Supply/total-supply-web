'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import { AlertTriangle, X, XCircle } from 'lucide-react'

import { useState } from 'react'

type DeclineOrderDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    reason: string
    notes?: string
    notifyCustomer: boolean
  }) => void
  isSubmitting: boolean
  orderNumber: string
}

const DECLINE_REASONS = [
  { label: 'Out of stock', value: 'Out of stock' },
  { label: 'Not enough time', value: 'Not enough time' },
  { label: 'Equipment issue', value: 'Equipment issue' },
  { label: 'Other', value: 'Other' },
]

export function DeclineOrderDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  orderNumber,
}: DeclineOrderDialogProps) {
  const [reason, setReason] = useState(DECLINE_REASONS[0].value)
  const [notes, setNotes] = useState('')
  const [notifyCustomer, setNotifyCustomer] = useState(true)

  const handleClose = () => {
    if (!isSubmitting) {
      setReason(DECLINE_REASONS[0].value)
      setNotes('')
      setNotifyCustomer(true)
      onClose()
    }
  }

  const handleSubmit = () => {
    onSubmit({
      reason,
      notes: notes.trim() || undefined,
      notifyCustomer,
    })
    setReason(DECLINE_REASONS[0].value)
    setNotes('')
    setNotifyCustomer(true)
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && handleClose()}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Decline Order
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Order will be reassigned
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-500/10 p-3.5 border border-amber-500/20">
                <div className="flex gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <p className="font-semibold mb-1">Important</p>
                    <p>
                      Order <strong>#{orderNumber}</strong> will be reassigned
                      to another salesman. Please provide a reason for
                      declining.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="decline-reason"
                  className="text-sm font-medium text-foreground"
                >
                  Reason for Declining <span className="text-red-500">*</span>
                </label>
                <AppSelect
                  value={reason}
                  onChange={setReason}
                  options={DECLINE_REASONS}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="decline-notes"
                  className="text-sm font-medium text-foreground"
                >
                  Additional Notes{' '}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Textarea
                  id="decline-notes"
                  placeholder="E.g., 'Main ingredient unavailable until tomorrow'"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Provide context for management review
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <Checkbox
                    checked={notifyCustomer}
                    onCheckedChange={(checked) =>
                      setNotifyCustomer(Boolean(checked))
                    }
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Notify customer about delay
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Customer will receive an email explaining the delay and
                      reassignment
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              colorPalette="red"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Decline Order
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
