'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import { X } from 'lucide-react'

import { CatalogItemForm } from './catalog-item-form'

type CatalogCategory = {
  id: number
  name: string
  slug: string
}

type ItemFormState = {
  name: string
  slug: string
  price: string
  stock: string
  sku: string
  description: string
  ingredients: string
  nutritionInfo: string
  mainImageUrl: string
  categoryId: string
  extraCategoryIds: number[]
  imageUrlsText: string
  isActive: boolean
}

type CatalogItemDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  formState: ItemFormState
  onChange: (updates: Partial<ItemFormState>) => void
  categories: CatalogCategory[]
  isEditing: boolean
  isSaving: boolean
}

export function CatalogItemDialog({
  isOpen,
  onClose,
  onSave,
  formState,
  onChange,
  categories,
  isEditing,
  isSaving,
}: CatalogItemDialogProps) {
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
              {isEditing ? 'Edit Item' : 'Add Catalog Item'}
            </Dialog.Title>
            <p className="text-sm text-muted-foreground mt-1">
              Keep details accurate for consistent customer listings.
            </p>
          </Dialog.Header>

          <Dialog.Body className="py-4">
            <CatalogItemForm
              formState={formState}
              categories={categories}
              onChange={onChange}
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
              {isEditing ? 'Update Item' : 'Create Item'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
