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

type CompleteServiceDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { notes: string; photos: string[] }) => void
  isSubmitting: boolean
}

export function CompleteServiceDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CompleteServiceDialogProps) {
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes('')
      setPhotos([])
      setError('')
      onClose()
    }
  }

  const handleSubmit = () => {
    setError('')

    if (photos.length < 2) {
      setError('Please upload at least 2 after photos')
      return
    }
    if (photos.length > 3) {
      setError('Maximum 3 photos allowed')
      return
    }
    if (!notes.trim() || notes.trim().length < 10) {
      setError(
        'Please provide detailed completion notes (minimum 10 characters)',
      )
      return
    }

    onSubmit({ notes: notes.trim(), photos })
    setNotes('')
    setPhotos([])
    setError('')
  }

  const handlePhotoUpload = (url: string) => {
    if (photos.length >= 3) {
      setError('Maximum 3 photos allowed')
      return
    }
    setPhotos((prev) => [...prev, url])
    setError('')
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
    setError('')
  }

  const isValid =
    photos.length >= 2 && photos.length <= 3 && notes.trim().length >= 10

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
                  Complete Service
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Finalize the cleaning service
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
                      <li>• 2-3 after photos showing completed work</li>
                      <li>
                        • Detailed completion notes (minimum 10 characters)
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
                <label
                  htmlFor="completion-notes"
                  className="text-sm font-medium text-foreground"
                >
                  Completion Notes <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="completion-notes"
                  placeholder="E.g., 'All rooms thoroughly cleaned. Dusted all surfaces, vacuumed carpets, mopped floors. Kitchen and bathrooms sanitized. No issues encountered.'"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value)
                    setError('')
                  }}
                  rows={5}
                  required
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {notes.length} characters (minimum 10 required)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  After Photos <span className="text-red-500">*</span>
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`After ${index + 1}`}
                          className="h-28 w-full rounded-lg object-cover ring-2 ring-emerald-500/30"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          type="button"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-3 w-3 text-white" />
                        </button>
                        <div className="absolute bottom-1.5 left-1.5 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {photos.length < 3 && (
                  <div className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                    <ImageUploader onUploadComplete={handlePhotoUpload} />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {photos.length}/3 photos uploaded (2-3 required)
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
              Complete Service
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
