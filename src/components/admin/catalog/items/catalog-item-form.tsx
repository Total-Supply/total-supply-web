'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Checkbox } from '@chakra-ui/react'

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

type CatalogItemFormProps = {
  formState: ItemFormState
  categories: CatalogCategory[]
  onChange: (updates: Partial<ItemFormState>) => void
}

export function CatalogItemForm({
  formState,
  categories,
  onChange,
}: CatalogItemFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={formState.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="Product name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Slug</label>
          <Input
            value={formState.slug}
            onChange={(event) => onChange({ slug: event.target.value })}
            placeholder="product-slug"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Price (LKR) <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            value={formState.price}
            onChange={(event) => onChange({ price: event.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Stock</label>
          <Input
            type="number"
            value={formState.stock}
            onChange={(event) => onChange({ stock: event.target.value })}
            placeholder="0"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">SKU</label>
          <Input
            value={formState.sku}
            onChange={(event) => onChange({ sku: event.target.value })}
            placeholder="SKU-001"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Primary category <span className="text-destructive">*</span>
        </label>
        <AppSelect
          placeholder="Select category"
          value={formState.categoryId}
          options={[
            { label: 'Select category', value: '' },
            ...categories.map((category) => ({
              label: category.name,
              value: String(category.id),
            })),
          ]}
          onChange={(value) => onChange({ categoryId: value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Additional categories
        </label>
        <div className="grid gap-2 md:grid-cols-2">
          {categories
            .filter((category) => String(category.id) !== formState.categoryId)
            .map((category) => (
              <Checkbox.Root
                key={category.id}
                checked={formState.extraCategoryIds.includes(category.id)}
                onCheckedChange={(details) => {
                  const next = new Set(formState.extraCategoryIds)
                  if (details.checked) {
                    next.add(category.id)
                  } else {
                    next.delete(category.id)
                  }
                  onChange({ extraCategoryIds: Array.from(next) })
                }}
                className="flex items-center gap-2"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control className="transition-all duration-200 hover:scale-110 border-2 border-border rounded">
                  <Checkbox.Indicator className="text-primary" />
                </Checkbox.Control>
                <Checkbox.Label className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  {category.name}
                </Checkbox.Label>
              </Checkbox.Root>
            ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          value={formState.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Ingredients
          </label>
          <Textarea
            value={formState.ingredients}
            onChange={(event) => onChange({ ingredients: event.target.value })}
            placeholder="List ingredients"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nutrition info
          </label>
          <Textarea
            value={formState.nutritionInfo}
            onChange={(event) =>
              onChange({ nutritionInfo: event.target.value })
            }
            placeholder="Nutritional information"
            rows={3}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Main image URL
          </label>
          <Input
            value={formState.mainImageUrl}
            onChange={(event) => onChange({ mainImageUrl: event.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Gallery image URLs
          </label>
          <Textarea
            placeholder="One URL per line"
            value={formState.imageUrlsText}
            onChange={(event) =>
              onChange({ imageUrlsText: event.target.value })
            }
            rows={3}
          />
        </div>
      </div>

      <Checkbox.Root
        checked={formState.isActive}
        onCheckedChange={(details) =>
          onChange({ isActive: details.checked === true })
        }
        className="flex items-center gap-2"
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control className="transition-all duration-200 hover:scale-110 border-2 border-border rounded">
          <Checkbox.Indicator className="text-primary" />
        </Checkbox.Control>
        <Checkbox.Label className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Item is active
        </Checkbox.Label>
      </Checkbox.Root>
    </div>
  )
}
