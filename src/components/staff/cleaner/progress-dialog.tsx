'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import { ArrowRight, Image as ImageIcon, X } from 'lucide-react'

import { useState } from 'react'

type ProgressDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { notes?: string; photos: string[] }) => void
  isSubmitting: boolean
}

export function ProgressDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ProgressDialogProps) {
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const handleSubmit = () => {
    onSubmit({ notes: notes || undefined, photos })
    setNotes('')
    setPhotos([])
  }

  const handlePhotoUpload = (url: string) => {
    setPhotos((prev) => [...prev, url])
  }

  const removePhoto = (url: string) => {
    setPhotos((prev) => prev.filter((p) => p !== url))
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-2xl">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
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
                  Add notes and photos to track progress
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Progress Notes
                </label>
                <Textarea
                  placeholder="Add notes about the work in progress..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Progress Photos
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Progress ${index + 1}`}
                          className="h-24 w-full rounded-lg object-cover ring-1 ring-border"
                        />
                        <button
                          onClick={() => removePhoto(url)}
                          className="absolute top-1 right-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <ImageUploader onUploadComplete={handlePhotoUpload} />
                </div>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Update Progress
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
