'use client'

import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@chakra-ui/react'
import { FileText, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'

import { useRef } from 'react'

type CheckoutNotesFormProps = {
  notes: string
  termsAccepted: boolean
  photoPreview: string | null
  isUploading: boolean
  onNotesChange: (value: string) => void
  onTermsChange: (value: boolean) => void
  onImageUpload: (file: File) => void
  onRemoveImage: () => void
  errors: Record<string, string>
}

export function CheckoutNotesForm({
  notes,
  termsAccepted,
  photoPreview,
  isUploading,
  onNotesChange,
  onTermsChange,
  onImageUpload,
  onRemoveImage,
  errors,
}: CheckoutNotesFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      onImageUpload(file)
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
          <FileText className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <p className="text-xs text-muted-foreground">
            Optional details for your order
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Order Photo (Optional)</label>
          <p className="text-xs text-muted-foreground mb-3">
            Upload a photo of your order requirements or preferences
          </p>

          {photoPreview ? (
            <div className="relative rounded-xl border border-border overflow-hidden">
              <img
                src={photoPreview}
                alt="Order preview"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={onRemoveImage}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8 transition-all hover:border-primary/50 hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-3">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="text-sm font-medium">Uploading image...</p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </>
          )}
        </div>

        {/* Notes Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Delivery Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add any special instructions, substitution preferences, or delivery notes..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {notes.length}/500 characters
          </p>
        </div>

        {/* Terms Checkbox */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={onTermsChange}
            className={errors.terms ? 'border-red-500' : ''}
          >
            <span className="text-sm">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </Checkbox>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-2">{errors.terms}</p>
          )}
        </div>
      </div>
    </div>
  )
}
