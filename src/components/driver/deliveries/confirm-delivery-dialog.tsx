'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  X,
} from 'lucide-react'

import { useState } from 'react'

type ConfirmDeliveryDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { photoUrl: string; notes?: string }) => void
  isSubmitting: boolean
}

export function ConfirmDeliveryDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ConfirmDeliveryDialogProps) {
  const [notes, setNotes] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [error, setError] = useState('')

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes('')
      setPhotoUrl('')
      setError('')
      onClose()
    }
  }

  const handleSubmit = () => {
    setError('')

    if (!photoUrl) {
      setError('Delivery photo is required')
      return
    }

    onSubmit({
      photoUrl,
      notes: notes.trim() || undefined,
    })
    setNotes('')
    setPhotoUrl('')
    setError('')
  }

  const handlePhotoUpload = (url: string) => {
    setPhotoUrl(url)
    setError('')
  }

  const removePhoto = () => {
    setPhotoUrl('')
  }

  const isValid = !!photoUrl

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && handleClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-2xl">
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
                  Confirm Delivery
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Upload proof of delivery
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/20">
                <div className="flex gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <p className="font-semibold mb-1">Required Information</p>
                    <ul className="space-y-0.5 text-xs">
                      <li>• Photo proof showing delivered package/location</li>
                      <li>
                        • Optional delivery notes (customer feedback, location
                        details)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Delivery Photo <span className="text-red-500">*</span>
                </label>

                {photoUrl ? (
                  <div className="relative group">
                    <img
                      src={photoUrl}
                      alt="Delivery proof"
                      className="h-48 w-full rounded-lg object-cover ring-2 ring-emerald-500/30"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                    <ImageUploader onUploadComplete={handlePhotoUpload} />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {photoUrl ? 'Photo uploaded ✓' : 'Required - Max 5MB'}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="delivery-notes"
                  className="text-sm font-medium text-foreground"
                >
                  Delivery Notes{' '}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Textarea
                  id="delivery-notes"
                  placeholder="E.g., 'Package left at front door as requested' or 'Delivered to receptionist'"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value)
                    setError('')
                  }}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Add any relevant delivery details or customer interactions
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
              colorPalette="green"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!isValid}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Delivery
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
