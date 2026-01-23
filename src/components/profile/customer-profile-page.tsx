'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Alert } from '@/src/components/profile/alert'
import { DeleteConfirmationDialog } from '@/src/components/profile/delete-confirmation-dialog'
import { PrivacyCard } from '@/src/components/profile/privacy-card'
import { ProfileForm } from '@/src/components/profile/profile-form'
import { ProfileNavigation } from '@/src/components/profile/profile-navigation'
import { ProfileSidebar } from '@/src/components/profile/profile-sidebar'
import { ProfileSkeleton } from '@/src/components/profile/profile-skeleton'
import { ProfileTabs } from '@/src/components/profile/profile-tabs'
import { useToast } from '@/src/hooks/use-toast'
import { Container, useBreakpointValue } from '@chakra-ui/react'
import { User } from 'lucide-react'

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
  const isMobile = useBreakpointValue({ base: true, lg: false })
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
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <Container maxW="container.xl" className="px-4 sm:px-6 lg:px-8 py-16">
          <ProfileSkeleton />
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12"
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
              My Profile
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground">
              Manage your account details and preferences
            </p>
          </MotionBox>
        </Container>
      </div>

      {/* Main Content */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        {/* Alerts */}
        {message && (
          <div className="mb-6">
            <Alert
              type="success"
              message={message}
              onClose={() => setMessage(null)}
            />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Mobile: Tabs Navigation */}
        {isMobile && (
          <div className="mb-6">
            <ProfileTabs
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        )}

        {/* Desktop: Sidebar + Content */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop Sidebar Navigation */}
          {!isMobile && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProfileSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                name={formData.name}
                email={formData.email}
                profileImage={formData.profileImage}
                completionPercentage={completionPercentage}
              />
            </div>
          )}

          {/* Content Area */}
          <div>
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

            {(activeSection === 'notifications' ||
              activeSection === 'billing') && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-12 sm:p-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  This section is currently under development and will be
                  available soon.
                </p>
              </MotionBox>
            )}
          </div>
        </div>
      </Container>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
