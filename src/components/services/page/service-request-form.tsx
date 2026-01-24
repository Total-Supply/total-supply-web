'use client'

import { MotionBox } from '@/src/components/motion/box'
import { AppSelect } from '@/src/components/ui/app-select'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@chakra-ui/react'
import { ArrowRight, FileText, MapPin } from 'lucide-react'

import { PhotoUpload } from './photo-upload'
import { PrioritySelector } from './priority-selector'
import { ServiceOfferingCard } from './service-offering-card'

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
  photoUrls: string[]
  offerings: ServiceOfferingOption[]
  isLoadingOfferings: boolean
  onSelectAddress: (id: string) => void
  onChange: (next: Partial<ServiceRequestFormData>) => void
  onUploadPhotos: (files: FileList | null) => void
  onRemovePhoto: (index: number) => void
  onContinue: () => void
}

const CLEANING_CATEGORIES = [
  { value: 'GENERAL_CLEANING', label: 'General Cleaning' },
  { value: 'DEEP_CLEAN', label: 'Deep Clean' },
  { value: 'OFFICE_CLEANING', label: 'Office Cleaning' },
  { value: 'MOVE_OUT_CLEANING', label: 'Move-Out Cleaning' },
  { value: 'SANITIZATION', label: 'Sanitization' },
  { value: 'OTHER', label: 'Other' },
]

export function ServiceRequestForm({
  data,
  addresses,
  selectedAddressId,
  isUploading,
  photoUrls,
  offerings,
  isLoadingOfferings,
  onSelectAddress,
  onChange,
  onUploadPhotos,
  onRemovePhoto,
  onContinue,
}: ServiceRequestFormProps) {
  const selectedOffering = offerings.find(
    (option) => option.id === data.serviceOfferingId,
  )
  const isCategoryLocked =
    data.type === 'CLEANING' && selectedOffering?.category

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Service Type Selection */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Service Details</h3>
            <p className="text-xs text-muted-foreground">
              Choose your service type
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Service Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
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
                { label: 'Cleaning Services', value: 'CLEANING' },
                { label: 'IT Support', value: 'IT_SUPPORT' },
              ]}
            />
          </div>

          {/* Service Offerings */}
          {offerings.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Service Package
              </label>
              {isLoadingOfferings ? (
                <div className="grid gap-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-24 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3">
                  {offerings.map((offering) => (
                    <ServiceOfferingCard
                      key={offering.id}
                      offering={offering}
                      isSelected={data.serviceOfferingId === offering.id}
                      onSelect={() => {
                        onChange({
                          serviceOfferingId: offering.id,
                          serviceOfferingName: offering.name,
                          category: offering.category || data.category,
                        })
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category for Cleaning */}
          {data.type === 'CLEANING' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Cleaning Category</label>
              <AppSelect
                value={data.category}
                onChange={(value) => onChange({ category: value })}
                isDisabled={!!isCategoryLocked}
                options={CLEANING_CATEGORIES}
              />
              {isCategoryLocked && selectedOffering?.category && (
                <p className="text-xs text-muted-foreground">
                  Category is set by the selected service package
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe your service needs in detail (minimum 20 characters)"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {data.description.length}/500 characters (min: 20)
            </p>
          </div>

          {/* Date and Priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Preferred Date & Time
              </label>
              <Input
                type="datetime-local"
                value={data.requestedDate}
                onChange={(e) => onChange({ requestedDate: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority Level</label>
              <PrioritySelector
                value={data.priority}
                onChange={(priority) => onChange({ priority })}
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Special Instructions (Optional)
            </label>
            <Textarea
              placeholder="Access codes, parking info, equipment requirements, preferred contact time..."
              value={data.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <PhotoUpload
        photoUrls={photoUrls}
        isUploading={isUploading}
        onUpload={onUploadPhotos}
        onRemove={onRemovePhoto}
        maxPhotos={3}
      />

      {/* Service Address */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
              <MapPin className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Service Address</h3>
              <p className="text-xs text-muted-foreground">
                Where do you need service?
              </p>
            </div>
          </div>

          {addresses.length > 0 && (
            <div className="w-48">
              <AppSelect
                placeholder="Use saved address"
                value={selectedAddressId}
                onChange={onSelectAddress}
                options={[
                  { label: 'Enter new address', value: '' },
                  ...addresses.map((address) => ({
                    label: address.label,
                    value: address.id,
                  })),
                ]}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.line1}
              onChange={(e) => onChange({ line1: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Apartment, Suite, etc.
            </label>
            <Input
              value={data.line2}
              onChange={(e) => onChange({ line2: e.target.value })}
              placeholder="Apt 4B, Floor 2 (Optional)"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
                placeholder="Colombo"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.postalCode}
                onChange={(e) => onChange({ postalCode: e.target.value })}
                placeholder="10400"
                maxLength={5}
              />
            </div>
          </div>

          <Checkbox
            checked={data.saveAsDefault}
            onCheckedChange={(checked) =>
              onChange({ saveAsDefault: Boolean(checked) })
            }
          >
            <span className="text-sm">
              Save this as my default service address
            </span>
          </Checkbox>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        colorPalette="primary"
        size="lg"
        onClick={onContinue}
        className="w-full"
      >
        Review Request
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </MotionBox>
  )
}
