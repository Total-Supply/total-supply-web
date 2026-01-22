'use client'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import { AlertTriangle, X } from 'lucide-react'

type ApprovalUser = {
  id: number
  email: string
  name: string
  phone?: string | null
  status: string
  createdAt: string
}

type RejectDialogProps = {
  user: ApprovalUser | null
  reason: string
  onReasonChange: (reason: string) => void
  onConfirm: () => void
  onCancel: () => void
  isRejecting: boolean
}

export function RejectDialog({
  user,
  reason,
  onReasonChange,
  onConfirm,
  onCancel,
  isRejecting,
}: RejectDialogProps) {
  return (
    <Dialog.Root
      open={!!user}
      onOpenChange={(details) => !details.open && onCancel()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Reject User
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Provide a reason for rejection
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-4">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-3 border border-border/40">
                <p className="text-sm font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Reason for rejection{' '}
                  <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Please provide a detailed reason for rejecting this user..."
                  value={reason}
                  onChange={(event) => onReasonChange(event.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This reason will be sent to the user via email.
                </p>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onCancel}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="red"
              onClick={onConfirm}
              disabled={!reason.trim() || isRejecting}
              loading={isRejecting}
            >
              Confirm Rejection
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
