'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { X } from 'lucide-react'

import { ServiceOfferingForm } from './service-offering-form'

type ServiceOfferingFormState = {
  name: string
  slug: string
  type: string
  category: string
  description: string
  basePrice: string
  isActive: boolean
}

type ServiceOfferingDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  formState: ServiceOfferingFormState
  onChange: (updates: Partial<ServiceOfferingFormState>) => void
  isEditing: boolean
  isSaving: boolean
  categoryOptions: string[]
}

export function ServiceOfferingDialog({
  isOpen,
  onClose,
  onSave,
  formState,
  onChange,
  isEditing,
  isSaving,
  categoryOptions,
}: ServiceOfferingDialogProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content
          maxH="85vh"
          overflowY="auto"
          className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <Dialog.Title className="text-lg font-semibold text-card-foreground">
              {isEditing ? 'Edit Offering' : 'Add Service Offering'}
            </Dialog.Title>
            <p className="text-sm text-muted-foreground mt-1">
              Offerings appear in the customer service request flow.
            </p>
          </Dialog.Header>

          <Dialog.Body className="py-4">
            <ServiceOfferingForm
              formState={formState}
              onChange={onChange}
              categoryOptions={categoryOptions}
            />
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="teal"
              onClick={onSave}
              disabled={isSaving}
              loading={isSaving}
            >
              {isEditing ? 'Update Offering' : 'Create Offering'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
