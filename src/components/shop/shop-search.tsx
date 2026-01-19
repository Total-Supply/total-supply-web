'use client'

import {
  Box,
  HStack,
  IconButton,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FiSearch, FiX } from 'react-icons/fi'

import { Input } from '../ui/input'

type ShopSearchProps = {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  resultsCount?: number
  recent: string[]
  onSelectRecent: (value: string) => void
}

export function ShopSearch({
  value,
  onChange,
  onClear,
  resultsCount,
  recent,
  onSelectRecent,
}: ShopSearchProps) {
  return (
    <Stack gap={3}>
      <InputGroup
        startElement={
          <Box pointerEvents="none">
            <FiSearch />
          </Box>
        }
        endElement={
          value ? (
            <IconButton
              aria-label="Clear search"
              size="sm"
              variant="ghost"
              onClick={onClear}
            >
              <FiX />
            </IconButton>
          ) : undefined
        }
      >
        <Input
          value={value}
          placeholder="Search by name or description"
          onChange={(event) => onChange(event.target.value)}
          borderRadius="full"
          bg="whiteAlpha.900"
          size="lg"
        />
      </InputGroup>

      {typeof resultsCount === 'number' && value ? (
        <Text fontSize="sm" color="fg.muted">
          {resultsCount} results for &quot;{value}&quot;
        </Text>
      ) : null}

      {recent.length > 0 && !value ? (
        <HStack gap={2} flexWrap="wrap">
          {recent.map((item) => (
            <Box
              key={item}
              as="button"
              onClick={() => onSelectRecent(item)}
              px="3"
              py="1"
              borderRadius="full"
              fontSize="xs"
              bg="blackAlpha.50"
            >
              {item}
            </Box>
          ))}
        </HStack>
      ) : null}
    </Stack>
  )
}
