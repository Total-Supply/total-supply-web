import { MotionBox } from '@/src/components/motion/box'
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react'

import { useState } from 'react'

type ImageModalProps = {
  isOpen: boolean
  imageUrl: string | null
  alt?: string
  onClose: () => void
}

export function ImageModal({
  isOpen,
  imageUrl,
  alt = 'Image',
  onClose,
}: ImageModalProps) {
  const [zoom, setZoom] = useState(1)

  if (!isOpen || !imageUrl) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
  const handleReset = () => setZoom(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 rounded-lg bg-black/50 backdrop-blur-sm p-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-white text-sm font-medium min-w-[4ch] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          {zoom !== 1 && (
            <button
              onClick={handleReset}
              className="ml-2 rounded-md bg-white/10 px-3 py-2 text-white text-xs font-medium hover:bg-white/20 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Download Button */}
        <a
          href={imageUrl}
          download
          className="rounded-lg bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-colors"
          onClick={(e) => e.stopPropagation()}
          title="Download"
        >
          <Download className="h-5 w-5" />
        </a>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="rounded-lg bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-7xl max-h-[90vh] overflow-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="rounded-2xl shadow-2xl transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        />
      </MotionBox>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 backdrop-blur-sm px-4 py-2 text-xs text-white">
        Click outside to close • Use zoom controls to adjust size
      </div>
    </div>
  )
}
