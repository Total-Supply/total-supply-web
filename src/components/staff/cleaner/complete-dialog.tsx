'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog } from '@chakra-ui/react'
import { AlertCircle, CheckCircle2, Image as ImageIcon, X } from 'lucide-react'

import { useState } from 'react'

type CompleteDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { notes: string; photos: string[] }) => void
  isSubmitting: boolean
}

export function CompleteDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CompleteDialogProps) {
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const handleSubmit = () => {
    if (photos.length === 0) {
      alert('Please upload at least one after photo')
      return
    }
    if (!notes.trim()) {
      alert('Please add completion notes')
      return
    }
    onSubmit({ notes, photos })
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Complete Service
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Add completion notes and after photos
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5" />
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    <p className="font-medium">Required Information</p>
                    <p className="text-xs mt-1">
                      Both completion notes and after photos are required.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Completion Notes <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Describe the work completed, any issues encountered, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  After Photos <span className="text-destructive">*</span>
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`After ${index + 1}`}
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
                <p className="text-xs text-muted-foreground">
                  Upload photos showing the completed work
                </p>
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
              colorPalette="green"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={photos.length === 0 || !notes.trim()}
            >
              Complete Service
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
