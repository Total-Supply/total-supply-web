'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { toaster } from '@/src/components/ui/toaster'
import {
  Badge,
  Box,
  Container,
  Dialog,
  HStack,
  Image,
  Progress,
  Stack,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '../ui/button'

type ServicePhoto = {
  id: number
  url: string
  type: string
}

type TimelineEntry = {
  status: string
  at: string
  by: string
}

type StaffInfo = {
  id: number
  name: string
  phone?: string | null
  profileImage?: string | null
  rating?: number | null
  ratingCount?: number
  assignedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  notes?: string | null
  timeSpentMinutes?: number | null
  completionNotes?: string | null
  solutionSummary?: string | null
  followUpRecommendations?: string | null
}

type RatingInfo = {
  id: number
  score: number
  review?: string | null
  wouldRecommend: boolean
}

type ServiceDetail = {
  id: number
  requestNumber: string
  type: string
  category?: string | null
  status: string
  priority: string
  description: string
  notes?: string | null
  createdAt: string
  requestedDate?: string | null
  address?: {
    line1: string
    line2?: string | null
    city: string
    postalCode: string
  } | null
  beforePhotos: ServicePhoto[]
  progressPhotos: ServicePhoto[]
  afterPhotos: ServicePhoto[]
  timeline: TimelineEntry[]
  staff?: StaffInfo | null
  rating?: RatingInfo | null
  itHistory?: {
    id: number
    requestNumber: string
    status: string
    createdAt: string
    description?: string | null
    notes?: string | null
  }[]
}

const STATUS_STEPS = ['RECEIVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

export default function ServiceRequestDetailPage() {
  const params = useParams()
  const requestId = params?.id as string | undefined

  const [service, setService] = useState<ServiceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [recommend, setRecommend] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const photoModal = useDisclosure()

  const [previousStatus, setPreviousStatus] = useState<string | null>(null)

  const fetchService = async () => {
    if (!requestId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/service-requests/${requestId}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unable to load service')
      }
      setService(data.data)
    } catch (error) {
      console.error('Failed to load service request', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchService()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId])

  useEffect(() => {
    if (!service?.status) return

    if (previousStatus && previousStatus !== service.status) {
      if (service.status === 'IN_PROGRESS') {
        toaster.create({
          title: 'Staff arrived',
          description: 'Your service is now in progress.',
          type: 'info',
          duration: 2500,
        })
      }
    }

    setPreviousStatus(service.status)
  }, [service?.status, previousStatus])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchService()
    }, 15000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId])

  const progressValue = useMemo(() => {
    const index = STATUS_STEPS.indexOf(service?.status || 'RECEIVED')
    return Math.max(0, (index / (STATUS_STEPS.length - 1)) * 100)
  }, [service?.status])

  const arrivalEstimate = useMemo(() => {
    if (!service?.staff?.assignedAt) return ''
    const base = new Date(service.staff.assignedAt)
    const eta = new Date(base.getTime() + 90 * 60 * 1000)
    return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [service?.staff?.assignedAt])

  const handleSubmitRating = async () => {
    if (!service) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/service-requests/${service.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          score: rating,
          review: review || undefined,
          wouldRecommend: recommend,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Rating failed')
      }

      toaster.create({
        title: 'Thanks for your feedback',
        type: 'success',
        duration: 2500,
      })

      fetchService()
    } catch (error) {
      toaster.create({
        title: 'Unable to submit rating',
        description: (error as Error)?.message || 'Please try again.',
        type: 'error',
        duration: 2500,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Stack gap={10}>
      <BackgroundGradient height="260px" />
      <Container maxW="container.xl" pt={{ base: 8, md: 12 }} pb={16}>
        <Stack gap={3}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Service request
            </Text>
          </MotionBox>

          <Text color="fg.muted">
            Track progress and communicate with staff.
          </Text>
        </Stack>

        {isLoading ? (
          <Stack mt={10}>
            <Text>Loading request...</Text>
          </Stack>
        ) : service ? (
          <Stack gap={6} mt={10}>
            <Box layerStyle="card" p={6}>
              <HStack justify="space-between" align="flex-start">
                <Stack gap={1}>
                  <Text fontSize="lg" fontWeight="600">
                    {service.requestNumber}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Created {new Date(service.createdAt).toLocaleString()}
                  </Text>
                </Stack>

                <Badge textTransform="capitalize">
                  {service.status.toLowerCase().replace(/_/g, ' ')}
                </Badge>
              </HStack>

              <Text mt={4} fontWeight="600">
                {service.type === 'IT_SUPPORT' ? 'IT Support' : 'Cleaning'}
              </Text>

              <Text color="fg.muted" mt={2}>
                {service.description}
              </Text>

              <Progress.Root value={progressValue} mt={4}>
                <Progress.Track borderRadius="full">
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>

            <Box layerStyle="card" p={6}>
              <Text fontSize="lg" fontWeight="600" mb={3}>
                Status timeline
              </Text>

              <Stack gap={3}>
                {STATUS_STEPS.map((step) => {
                  const entry = service.timeline.find(
                    (item) => item.status === step,
                  )
                  const isActive = service.status === step

                  return (
                    <HStack key={step} gap={4} align="flex-start">
                      <Box
                        boxSize="10px"
                        borderRadius="full"
                        mt="6px"
                        bg={
                          entry
                            ? 'green.400'
                            : isActive
                              ? 'blue.400'
                              : 'gray.300'
                        }
                      />
                      <Stack gap={0}>
                        <Text fontWeight={isActive ? '600' : '500'}>
                          {step.replace(/_/g, ' ').toLowerCase()}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">
                          {entry
                            ? new Date(entry.at).toLocaleString()
                            : 'Pending'}
                          {entry?.by ? ` - ${entry.by}` : ''}
                        </Text>
                      </Stack>
                    </HStack>
                  )
                })}
              </Stack>
            </Box>

            {service.staff && (
              <Box layerStyle="card" p={6}>
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  Assigned staff
                </Text>

                <HStack gap={4} align="flex-start">
                  <Box
                    boxSize="64px"
                    borderRadius="full"
                    overflow="hidden"
                    bg="gray.100"
                  >
                    {service.staff.profileImage ? (
                      <Image
                        src={service.staff.profileImage}
                        alt={service.staff.name}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    ) : (
                      <Box
                        w="full"
                        h="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.400"
                        fontSize="sm"
                      >
                        {service.staff.name.charAt(0)}
                      </Box>
                    )}
                  </Box>

                  <Stack gap={1}>
                    <Text fontWeight="600">{service.staff.name}</Text>
                    <Text fontSize="sm" color="fg.muted">
                      {service.staff.phone || 'Phone unavailable'}
                    </Text>
                    <Text fontSize="sm" color="fg.muted">
                      Rating: {service.staff.rating?.toFixed(1) || 'N/A'} (
                      {service.staff.ratingCount || 0})
                    </Text>

                    {arrivalEstimate && service.status !== 'RESOLVED' && (
                      <Text fontSize="sm" color="fg.muted">
                        Estimated arrival: {arrivalEstimate}
                      </Text>
                    )}

                    {service.staff.timeSpentMinutes ? (
                      <Text fontSize="sm" color="fg.muted">
                        Time spent: {service.staff.timeSpentMinutes} min
                      </Text>
                    ) : null}
                  </Stack>
                </HStack>
              </Box>
            )}

            <Box layerStyle="card" p={6}>
              <Text fontSize="lg" fontWeight="600" mb={3}>
                Before photos
              </Text>

              <HStack gap={3} flexWrap="wrap">
                {service.beforePhotos.length ? (
                  service.beforePhotos.map((photo) => (
                    <Box
                      key={photo.id}
                      boxSize="120px"
                      borderRadius="xl"
                      overflow="hidden"
                      cursor="pointer"
                      onClick={() => {
                        setSelectedPhoto(photo.url)
                        photoModal.onOpen()
                      }}
                    >
                      <Image
                        src={photo.url}
                        alt="Before photo"
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>
                  ))
                ) : (
                  <Text color="fg.muted">No photos uploaded.</Text>
                )}
              </HStack>
            </Box>

            {service.status === 'IN_PROGRESS' && (
              <Box layerStyle="card" p={6}>
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  Progress photos
                </Text>

                <HStack gap={3} flexWrap="wrap">
                  {service.progressPhotos.length ? (
                    service.progressPhotos.map((photo) => (
                      <Box
                        key={photo.id}
                        boxSize="120px"
                        borderRadius="xl"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedPhoto(photo.url)
                          photoModal.onOpen()
                        }}
                      >
                        <Image
                          src={photo.url}
                          alt="Progress photo"
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      </Box>
                    ))
                  ) : (
                    <Text color="fg.muted">No progress photos yet.</Text>
                  )}
                </HStack>

                {service.staff?.notes && (
                  <Text fontSize="sm" color="fg.muted" mt={3}>
                    Progress notes: {service.staff.notes}
                  </Text>
                )}
              </Box>
            )}

            {service.status === 'RESOLVED' && (
              <Box layerStyle="card" p={6}>
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  After photos
                </Text>

                <HStack gap={3} flexWrap="wrap">
                  {service.afterPhotos.length ? (
                    service.afterPhotos.map((photo) => (
                      <Box
                        key={photo.id}
                        boxSize="120px"
                        borderRadius="xl"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedPhoto(photo.url)
                          photoModal.onOpen()
                        }}
                      >
                        <Image
                          src={photo.url}
                          alt="After photo"
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      </Box>
                    ))
                  ) : (
                    <Text color="fg.muted">No after photos yet.</Text>
                  )}
                </HStack>

                {service.staff?.completedAt && (
                  <Text fontSize="sm" color="fg.muted" mt={3}>
                    Completed at{' '}
                    {new Date(service.staff.completedAt).toLocaleString()}
                  </Text>
                )}

                {service.staff?.notes && (
                  <Text fontSize="sm" color="fg.muted" mt={2}>
                    Completion notes: {service.staff.notes}
                  </Text>
                )}

                {service.type === 'IT_SUPPORT' && (
                  <Stack gap={2} mt={4}>
                    {service.staff?.completionNotes && (
                      <Text fontSize="sm" color="fg.muted">
                        Final notes: {service.staff.completionNotes}
                      </Text>
                    )}
                    {service.staff?.solutionSummary && (
                      <Text fontSize="sm" color="fg.muted">
                        Solution summary: {service.staff.solutionSummary}
                      </Text>
                    )}
                    {service.staff?.followUpRecommendations && (
                      <Text fontSize="sm" color="fg.muted">
                        Recommended follow-ups:{' '}
                        {service.staff.followUpRecommendations}
                      </Text>
                    )}
                  </Stack>
                )}
              </Box>
            )}

            {service.status === 'RESOLVED' && !service.rating && (
              <Box layerStyle="card" p={6}>
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  Rate service
                </Text>

                <HStack gap={3} mb={3}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={rating >= value ? 'solid' : 'outline'}
                      onClick={() => setRating(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </HStack>

                <Textarea
                  placeholder="Share feedback (optional)"
                  value={review}
                  onChange={(event) => setReview(event.target.value)}
                />

                <HStack gap={3} mt={3}>
                  <Button
                    variant={recommend ? 'solid' : 'outline'}
                    onClick={() => setRecommend((prev) => !prev)}
                  >
                    Would recommend
                  </Button>

                  <Button
                    colorPalette="primary"
                    onClick={handleSubmitRating}
                    loading={isSubmitting}
                  >
                    Submit rating
                  </Button>
                </HStack>
              </Box>
            )}

            {service.type === 'IT_SUPPORT' && (
              <Box layerStyle="card" p={6}>
                <Tabs.Root defaultValue="current" variant="enclosed">
                  <Tabs.List>
                    <Tabs.Trigger value="current">Current request</Tabs.Trigger>
                    <Tabs.Trigger value="history">IT history</Tabs.Trigger>
                    <Tabs.Indicator />
                  </Tabs.List>

                  <Tabs.Content value="current" px={0} pt={4}>
                    <Stack gap={2}>
                      <Text fontSize="sm" color="fg.muted">
                        Summary
                      </Text>
                      <Text fontWeight="600">{service.description}</Text>

                      {service.notes && (
                        <Text fontSize="sm" color="fg.muted">
                          Notes: {service.notes}
                        </Text>
                      )}
                    </Stack>
                  </Tabs.Content>

                  <Tabs.Content value="history" px={0} pt={4}>
                    <Stack gap={3}>
                      {service.itHistory && service.itHistory.length > 0 ? (
                        service.itHistory.map((entry) => (
                          <Box key={entry.id} layerStyle="panel" p={4}>
                            <HStack justify="space-between" align="flex-start">
                              <Stack gap={1}>
                                <Text fontWeight="600">
                                  {entry.requestNumber}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                  {new Date(entry.createdAt).toLocaleString()}
                                </Text>
                              </Stack>

                              <Badge textTransform="capitalize">
                                {entry.status.toLowerCase().replace(/_/g, ' ')}
                              </Badge>
                            </HStack>

                            {entry.description && (
                              <Text fontSize="sm" color="fg.muted" mt={2}>
                                {entry.description}
                              </Text>
                            )}

                            {entry.notes && (
                              <Text fontSize="sm" color="fg.muted" mt={2}>
                                Notes: {entry.notes}
                              </Text>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Text color="fg.muted">No prior IT requests.</Text>
                      )}
                    </Stack>
                  </Tabs.Content>
                </Tabs.Root>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack mt={10}>
            <Text>Service request not found.</Text>
          </Stack>
        )}
      </Container>

      <Dialog.Root
        open={photoModal.open}
        onOpenChange={(details) => {
          if (!details.open) photoModal.onClose()
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Photo</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {selectedPhoto && (
                <Image
                  src={selectedPhoto}
                  alt="Service photo"
                  w="full"
                  borderRadius="xl"
                />
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  )
}
