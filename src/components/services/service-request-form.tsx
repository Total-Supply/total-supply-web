'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import {
  Box,
  Field,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'

export type ServiceRequestFormData = {
  type: 'CLEANING' | 'IT_SUPPORT'
  category: string
  serviceOfferingId?: number | ''
  serviceOfferingName?: string
  description: string
  requestedDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  notes: string
  line1: string
  line2: string
  city: string
  postalCode: string
  saveAsDefault: boolean
}

type ServiceOfferingOption = {
  id: number
  name: string
  description?: string | null
  basePrice?: number | null
  category?: string | null
}

type ServiceRequestFormProps = {
  data: ServiceRequestFormData
  addresses: {
    id: string
    label: string
    line1: string
    line2?: string | null
    city: string
    postalCode: string
  }[]
  selectedAddressId: string
  isUploading: boolean
  photoCount: number
  offerings: ServiceOfferingOption[]
  isLoadingOfferings: boolean
  onSelectAddress: (id: string) => void
  onChange: (next: Partial<ServiceRequestFormData>) => void
  onUploadPhotos: (files: FileList | null) => void
  onContinue: () => void
}

const CLEANING_CATEGORIES = [
  { value: 'GENERAL_CLEANING', label: 'General cleaning' },
  { value: 'DEEP_CLEAN', label: 'Deep clean' },
  { value: 'OFFICE_CLEANING', label: 'Office cleaning' },
  { value: 'MOVE_OUT_CLEANING', label: 'Move-out cleaning' },
  { value: 'SANITIZATION', label: 'Sanitization' },
  { value: 'OTHER', label: 'Other' },
]

export function ServiceRequestForm({
  data,
  addresses,
  selectedAddressId,
  isUploading,
  photoCount,
  offerings,
  isLoadingOfferings,
  onSelectAddress,
  onChange,
  onUploadPhotos,
  onContinue,
}: ServiceRequestFormProps) {
  const selectedOffering = offerings.find(
    (option) => option.id === data.serviceOfferingId,
  )
  const isCategoryLocked =
    data.type === 'CLEANING' && selectedOffering?.category

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      bg="whiteAlpha.900"
      boxShadow="lg"
    >
      <Stack gap={5}>
        <Text fontSize="lg" fontWeight="600">
          Request Service
        </Text>

        <Field.Root>
          <Field.Label>Service type</Field.Label>
          <AppSelect
            value={data.type}
            onChange={(value) =>
              onChange({
                type: value as ServiceRequestFormData['type'],
                serviceOfferingId: '',
                serviceOfferingName: '',
              })
            }
            options={[
              { label: 'Cleaning', value: 'CLEANING' },
              { label: 'IT Support', value: 'IT_SUPPORT' },
            ]}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Service package</Field.Label>
          <AppSelect
            placeholder={
              isLoadingOfferings ? 'Loading offerings...' : 'Select a package'
            }
            value={data.serviceOfferingId ? String(data.serviceOfferingId) : ''}
            onChange={(value) => {
              const nextId = value ? Number(value) : ''
              const match = offerings.find((option) => option.id === nextId)
              onChange({
                serviceOfferingId: nextId,
                serviceOfferingName: match?.name,
                category: match?.category || data.category,
              })
            }}
            isDisabled={isLoadingOfferings || offerings.length === 0}
            options={[
              { label: 'Select a package', value: '' },
              ...offerings.map((option) => ({
                label: `${option.name}${option.basePrice ? ` - LKR ${option.basePrice}` : ''}`,
                value: String(option.id),
              })),
            ]}
          />
          {selectedOffering?.description && (
            <Text fontSize="xs" color="muted" mt={2}>
              {selectedOffering.description}
            </Text>
          )}
        </Field.Root>

        {data.type === 'CLEANING' && (
          <Field.Root>
            <Field.Label>Cleaning category</Field.Label>
            <AppSelect
              value={data.category}
              onChange={(value) => onChange({ category: value })}
              isDisabled={!!isCategoryLocked}
              options={CLEANING_CATEGORIES.map((category) => ({
                label: category.label,
                value: category.value,
              }))}
            />
            {isCategoryLocked && selectedOffering?.category && (
              <Text fontSize="xs" color="muted" mt={2}>
                Category is set by the selected service package.
              </Text>
            )}
          </Field.Root>
        )}

        <Field.Root required>
          <Field.Label>Description</Field.Label>
          <Textarea
            placeholder="Describe your request (min 20 characters)"
            value={data.description}
            onChange={(event) => onChange({ description: event.target.value })}
            rows={4}
          />
        </Field.Root>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Field.Root>
            <Field.Label>Preferred date & time</Field.Label>
            <Input
              type="datetime-local"
              value={data.requestedDate}
              onChange={(event) =>
                onChange({ requestedDate: event.target.value })
              }
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Priority</Field.Label>
            <AppSelect
              value={data.priority}
              onChange={(value) =>
                onChange({
                  priority: value as ServiceRequestFormData['priority'],
                })
              }
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
                { label: 'Urgent', value: 'URGENT' },
              ]}
            />
          </Field.Root>
        </SimpleGrid>

        <Field.Root>
          <Field.Label>Special instructions</Field.Label>
          <Textarea
            placeholder="Access notes, equipment info, preferred contact time"
            value={data.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            rows={3}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Before photos (up to 3)</Field.Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            isDisabled={isUploading}
            onChange={(event) => onUploadPhotos(event.target.files)}
          />
          <Text fontSize="xs" color="muted" mt={2}>
            {photoCount}/3 photos uploaded.
          </Text>
        </Field.Root>

        <Stack gap={3}>
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="600">
              Service address
            </Text>
            {addresses.length > 0 && (
              <Box maxW="200px">
                <AppSelect
                  placeholder="Select saved"
                  value={selectedAddressId}
                  onChange={(value) => onSelectAddress(value)}
                  options={addresses.map((address) => ({
                    label: address.label,
                    value: address.id,
                  }))}
                />
              </Box>
            )}
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field.Root required>
              <Field.Label>Street address</Field.Label>
              <Input
                value={data.line1}
                onChange={(event) => onChange({ line1: event.target.value })}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Apartment / Suite</Field.Label>
              <Input
                value={data.line2}
                onChange={(event) => onChange({ line2: event.target.value })}
              />
            </Field.Root>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field.Root required>
              <Field.Label>City</Field.Label>
              <Input
                value={data.city}
                onChange={(event) => onChange({ city: event.target.value })}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Postal code</Field.Label>
              <Input
                value={data.postalCode}
                onChange={(event) =>
                  onChange({ postalCode: event.target.value })
                }
              />
            </Field.Root>
          </SimpleGrid>
          <Checkbox
            checked={data.saveAsDefault}
            onCheckedChange={(value) =>
              onChange({ saveAsDefault: Boolean(value) })
            }
          >
            Save as default address
          </Checkbox>
        </Stack>

        <Button colorPalette="primary" onClick={onContinue}>
          Review request
        </Button>
      </Stack>
    </Box>
  )
}
