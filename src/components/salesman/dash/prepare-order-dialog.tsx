'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import { Image as ImageIcon, Info, PlayCircle, X } from 'lucide-react'

import { useState } from 'react'

type PrepareOrderDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { notes?: string; photoUrl?: string }) => void
  isSubmitting: boolean
  orderNumber: string
}

export function PrepareOrderDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  orderNumber,
}: PrepareOrderDialogProps) {
  const [notes, setNotes] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes('')
      setPhotoUrl(null)
      onClose()
    }
  }

  const handleSubmit = () => {
    onSubmit({
      notes: notes.trim() || undefined,
      photoUrl: photoUrl || undefined,
    })
    setNotes('')
    setPhotoUrl(null)
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
                <PlayCircle className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Mark as Preparing
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Update order status
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-500/10 p-3 border border-blue-500/20">
                <div className="flex gap-2.5">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Mark order <strong>#{orderNumber}</strong> as preparing. Add
                    optional notes or photos to keep the customer informed.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prep-notes"
                  className="text-sm font-medium text-foreground"
                >
                  Preparation Notes{' '}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Textarea
                  id="prep-notes"
                  placeholder="E.g., 'Starting preparation. All ingredients ready. ETA 20 minutes.'"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Share preparation updates with the customer
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Preparation Photo{' '}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>

                {photoUrl ? (
                  <div className="relative group">
                    <img
                      src={photoUrl}
                      alt="Preparation"
                      className="h-32 w-full rounded-lg object-cover ring-1 ring-border"
                    />
                    <button
                      onClick={() => setPhotoUrl(null)}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                    <ImageUploader onUploadComplete={setPhotoUrl} />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Show items being prepared (max 5MB)
                </p>
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
              colorPalette="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Mark Preparing
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
