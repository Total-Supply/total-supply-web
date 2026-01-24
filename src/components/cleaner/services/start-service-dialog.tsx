'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { Info, PlayCircle, X } from 'lucide-react'

type StartServiceDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting: boolean
  requestNumber: string
}

export function StartServiceDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  requestNumber,
}: StartServiceDialogProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && !isSubmitting && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-md">
          <Dialog.CloseTrigger
            className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
                <PlayCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Start Service
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Begin cleaning work
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="rounded-lg bg-blue-500/10 p-3.5 border border-blue-500/20">
              <div className="flex gap-2.5">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Starting service <strong>#{requestNumber}</strong>. The
                  customer will be notified that you&apos;ve begun the cleaning
                  work.
                </p>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              colorPalette="blue"
              onClick={onConfirm}
              loading={isSubmitting}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Now
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
