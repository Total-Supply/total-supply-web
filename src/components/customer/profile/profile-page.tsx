'use client'

import { ImageUploader } from '@/src/components/ImageUploader'
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Field,
  Flex,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

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

export function CustomerProfilePage() {
  const router = useRouter()
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
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingMarketing, setIsUpdatingMarketing] = useState(false)
  const deleteDialog = useDisclosure()

  useEffect(() => {
    const loadProfile = async () => {
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
        if (err instanceof Error) {
          setError(err.message || 'Failed to load profile')
        } else {
          setError('Failed to load profile')
        }
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      setFormData((prev) => ({
        ...prev,
        name: data.data?.name ?? prev.name,
        phone: data.data?.phone ?? '',
        profileImage: data.data?.profileImage ?? prev.profileImage ?? '',
      }))
      setMessage(data.message || 'Profile updated')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Update failed')
      } else {
        setError('Update failed')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    setMessage(null)
    setError(null)
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Export failed')
      } else {
        setError('Export failed')
      }
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
      setMessage(
        'Account deletion requested. You can restore it within 30 days.',
      )
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Delete failed')
      } else {
        setError('Delete failed')
      }
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
      setMessage('Account restored successfully.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Restore failed')
      } else {
        setError('Restore failed')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMarketingChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.checked
    setFormData((prev) => ({ ...prev, marketingOptIn: nextValue }))
    setIsUpdatingMarketing(true)
    try {
      const response = await fetch('/api/profile/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingOptIn: nextValue }),
      })
      const data = (await response.json()) as ApiResponse<{
        marketingOptIn: boolean
      }>
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      setMessage('Marketing preferences updated.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Update failed')
      } else {
        setError('Update failed')
      }
      setFormData((prev) => ({ ...prev, marketingOptIn: !nextValue }))
    } finally {
      setIsUpdatingMarketing(false)
    }
  }

  const deletionScheduledLabel = formData.deletionScheduledAt
    ? new Date(formData.deletionScheduledAt).toLocaleDateString()
    : null

  return (
    <Container maxW="container.xl" py={6}>
      <Stack gap={8}>
        <HStack flexWrap="wrap" gap={3}>
          <Button variant="outline" asChild>
            <a href="#profile">Profile</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#privacy">Privacy</a>
          </Button>
        </HStack>

        <Card.Root id="profile" borderRadius="2xl" borderWidth="1px">
          <Card.Header>
            <Stack gap={1}>
              <Text fontSize="2xl" fontWeight="bold">
                My Profile
              </Text>
              <Text fontSize="sm" color="muted">
                Update your details and keep your account current.
              </Text>
            </Stack>
          </Card.Header>
          <Card.Body>
            {message && (
              <Box
                borderRadius="lg"
                borderWidth="1px"
                borderColor="green.200"
                bg="green.50"
                px={4}
                py={3}
                fontSize="sm"
                color="green.700"
              >
                {message}
              </Box>
            )}
            {error && (
              <Box
                borderRadius="lg"
                borderWidth="1px"
                borderColor="red.200"
                bg="red.50"
                px={4}
                py={3}
                fontSize="sm"
                color="red.700"
              >
                {error}
              </Box>
            )}

            <Box as="form" mt={6} onSubmit={handleSave}>
              <Flex wrap="wrap" gap={6}>
                <Box flex="1" minW="240px">
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input value={formData.email || ''} readOnly />
                  </Field.Root>
                </Box>
                <Box flex="1" minW="240px">
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </Field.Root>
                </Box>
                <Box flex="1" minW="240px">
                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Input
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      placeholder="+94771234567"
                    />
                  </Field.Root>
                </Box>
                <Box flex="1" minW="240px">
                  <Field.Root>
                    <Field.Label>Address</Field.Label>
                    <Input
                      name="addressLine1"
                      value={formData.addressLine1 || ''}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </Field.Root>
                </Box>
                <Box flex="1" minW="240px">
                  <Field.Root>
                    <Field.Label>City</Field.Label>
                    <Input
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </Field.Root>
                </Box>
                <Box flex="1" minW="240px">
                  <Field.Root>
                    <Field.Label>Postal Code</Field.Label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode || ''}
                      onChange={handleChange}
                      placeholder="Postal code"
                    />
                  </Field.Root>
                </Box>
              </Flex>

              <Stack mt={6} gap={3}>
                <Field.Root>
                  <Field.Label>Profile picture</Field.Label>
                  <Box
                    borderRadius="xl"
                    borderWidth="1px"
                    borderStyle="dashed"
                    p={4}
                  >
                    {formData.profileImage ? (
                      <HStack mb={4} gap={4}>
                        <Image
                          src={formData.profileImage}
                          alt="Profile"
                          boxSize="64px"
                          borderRadius="full"
                          objectFit="cover"
                        />
                        <Text fontSize="sm" color="muted">
                          Upload a new image to replace your current photo.
                        </Text>
                      </HStack>
                    ) : null}
                    <ImageUploader
                      onUploadComplete={(url) =>
                        setFormData((prev) => ({ ...prev, profileImage: url }))
                      }
                    />
                  </Box>
                </Field.Root>
              </Stack>

              <Flex justify="flex-end" mt={6}>
                <Button type="submit" loading={isSaving}>
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </Flex>
            </Box>
          </Card.Body>
        </Card.Root>

        <Card.Root id="privacy" borderRadius="2xl" borderWidth="1px">
          <Card.Header>
            <Flex wrap="wrap" align="center" justify="space-between" gap={4}>
              <Stack gap={1}>
                <Text fontSize="xl" fontWeight="semibold">
                  Privacy
                </Text>
                <Text fontSize="sm" color="muted">
                  Control your personal data, downloads, and email preferences.
                </Text>
              </Stack>
              <Button variant="outline" onClick={handleDownload}>
                Download my data
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body>
            <Flex wrap="wrap" gap={6}>
              <Card.Root
                borderRadius="xl"
                borderWidth="1px"
                flex="1"
                minW="260px"
              >
                <Card.Body>
                  <Text fontSize="sm" fontWeight="semibold">
                    Marketing preferences
                  </Text>
                  <Text mt={1} fontSize="sm" color="muted">
                    Receive updates about new offers and service announcements.
                  </Text>
                  <HStack mt={4} gap={2}>
                    <input
                      type="checkbox"
                      checked={formData.marketingOptIn}
                      onChange={handleMarketingChange}
                      disabled={isUpdatingMarketing}
                    />
                    <Text fontSize="sm">
                      I want to receive marketing emails
                    </Text>
                  </HStack>
                </Card.Body>
              </Card.Root>

              <Card.Root
                borderRadius="xl"
                borderWidth="1px"
                flex="1"
                minW="260px"
              >
                <Card.Body>
                  <Text fontSize="sm" fontWeight="semibold" color="red.600">
                    Delete my account
                  </Text>
                  <Text mt={1} fontSize="sm" color="red.500">
                    We will anonymize your data after 30 days. Orders and
                    services are retained for legal reasons without personal
                    identifiers.
                  </Text>
                  {deletionScheduledLabel ? (
                    <Text mt={3} fontSize="sm" color="red.600">
                      Scheduled for anonymization on {deletionScheduledLabel}.
                      You can restore your account before then.
                    </Text>
                  ) : null}
                  <Flex mt={4} wrap="wrap" gap={3}>
                    {formData.deletionScheduledAt ? (
                      <Button
                        variant="outline"
                        onClick={handleRestore}
                        disabled={isDeleting}
                      >
                        Restore account
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          colorScheme="red"
                          disabled={isDeleting}
                          onClick={deleteDialog.onOpen}
                        >
                          Request deletion
                        </Button>
                        <Dialog.Root
                          open={deleteDialog.open}
                          onOpenChange={(details) => {
                            if (!details.open) {
                              deleteDialog.onClose()
                            }
                          }}
                        >
                          <Dialog.Backdrop />
                          <Dialog.Positioner>
                            <Dialog.Content>
                              <Dialog.CloseTrigger />
                              <Dialog.Header>
                                <Dialog.Title>
                                  Confirm account deletion
                                </Dialog.Title>
                              </Dialog.Header>
                              <Dialog.Body>
                                <Text fontSize="sm" color="muted">
                                  This will schedule account anonymization in 30
                                  days. You can restore your account before then.
                                </Text>
                              </Dialog.Body>
                              <Dialog.Footer>
                                <HStack w="full" justify="flex-end" gap={3}>
                                  <Button
                                    variant="outline"
                                    onClick={deleteDialog.onClose}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    colorScheme="red"
                                    onClick={handleDelete}
                                    loading={isDeleting}
                                  >
                                    Confirm deletion
                                  </Button>
                                </HStack>
                              </Dialog.Footer>
                            </Dialog.Content>
                          </Dialog.Positioner>
                        </Dialog.Root>
                      </>
                    )}
                  </Flex>
                </Card.Body>
              </Card.Root>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  )
}
