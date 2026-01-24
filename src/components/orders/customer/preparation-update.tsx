import { Button } from '@/src/components/ui/button'
import { Download, FileText, Image as ImageIcon } from 'lucide-react'

import { useMemo, useState } from 'react'

type PreparationMeta = {
  note?: string | null
  photoUrl?: string | null
  etaMinutes?: number | null
}

type PreparationUpdateProps = {
  meta: PreparationMeta
  onImageClick: (imageUrl: string) => void
  className?: string
}

export function PreparationUpdate({
  meta,
  onImageClick,
  className = '',
}: PreparationUpdateProps) {
  // Generate download filename once per mount for purity
  const [downloadFilename] = useState(() => `preparation-${Date.now()}.jpg`)

  if (!meta.note && !meta.photoUrl) return null

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
          <FileText className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Preparation Update</h3>
          <p className="text-xs text-muted-foreground">
            {meta.etaMinutes
              ? `Estimated ${meta.etaMinutes} minutes`
              : 'From our kitchen'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Note */}
        {meta.note && (
          <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {meta.note}
            </p>
          </div>
        )}

        {/* Photo */}
        {meta.photoUrl && (
          <div className="space-y-3">
            <div
              className="group relative rounded-xl overflow-hidden border border-border/60 cursor-pointer hover:opacity-90 transition-all duration-300 hover:shadow-lg"
              onClick={() => onImageClick(meta.photoUrl!)}
            >
              <img
                src={meta.photoUrl}
                alt="Preparation update"
                className="w-full max-h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <ImageIcon className="h-6 w-6 text-foreground" />
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-3 right-3">
                <div className="rounded-full bg-purple-500/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  <FileText className="h-3 w-3 inline mr-1.5" />
                  Kitchen Update
                </div>
              </div>
            </div>

            <a
              href={meta.photoUrl}
              // Generate filename using useMemo to avoid impure render
              download={downloadFilename}
              className="inline-block w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Photo
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
