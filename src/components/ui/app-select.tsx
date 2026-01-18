'use client'

import { Select, createListCollection } from '@chakra-ui/react'

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
    >
      <Select.HiddenSelect />
      {label ? <Select.Label>{label}</Select.Label> : null}
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
          <Select.ClearTrigger />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {collection.items.map((item) => (
            <Select.Item key={item.value} item={item}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}


