'use client'

import { useColorModeValue } from '@/src/hooks/color-mode'
import {
  Box,
  Button,
  HStack,
  Image,
  NumberInput,
  Stack,
  Text,
} from '@chakra-ui/react'

type CartItem = {
  id: number
  name: string
  slug?: string
  price: number
  quantity: number
  image?: string | null
  stock?: number | null
}

type CartItemRowProps = {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')
  const maxQuantity =
    item.stock && item.stock > 0 ? Math.min(100, item.stock) : 100
  const isOutOfStock =
    item.stock !== undefined && item.stock !== null && item.stock <= 0
  const isOverLimit =
    item.stock !== undefined &&
    item.stock !== null &&
    item.quantity > item.stock

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      gap={4}
      p={4}
      borderWidth="1px"
      borderRadius="2xl"
      borderColor={cardBorder}
      bg={cardBg}
      align={{ base: 'flex-start', md: 'center' }}
    >
      <Box
        w={{ base: 'full', md: '120px' }}
        h={{ base: '160px', md: '120px' }}
        borderRadius="xl"
        overflow="hidden"
        bg="gray.100"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : (
          <Box
            w="full"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
            fontSize="sm"
          >
            No image
          </Box>
        )}
      </Box>

      <Stack flex="1" gap={2}>
        <Text fontWeight="600">{item.name}</Text>
        <Text fontSize="sm" color="muted">
          LKR {item.price.toFixed(2)} per unit
        </Text>

        {isOutOfStock && (
          <Text fontSize="sm" color="red.400">
            Out of stock. Remove this item or adjust quantity.
          </Text>
        )}
        {isOverLimit && !isOutOfStock && (
          <Text fontSize="sm" color="orange.400">
            Only {item.stock} left in stock. Update quantity to continue.
          </Text>
        )}
      </Stack>

      <Stack align={{ base: 'flex-start', md: 'flex-end' }} gap={2}>
        <NumberInput.Root
          size="sm"
          min={1}
          max={maxQuantity}
          value={item.quantity.toString()}
          disabled={isOutOfStock}
          onValueChange={(details) =>
            onQuantityChange(details.valueAsNumber || 1)
          }
          width="120px"
        >
          <NumberInput.Input />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
        </NumberInput.Root>

        <Text fontWeight="600">
          LKR {(item.price * item.quantity).toFixed(2)}
        </Text>

        <Button size="sm" variant="ghost" colorPalette="red" onClick={onRemove}>
          Remove
        </Button>
      </Stack>
    </Stack>
  )
}
