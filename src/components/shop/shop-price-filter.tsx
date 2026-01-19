'use client'

import {
  Box,
  HStack,
  Slider,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

type ShopPriceFilterProps = {
  minValue: number
  maxValue: number
  rangeMin: number
  rangeMax: number
  onChange: (minValue: number, maxValue: number) => void
  onReset: () => void
}

export function ShopPriceFilter({
  minValue,
  maxValue,
  rangeMin,
  rangeMax,
  onChange,
  onReset,
}: ShopPriceFilterProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isDirty = minValue !== rangeMin || maxValue !== rangeMax

  const handleInputChange = (value: string, type: 'min' | 'max') => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return

    const nextMin = type === 'min' ? parsed : minValue
    const nextMax = type === 'max' ? parsed : maxValue
    const clampedMin = Math.max(rangeMin, Math.min(nextMin, rangeMax))
    const clampedMax = Math.max(rangeMin, Math.min(nextMax, rangeMax))

    if (clampedMin <= clampedMax) onChange(clampedMin, clampedMax)
  }

  return (
    <Stack gap={3}>
      <HStack justify="space-between">
        <Text fontWeight="600">Price range</Text>
        {isDirty && (
          <Button size="xs" variant="ghost" onClick={onReset}>
            Reset
          </Button>
        )}
      </HStack>

      <Text fontSize="sm" color="fg.muted">
        LKR {minValue.toLocaleString()} - {maxValue.toLocaleString()}
      </Text>

      {isMobile ? (
        <HStack gap={3}>
          <Input
            type="number"
            value={minValue}
            min={rangeMin}
            max={rangeMax}
            onChange={(event) => handleInputChange(event.target.value, 'min')}
          />
          <Input
            type="number"
            value={maxValue}
            min={rangeMin}
            max={rangeMax}
            onChange={(event) => handleInputChange(event.target.value, 'max')}
          />
        </HStack>
      ) : (
        <Slider.Root
          min={rangeMin}
          max={rangeMax}
          value={[minValue, maxValue]}
          aria-label={['min price', 'max price']}
          onValueChange={(details) => {
            const [min, max] = details.value as number[]
            onChange(min, max)
          }}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
      )}

      {isDirty && (
        <Box>
          <Tag.Root size="sm" borderRadius="full" variant="subtle">
            <Tag.Label>
              LKR {minValue.toLocaleString()} - {maxValue.toLocaleString()}
            </Tag.Label>
            <Tag.CloseTrigger onClick={onReset} />
          </Tag.Root>
        </Box>
      )}
    </Stack>
  )
}
