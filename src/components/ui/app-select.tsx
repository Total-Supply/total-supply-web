'use client'

import { Select, createListCollection } from '@chakra-ui/react'
import { Check } from 'lucide-react'

type Option = {
  label: string
  value: string
}

type AppSelectProps = {
  label?: string
  placeholder?: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  isDisabled?: boolean
}

export function AppSelect({
  label,
  placeholder = 'Select option',
  value,
  options,
  onChange,
  isDisabled,
}: AppSelectProps) {
  const collection = createListCollection({ items: options })

  return (
    <Select.Root
      collection={collection}
      value={[value]}
      onValueChange={(details) => onChange(details.value[0] || '')}
      disabled={isDisabled}
      size="sm"
    >
      <Select.HiddenSelect />
      {label ? (
        <Select.Label className="mb-1 text-sm font-medium text-foreground">
          {label}
        </Select.Label>
      ) : null}
      <Select.Control className="h-8">
        <Select.Trigger className="!h-8 !min-h-8 !py-0 !px-3 text-sm rounded-lg border border-border bg-background text-foreground hover:border-ring hover:bg-accent/50 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
          <Select.ValueText
            placeholder={placeholder}
            className="text-sm leading-8 text-foreground"
          />
        </Select.Trigger>
        <Select.IndicatorGroup className="!h-8 flex items-center">
          <Select.Indicator className="!h-8 flex items-center justify-center text-muted-foreground" />
          <Select.ClearTrigger className="!h-8 flex items-center justify-center text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded transition-all duration-150" />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content className="min-w-[200px] rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden">
          {collection.items.map((item) => {
            const isSelected = item.value === value

            return (
              <Select.Item
                key={item.value}
                item={item}
                className={`!h-8 !min-h-8 px-3 text-sm cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-popover-foreground hover:bg-accent/50 hover:text-accent-foreground'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 ml-2 text-primary animate-in fade-in-0 zoom-in-50 duration-150" />
                )}
              </Select.Item>
            )
          })}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}
