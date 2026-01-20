'use client'

import { Alert } from '@/src/components/profile/alert'
import { DeleteConfirmationDialog } from '@/src/components/profile/delete-confirmation-dialog'
import { PrivacyCard } from '@/src/components/profile/privacy-card'
import { ProfileForm } from '@/src/components/profile/profile-form'
import { ProfileHeader } from '@/src/components/profile/profile-header'
import { ProfileNavigation } from '@/src/components/profile/profile-navigation'
import { ProfileSkeleton } from '@/src/components/profile/profile-skeleton'
import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'

import { useEffect, useMemo, useState } from 'react'

type ProfileData = {
  email: string
  name: string
  phone: string
  addressLine1: string
  city: string
  postalCode: string
  profileImage?: string | null
  marketingOptIn: boolean
  deletionRequestedAt?: string | null
  deletionScheduledAt?: string | null
}

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: {
    message: string
  }
}

export default function CustomerProfilePage() {
  const toast = useToast()
  const [activeSection, setActiveSection] = useState('profile')
  const [formData, setFormData] = useState<ProfileData>({
    email: '',
    name: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    profileImage: '',
    marketingOptIn: true,
    deletionRequestedAt: null,
    deletionScheduledAt: null,
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingMarketing, setIsUpdatingMarketing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Calculate profile completion percentage
  const completionPercentage = useMemo(() => {
    const fields = [
      formData.name,
      formData.phone,
      formData.addressLine1,
      formData.city,
      formData.postalCode,
      formData.profileImage,
    ]
    const filledFields = fields.filter((field) => field && field.trim()).length
    return Math.round((filledFields / fields.length) * 100)
  }, [formData])

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/profile')
        const data = (await response.json()) as ApiResponse<ProfileData>
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load profile')
        }
        setFormData({
          email: data.data?.email ?? '',
          name: data.data?.name ?? '',
          phone: data.data?.phone ?? '',
          addressLine1: data.data?.addressLine1 ?? '',
          city: data.data?.city ?? '',
          postalCode: data.data?.postalCode ?? '',
          profileImage: data.data?.profileImage ?? '',
          marketingOptIn: data.data?.marketingOptIn ?? true,
          deletionRequestedAt: data.data?.deletionRequestedAt ?? null,
          deletionScheduledAt: data.data?.deletionScheduledAt ?? null,
        })
      } catch (err: unknown) {
        toast({
          title: 'Failed to load profile',
          description: err instanceof Error ? err.message : 'Please try again.',
          status: 'error',
          duration: 2500,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, profileImage: url }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage(null)
    setError(null)
    setIsSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          city: formData.city,
          postalCode: formData.postalCode,
          profileImage: formData.profileImage || undefined,
        }),
      })
      const data = (await response.json()) as ApiResponse<ProfileData>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 2000,
      })
      setMessage(data.message || 'Profile updated successfully')
      setTimeout(() => setMessage(null), 5000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed'
      toast({
        title: 'Update failed',
        description: errorMessage,
        status: 'error',
        duration: 2500,
      })
      setError(errorMessage)
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/profile/export')
      if (!response.ok) {
        const data = (await response.json()) as ApiResponse<unknown>
        throw new Error(data.error?.message || 'Export failed')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'total-supply-data.zip'
      anchor.click()
      URL.revokeObjectURL(url)
      toast({
        title: 'Data exported successfully',
        status: 'success',
        duration: 2000,
      })
    } catch (err: unknown) {
      toast({
        title: 'Export failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'POST',
      })
      const data = (await response.json()) as ApiResponse<{
        deletionRequestedAt?: string
        deletionScheduledAt?: string
      }>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Delete failed')
      }
      setFormData((prev) => ({
        ...prev,
        deletionRequestedAt: data.data?.deletionRequestedAt || null,
        deletionScheduledAt: data.data?.deletionScheduledAt || null,
      }))
      setDeleteDialogOpen(false)
      toast({
        title: 'Deletion requested',
        description: 'You can restore your account within 30 days.',
        status: 'success',
        duration: 3000,
      })
    } catch (err: unknown) {
      toast({
        title: 'Deletion failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRestore = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/profile/restore', {
        method: 'POST',
      })
      const data = (await response.json()) as ApiResponse<{
        deletionRequestedAt?: string | null
        deletionScheduledAt?: string | null
      }>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Restore failed')
      }
      setFormData((prev) => ({
        ...prev,
        deletionRequestedAt: data.data?.deletionRequestedAt ?? null,
        deletionScheduledAt: data.data?.deletionScheduledAt ?? null,
      }))
      toast({
        title: 'Account restored',
        status: 'success',
        duration: 2000,
      })
    } catch (err: unknown) {
      toast({
        title: 'Restore failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMarketingChange = async (checked: boolean) => {
    setFormData((prev) => ({ ...prev, marketingOptIn: checked }))
    setIsUpdatingMarketing(true)
    try {
      const response = await fetch('/api/profile/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingOptIn: checked }),
      })
      const data = (await response.json()) as ApiResponse<{
        marketingOptIn: boolean
      }>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      toast({
        title: 'Marketing preferences updated',
        status: 'success',
        duration: 2000,
      })
    } catch (err: unknown) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
      setFormData((prev) => ({ ...prev, marketingOptIn: !checked }))
    } finally {
      setIsUpdatingMarketing(false)
    }
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={6}>
        <ProfileSkeleton />
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={6}>
      <div className="space-y-6">
        <ProfileHeader
          name={formData.name}
          email={formData.email}
          profileImage={formData.profileImage}
          completionPercentage={completionPercentage}
        />

        <ProfileNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {message && (
          <Alert
            type="success"
            message={message}
            onClose={() => setMessage(null)}
          />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {activeSection === 'profile' && (
          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onImageUpload={handleImageUpload}
            onSubmit={handleSave}
            isSaving={isSaving}
          />
        )}

        {activeSection === 'privacy' && (
          <PrivacyCard
            marketingOptIn={formData.marketingOptIn}
            deletionScheduledAt={formData.deletionScheduledAt}
            isUpdatingMarketing={isUpdatingMarketing}
            onMarketingChange={handleMarketingChange}
            onDownload={handleDownload}
            onDeleteRequest={() => setDeleteDialogOpen(true)}
            onRestore={handleRestore}
          />
        )}

        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </Container>
  )
}
