'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Camera, Image as ImageIcon, X } from 'lucide-react'

import { useState } from 'react'

import { ServiceDetail } from './service-request-detail-page'

type ServicePhotosSectionProps = {
  service: ServiceDetail
}

export function ServicePhotosSection({ service }: ServicePhotosSectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const photoSections = [
    {
      title: 'Before Photos',
      photos: service.beforePhotos,
      color: 'from-blue-500/20 to-blue-600/10 ring-blue-500/30 text-blue-500',
      show: true,
    },
    {
      title: 'Progress Photos',
      photos: service.progressPhotos,
      color:
        'from-amber-500/20 to-amber-600/10 ring-amber-500/30 text-amber-500',
      show: service.status === 'IN_PROGRESS' || service.status === 'RESOLVED',
    },
    {
      title: 'After Photos',
      photos: service.afterPhotos,
      color:
        'from-emerald-500/20 to-emerald-600/10 ring-emerald-500/30 text-emerald-500',
      show: service.status === 'RESOLVED',
    },
  ]

  return (
    <>
      {photoSections.map(
        (section, index) =>
          section.show && (
            <MotionBox
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ring-1 ${section.color}`}
                >
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {section.photos.length} photo
                    {section.photos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {section.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {section.photos.map((photo, photoIndex) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo.url)}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <img
                        src={photo.url}
                        alt={`${section.title} ${photoIndex + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                        {photoIndex + 1}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No photos available yet
                  </p>
                </div>
              )}
            </MotionBox>
          ),
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedPhoto}
              alt="Full size"
              className="w-full h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
