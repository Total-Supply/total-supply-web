'use client'

import { Button } from '@/src/components/ui/button'
import { Camera, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'

import { useRef } from 'react'

type PhotoUploadProps = {
  photoUrls: string[]
  isUploading: boolean
  onUpload: (files: FileList | null) => void
  onRemove: (index: number) => void
  maxPhotos?: number
}

export function PhotoUpload({
  photoUrls,
  isUploading,
  onUpload,
  onRemove,
  maxPhotos = 3,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files)
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const canUploadMore = photoUrls.length < maxPhotos

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
          <Camera className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Before Photos</h3>
          <p className="text-xs text-muted-foreground">
            Upload up to {maxPhotos} photos (Optional)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Photo Grid */}
        {photoUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photoUrls.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Remove Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => onRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transform scale-90 group-hover:scale-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Photo Number Badge */}
                <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button/Area */}
        {canUploadMore && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8 transition-all duration-200 hover:border-primary/50 hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center gap-3">
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium">Uploading photos...</p>
                    <p className="text-xs text-muted-foreground">Please wait</p>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload photos
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 5MB each ({photoUrls.length}/{maxPhotos}{' '}
                        used)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </button>
          </>
        )}

        {/* Info */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-start gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Photos help our team understand your needs better and provide
              accurate service quotes. They&#39;re optional but highly
              recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
