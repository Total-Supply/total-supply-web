'use client'

import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'

type CategoryFormState = {
  name: string
  slug: string
  description: string
  imageUrl: string
}

type CategoryFormProps = {
  formState: CategoryFormState
  onChange: (updates: Partial<CategoryFormState>) => void
}

export function CategoryForm({ formState, onChange }: CategoryFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={formState.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="Category name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Slug</label>
        <Input
          value={formState.slug}
          onChange={(event) => onChange({ slug: event.target.value })}
          placeholder="category-slug"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to auto-generate from name
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          value={formState.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Brief description of this category"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Image URL</label>
        <Input
          value={formState.imageUrl}
          onChange={(event) => onChange({ imageUrl: event.target.value })}
          placeholder="https://example.com/category-image.jpg"
        />
        {formState.imageUrl && (
          <div className="mt-2">
            <img
              src={formState.imageUrl}
              alt="Category preview"
              className="h-24 w-24 rounded-lg object-cover ring-1 ring-border"
            />
          </div>
        )}
      </div>
    </div>
  )
}
