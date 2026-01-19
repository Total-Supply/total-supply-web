'use client'

import {
  Box,
  Button,
  HStack,
  Menu,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'

import { Checkbox } from '../ui/checkbox'

export type CategoryFilter = {
  id: number
  name: string
  slug: string
  itemCount: number
}

type ShopFiltersProps = {
  categories: CategoryFilter[]
  selected: string[]
  onToggle: (slug: string) => void
  onClear: () => void
}

export function ShopFilters({
  categories,
  selected,
  onToggle,
  onClear,
}: ShopFiltersProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Stack gap={4}>
      <HStack justify="space-between">
        <Text fontWeight="600">Categories</Text>
        {selected.length > 0 && (
          <Button size="xs" variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </HStack>

      {isMobile ? (
        <Menu.Root closeOnSelect={false}>
          <Menu.Trigger asChild>
            <Button variant="outline">
              {selected.length
                ? `${selected.length} selected`
                : 'Select categories'}
              <Box as="span" ms="2">
                <ChevronDown size={16} />
              </Box>
            </Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content minW="240px">
              <Menu.ItemGroup>
                {categories.map((category) => (
                  <Menu.CheckboxItem
                    key={category.id}
                    value={category.slug}
                    checked={selected.includes(category.slug)}
                    onCheckedChange={() => onToggle(category.slug)}
                  >
                    <Menu.ItemIndicator />
                    <Box as="span" flex="1">
                      {category.name} ({category.itemCount})
                    </Box>
                  </Menu.CheckboxItem>
                ))}
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      ) : (
        <Stack gap={2}>
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              isChecked={selected.includes(category.slug)}
              onChange={() => onToggle(category.slug)}
            >
              <HStack gap={2}>
                <Text>{category.name}</Text>
                <Box as="span" fontSize="xs" color="muted">
                  {category.itemCount}
                </Box>
              </HStack>
            </Checkbox>
          ))}
        </Stack>
      )}

      {selected.length > 0 && (
        <HStack flexWrap="wrap">
          {selected.map((slug) => {
            const category = categories.find((item) => item.slug === slug)
            return (
              <Tag.Root
                key={slug}
                size="sm"
                borderRadius="full"
                variant="subtle"
              >
                <Tag.Label>{category?.name || slug}</Tag.Label>
                <Tag.CloseTrigger onClick={() => onToggle(slug)} />
              </Tag.Root>
            )
          })}
        </HStack>
      )}
    </Stack>
  )
}
