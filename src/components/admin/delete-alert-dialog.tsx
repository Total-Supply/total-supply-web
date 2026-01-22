'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteAlertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemName?: string
  isLoading?: boolean
}

export function DeleteAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
}: DeleteAlertDialogProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose()
      }}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="flex items-center gap-3 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 animate-pulse">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <Dialog.Title className="text-lg font-semibold text-card-foreground">
              {title}
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body className="space-y-3 pt-0">
            <p className="text-sm text-muted-foreground">{description}</p>
            {itemName && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm font-medium text-card-foreground">
                  {itemName}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-destructive font-medium">
              <AlertTriangle className="h-3 w-3" />
              <span>This action cannot be undone.</span>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="red"
              onClick={onConfirm}
              disabled={isLoading}
              loading={isLoading}
              className="hover:shadow-lg hover:shadow-destructive/20"
            >
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
