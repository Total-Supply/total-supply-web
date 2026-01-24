'use client'

import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import { ServiceHeader } from './service-header'
import { ServiceInfoSidebar } from './service-info-sidebar'
import { ServiceLoadingSkeleton } from './service-loading-skeleton'
import { ServiceOfferingsGrid } from './service-offerings-grid'
import {
  ServiceRequestForm,
  ServiceRequestFormData,
} from './service-request-form'
import { ServiceRequestReview } from './service-request-review'

type AddressResponse = {
  id: number
  label?: string | null
  line1: string
  line2?: string | null
  city: string
  postalCode: string
}

type ServiceOfferingOption = {
  id: number
  name: string
  description?: string | null
  basePrice?: number | null
  category?: string | null
  type: 'CLEANING' | 'IT_SUPPORT'
}

const initialForm: ServiceRequestFormData = {
  type: 'CLEANING',
  category: 'GENERAL_CLEANING',
  serviceOfferingId: '',
  serviceOfferingName: '',
  description: '',
  requestedDate: '',
  priority: 'MEDIUM',
  notes: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  saveAsDefault: false,
}

export function ServiceRequestPage() {
  const router = useRouter()
  const toast = useToast()
  const [step, setStep] = useState<'form' | 'review'>('form')
  const [formData, setFormData] = useState<ServiceRequestFormData>(initialForm)
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [offerings, setOfferings] = useState<ServiceOfferingOption[]>([])
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        if (!response.ok) return
        setFormData((prev) => ({
          ...prev,
          line1: data.data?.addressLine1 || '',
          city: data.data?.city || '',
          postalCode: data.data?.postalCode || '',
        }))
      } catch (error) {
        console.error('Failed to load profile', error)
      }
    }

    const loadAddresses = async () => {
      try {
        const response = await fetch('/api/addresses')
        const data = await response.json()
        if (!response.ok) return
        const raw = data.data
        const mapped = Array.isArray(raw)
          ? raw
          : raw
            ? ([raw] as AddressResponse[])
            : []
        setAddresses(mapped)
      } catch (error) {
        console.error('Failed to load addresses', error)
      }
    }

    loadProfile()
    loadAddresses()
  }, [])

  useEffect(() => {
    const loadOfferings = async () => {
      setIsLoadingOfferings(true)
      try {
        const params = new URLSearchParams({ type: formData.type })
        const response = await fetch(
          `/api/services/offerings?${params.toString()}`,
        )
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load offerings')
        }
        const mapped = (data.data || []) as ServiceOfferingOption[]
        setOfferings(mapped)
        if (
          mapped.length &&
          !mapped.find((entry) => entry.id === formData.serviceOfferingId)
        ) {
          setFormData((prev) => ({
            ...prev,
            serviceOfferingId: '',
            serviceOfferingName: '',
          }))
        }
      } catch (error) {
        console.error('Failed to load offerings', error)
      } finally {
        setIsLoadingOfferings(false)
      }
    }

    loadOfferings()
  }, [formData.type])

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id)
    const match = addresses.find((entry) => String(entry.id) === id)
    if (!match) return
    setFormData((prev) => ({
      ...prev,
      line1: match.line1,
      line2: match.line2 || '',
      city: match.city,
      postalCode: match.postalCode,
    }))
  }

  const handleUploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const remaining = 3 - photoUrls.length
    if (remaining <= 0) {
      toast({
        title: 'Photo limit reached',
        description: 'You can upload up to 3 photos.',
        status: 'info',
        duration: 2500,
      })
      return
    }

    const batch = Array.from(files).slice(0, remaining)
    setIsUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of batch) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds 5MB.`,
            status: 'warning',
            duration: 2500,
          })
          continue
        }
        const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: safeFilename,
            contentType: file.type,
            fileSize: file.size,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Upload initialization failed')
        }
        const uploadResponse = await fetch(data.data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed')
        }
        uploaded.push(data.data.publicUrl)
      }
      setPhotoUrls((prev) => [...prev, ...uploaded])
    } catch (error: unknown) {
      toast({
        title: 'Upload failed',
        description:
          error && typeof error === 'object' && 'message' in error
            ? (error as { message?: string }).message
            : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const validateForm = () => {
    if (offerings.length > 0 && !formData.serviceOfferingId) {
      toast({
        title: 'Select a service package',
        description: 'Choose a package to match our service catalog.',
        status: 'warning',
        duration: 2500,
      })
      return false
    }
    if (formData.description.trim().length < 20) {
      toast({
        title: 'Description too short',
        description: 'Please enter at least 20 characters.',
        status: 'warning',
        duration: 2500,
      })
      return false
    }
    if (!formData.line1 || !formData.city || !formData.postalCode) {
      toast({
        title: 'Address required',
        description: 'Please complete the address fields.',
        status: 'warning',
        duration: 2500,
      })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const payload = {
        type: formData.type,
        category: formData.type === 'CLEANING' ? formData.category : undefined,
        serviceOfferingId:
          typeof formData.serviceOfferingId === 'number'
            ? formData.serviceOfferingId
            : undefined,
        description: formData.description,
        requestedDate: formData.requestedDate
          ? new Date(formData.requestedDate).toISOString()
          : undefined,
        priority: formData.priority,
        notes: formData.notes || undefined,
        addressId: selectedAddressId ? Number(selectedAddressId) : undefined,
        address: selectedAddressId
          ? undefined
          : {
              line1: formData.line1,
              line2: formData.line2 || undefined,
              city: formData.city,
              postalCode: formData.postalCode,
              country: 'Sri Lanka',
            },
        saveAsDefault: formData.saveAsDefault,
        beforePhotos: photoUrls.length ? photoUrls : undefined,
      }

      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
      }
      toast({
        title: 'Service request submitted',
        description: 'We will contact you shortly to confirm the booking.',
        status: 'success',
        duration: 3000,
      })
      setFormData(initialForm)
      setPhotoUrls([])
      setSelectedAddressId('')
      setStep('form')
      router.push(`/services/${data.data.id}`)
    } catch (error: unknown) {
      toast({
        title: 'Request failed',
        description:
          error && typeof error === 'object' && 'message' in error
            ? (error as { message?: string }).message
            : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section - Match Shop Page Exactly */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28"
        >
          <ServiceHeader
            showInfo={showInfo}
            onToggleInfo={() => setShowInfo(!showInfo)}
          />
        </Container>
      </div>

      {/* Main Content - Match Shop Page Layout */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 pt-2 py-6 lg:py-8"
      >
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Info Sidebar - Match Shop Filters Panel */}
          <ServiceInfoSidebar isVisible={showInfo} />

          {/* Main Content */}
          <div className="space-y-6">
            {isLoadingOfferings ? (
              <ServiceLoadingSkeleton />
            ) : (
              <>
                {/* Service Offerings Grid */}
                {offerings.length > 0 && step === 'form' && (
                  <ServiceOfferingsGrid
                    offerings={offerings}
                    selectedId={formData.serviceOfferingId ?? ''}
                    onSelect={(offering) =>
                      setFormData((prev) => ({
                        ...prev,
                        serviceOfferingId: offering.id,
                        serviceOfferingName: offering.name,
                      }))
                    }
                  />
                )}

                {/* Form or Review */}
                {step === 'form' ? (
                  <ServiceRequestForm
                    data={formData}
                    addresses={addresses.map((address) => ({
                      id: String(address.id),
                      label: address.label || address.line1,
                      line1: address.line1,
                      line2: address.line2,
                      city: address.city,
                      postalCode: address.postalCode,
                    }))}
                    selectedAddressId={selectedAddressId}
                    isUploading={isUploading}
                    offerings={offerings}
                    isLoadingOfferings={isLoadingOfferings}
                    onSelectAddress={handleSelectAddress}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, ...next }))
                    }
                    onUploadPhotos={handleUploadPhotos}
                    photoUrls={photoUrls}
                    onRemovePhoto={(index: number) =>
                      setPhotoUrls((prev) => prev.filter((_, i) => i !== index))
                    }
                    onContinue={() => {
                      if (validateForm()) {
                        setStep('review')
                      }
                    }}
                  />
                ) : (
                  <ServiceRequestReview
                    data={formData}
                    photoUrls={photoUrls}
                    isSubmitting={isSubmitting}
                    onBack={() => setStep('form')}
                    onSubmit={handleSubmit}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
