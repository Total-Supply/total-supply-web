'use client'

import { AppSelect } from '@/src/components/ui/app-select'
import { Input } from '@/src/components/ui/input'
import { Checkbox, Textarea } from '@chakra-ui/react'

type ServiceOfferingFormState = {
  name: string
  slug: string
  type: string
  category: string
  description: string
  basePrice: string
  isActive: boolean
}

type ServiceOfferingFormProps = {
  formState: ServiceOfferingFormState
  onChange: (updates: Partial<ServiceOfferingFormState>) => void
  categoryOptions: string[]
}

export function ServiceOfferingForm({
  formState,
  onChange,
  categoryOptions,
}: ServiceOfferingFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={formState.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="Enter offering name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Slug</label>
        <Input
          value={formState.slug}
          onChange={(event) => onChange({ slug: event.target.value })}
          placeholder="auto-generated-slug"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to auto-generate from name
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Type <span className="text-destructive">*</span>
          </label>
          <AppSelect
            value={formState.type}
            options={[
              { label: 'Cleaning', value: 'CLEANING' },
              { label: 'IT Support', value: 'IT_SUPPORT' },
            ]}
            onChange={(value) =>
              onChange({
                type: value,
                category: value === 'IT_SUPPORT' ? '' : formState.category,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Category
          </label>
          <AppSelect
            placeholder="No category"
            value={formState.category}
            options={[
              { label: 'No category', value: '' },
              ...categoryOptions.map((option) => ({
                label: option.replace(/_/g, ' '),
                value: option,
              })),
            ]}
            onChange={(value) => onChange({ category: value })}
            isDisabled={formState.type === 'IT_SUPPORT'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          value={formState.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Describe the service offering"
          className="rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 hover:border-ring focus:border-primary focus:ring-2 focus:ring-primary/20"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Base price (LKR)
          </label>
          <Input
            type="number"
            value={formState.basePrice}
            onChange={(event) => onChange({ basePrice: event.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Checkbox.Root
            checked={formState.isActive}
            onCheckedChange={(details) =>
              onChange({ isActive: details.checked === true })
            }
            className="flex items-center gap-2 h-8"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control className="transition-all duration-200 hover:scale-110 border-2 border-border rounded">
              <Checkbox.Indicator className="text-primary" />
            </Checkbox.Control>
            <Checkbox.Label className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              Offering is active
            </Checkbox.Label>
          </Checkbox.Root>
        </div>
      </div>
    </div>
  )
}
