'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { AlertTriangle, X } from 'lucide-react'

type DeleteConfirmationDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Confirm Account Deletion
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  This action will schedule your account for deletion
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-500/10 p-4 border border-amber-500/20">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  ⚠️ Important Information
                </p>
                <ul className="mt-2 space-y-1 text-sm text-amber-600/80 dark:text-amber-400/80">
                  <li>• Your account will be anonymized in 30 days</li>
                  <li>• You can restore your account within this period</li>
                  <li>
                    • Orders and services are retained for legal compliance
                  </li>
                  <li>• Personal identifiers will be permanently removed</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                Are you sure you want to proceed with account deletion? This
                will schedule the anonymization of your personal data.
              </p>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="red"
              onClick={onConfirm}
              loading={isDeleting}
            >
              Confirm Deletion
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
