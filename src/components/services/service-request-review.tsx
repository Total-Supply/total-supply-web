'use client'

import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react'
import type { ServiceRequestFormData } from './service-request-form'

type ServiceRequestReviewProps = {
  data: ServiceRequestFormData
  photoUrls: string[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ServiceRequestReview({
  data,
  photoUrls,
  onBack,
  onSubmit,
  isSubmitting,
}: ServiceRequestReviewProps) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      bg="whiteAlpha.900"
      boxShadow="lg"
    >
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="600">
          Review request
        </Text>
        <Stack gap={2}>
          <Text fontSize="sm" color="muted">
            Service type
          </Text>
          <Text fontWeight="600">
            {data.type === 'IT_SUPPORT' ? 'IT Support' : 'Cleaning'}
          </Text>
        </Stack>
        {data.serviceOfferingName && (
          <Stack gap={2}>
            <Text fontSize="sm" color="muted">
              Service package
            </Text>
            <Text fontWeight="600">{data.serviceOfferingName}</Text>
          </Stack>
        )}
        {data.type === 'CLEANING' && (
          <Stack gap={2}>
            <Text fontSize="sm" color="muted">
              Category
            </Text>
            <Text fontWeight="600">
              {data.category.replace(/_/g, ' ').toLowerCase()}
            </Text>
          </Stack>
        )}
        <Stack gap={2}>
          <Text fontSize="sm" color="muted">
            Description
          </Text>
          <Text>{data.description}</Text>
        </Stack>
        {data.requestedDate && (
          <Stack gap={2}>
            <Text fontSize="sm" color="muted">
              Preferred date
            </Text>
            <Text>{new Date(data.requestedDate).toLocaleString()}</Text>
          </Stack>
        )}
        <Stack gap={2}>
          <Text fontSize="sm" color="muted">
            Priority
          </Text>
          <Text>{data.priority}</Text>
        </Stack>
        {data.notes && (
          <Stack gap={2}>
            <Text fontSize="sm" color="muted">
              Special instructions
            </Text>
            <Text>{data.notes}</Text>
          </Stack>
        )}
        <Stack gap={2}>
          <Text fontSize="sm" color="muted">
            Address
          </Text>
          <Text>
            {data.line1}
            {data.line2 ? `, ${data.line2}` : ''}, {data.city} {data.postalCode}
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text fontSize="sm" color="muted">
            Before photos
          </Text>
          <Text>{photoUrls.length ? `${photoUrls.length} uploaded` : 'None'}</Text>
        </Stack>

        <HStack gap={3} pt={2}>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button colorScheme="primary" onClick={onSubmit} loading={isSubmitting}>
            Request service
          </Button>
        </HStack>
      </Stack>
    </Box>
  )
}




