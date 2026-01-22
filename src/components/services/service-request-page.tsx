'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { useToast } from '@/src/hooks/use-toast'
import { Box, Container, HStack, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

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
        const mapped = (data.data || []) as AddressResponse[]
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
    <Stack gap={10}>
      <BackgroundGradient height="280px" />
      <Container maxW="container.xl" pt={{ base: 8, md: 12 }} pb={16}>
        <Stack gap={3} textAlign={{ base: 'left', md: 'center' }}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Request a service
            </Text>
          </MotionBox>
          <Text color="muted">
            Book cleaning or IT support with a quick request and photos.
          </Text>
        </Stack>

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 6, lg: 10 }}
          mt={10}
        >
          <Stack gap={6} flex="1">
            <Box
              borderRadius="2xl"
              minH="240px"
              bg="linear-gradient(135deg, rgba(14, 116, 144, 0.85), rgba(30, 41, 59, 0.9))"
              position="relative"
            >
              <Box position="absolute" inset="0" opacity="0.25" bg="black" />
              <Box position="relative" p={6}>
                <Text fontSize="xl" fontWeight="700" color="white">
                  Cleaning and IT support on demand
                </Text>
                <Text fontSize="sm" color="whiteAlpha.800" mt={2}>
                  Send photos, set priority, and get a confirmed time slot.
                </Text>
              </Box>
            </Box>
            <Stack gap={3}>
              <Text fontSize="lg" fontWeight="600">
                What happens next?
              </Text>
              <Text color="muted" fontSize="sm">
                Our team reviews your request, confirms availability, and
                assigns the right specialist.
              </Text>
              <HStack gap={4}>
                <Text fontSize="sm" color="muted">
                  Response time: under 2 hours
                </Text>
                <Text fontSize="sm" color="muted">
                  Support: 011 000 0000
                </Text>
              </HStack>
            </Stack>
          </Stack>

          <Stack flex="1" gap={6}>
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
                photoCount={photoUrls.length}
                offerings={offerings}
                isLoadingOfferings={isLoadingOfferings}
                onSelectAddress={handleSelectAddress}
                onChange={(next) =>
                  setFormData((prev) => ({ ...prev, ...next }))
                }
                onUploadPhotos={handleUploadPhotos}
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
          </Stack>
        </Stack>
      </Container>
    </Stack>
  )
}
