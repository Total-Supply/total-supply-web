'use client'

import { MotionBox } from '@/src/components/motion/box'
import { ChevronLeft, ChevronRight, Package, X, ZoomIn } from 'lucide-react'
import Image from 'next/image'

import { useMemo, useState } from 'react'

import { FoodItemDetail } from '../types'

type ProductImageGalleryProps = {
  item: FoodItemDetail
}

export function ProductImageGallery({ item }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [imageError, setImageError] = useState(false)

  const gallery = useMemo(() => {
    const images = item.images?.map((img) => img.url) || []
    const main = item.mainImageUrl ? [item.mainImageUrl] : []
    return Array.from(new Set([...main, ...images]))
  }, [item])

  const activeImage = gallery[activeIndex] || null
  const hasMultipleImages = gallery.length > 1

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % gallery.length)
  }

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-muted to-muted/50">
          {activeImage && !imageError ? (
            <>
              <img
                src={activeImage}
                alt={item.name}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                <ZoomIn className="h-5 w-5" />
              </button>

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                  {activeIndex + 1} / {gallery.length}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center space-y-3">
                <Package className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No image available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {hasMultipleImages && (
          <div className="grid grid-cols-5 gap-3">
            {gallery.map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  activeIndex === index
                    ? 'border-primary ring-2 ring-primary/30 scale-105'
                    : 'border-border/60 hover:border-border'
                }`}
              >
                <img
                  src={url}
                  alt={`${item.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {activeIndex === index && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </MotionBox>

      {/* Zoom Modal */}
      {isZoomed && activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <Image
            src={activeImage}
            alt={item.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            width={900}
            height={900}
            style={{ objectFit: 'contain', borderRadius: '1rem' }}
            priority
          />
        </div>
      )}
    </>
  )
}
