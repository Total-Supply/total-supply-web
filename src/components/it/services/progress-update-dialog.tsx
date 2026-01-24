'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import {
  ArrowRight,
  Clock,
  Image as ImageIcon,
  Info,
  Trash2,
  X,
} from 'lucide-react'

import { useState } from 'react'

type ProgressUpdateDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    notes?: string
    photos: string[]
    timeSpentMinutes?: number
  }) => void
  isSubmitting: boolean
}

export function ProgressUpdateDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ProgressUpdateDialogProps) {
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [timeSpent, setTimeSpent] = useState('')

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes('')
      setPhotos([])
      setTimeSpent('')
      onClose()
    }
  }

  const handleSubmit = () => {
    onSubmit({
      notes: notes.trim() || undefined,
      photos,
      timeSpentMinutes: timeSpent ? Number(timeSpent) : undefined,
    })
    setNotes('')
    setPhotos([])
    setTimeSpent('')
  }

  const handlePhotoUpload = (url: string) => {
    if (photos.length < 5) {
      setPhotos((prev) => [...prev, url])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
                <ArrowRight className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Update Progress
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Share troubleshooting updates
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
                    Keep the customer informed with troubleshooting updates. Add
                    diagnostic photos and track time spent for accurate billing.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="time-spent"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Time Spent{' '}
                  <span className="text-muted-foreground">
                    (Optional, in minutes)
                  </span>
                </label>
                <Input
                  id="time-spent"
                  type="number"
                  min="1"
                  max="480"
                  placeholder="E.g., 30"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Track time spent on diagnostics and repairs
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="progress-notes"
                  className="text-sm font-medium text-foreground"
                >
                  Troubleshooting Notes{' '}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Textarea
                  id="progress-notes"
                  placeholder="E.g., 'Ran diagnostics on network card. Driver update required. Testing connectivity now...'"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Describe diagnostic steps and findings
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Diagnostic Photos{' '}
                  <span className="text-muted-foreground">
                    (Optional, max 5)
                  </span>
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Progress ${index + 1}`}
                          className="h-20 w-full rounded-lg object-cover ring-1 ring-border"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          type="button"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-3 w-3 text-white" />
                        </button>
                        <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {photos.length < 5 && (
                  <div className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                    <ImageUploader onUploadComplete={handlePhotoUpload} />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {photos.length}/5 photos uploaded
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
              colorPalette="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Update Progress
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
