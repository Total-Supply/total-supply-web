'use client'

import { MotionBox } from '@/src/components/motion/box'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { Badge, Box, HStack, Image, Stack, Text } from '@chakra-ui/react'

import { MouseEvent, useState } from 'react'

import { Button } from '../ui/button'

export type ShopItem = {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  mainImageUrl?: string | null
  description?: string | null
}

type ShopCardProps = {
  item: ShopItem
  onClick: () => void
  highlight?: string
  onAdd?: (item: ShopItem) => void
}

function renderHighlighted(text: string, query?: string) {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'ig')
  return text.split(regex).map((part, index) => {
    if (part.toLowerCase() !== query.toLowerCase()) {
      return <span key={`${part}-${index}`}>{part}</span>
    }
    return (
      <Box
        key={`${part}-${index}`}
        as="mark"
        bg="yellow.200"
        color="gray.900"
        px="1"
        borderRadius="sm"
      >
        {part}
      </Box>
    )
  })
}

export function ShopCard({ item, onClick, highlight, onAdd }: ShopCardProps) {
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')
  const priceColor = useColorModeValue('primary.600', 'primary.300')
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!onAdd || item.stock === 0) return
    onAdd(item)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1200)
  }

  return (
    <MotionBox
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      cursor="pointer"
      onClick={onClick}
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="lg"
        height="full"
      >
        <Box
          position="relative"
          h={{ base: '140px', md: '160px' }}
          bg="gray.100"
        >
          {item.mainImageUrl ? (
            <Image
              src={item.mainImageUrl}
              alt={item.name}
              objectFit="cover"
              w="full"
              h="full"
              loading="lazy"
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
          {item.stock === 0 && (
            <Badge position="absolute" top={3} right={3} colorScheme="red">
              Sold Out
            </Badge>
          )}
        </Box>

        <Stack gap={2} p={4}>
          <Box>
            <Text fontSize="sm" fontWeight="600" truncate>
              {renderHighlighted(item.name, highlight)}
            </Text>
          </Box>
          {item.description ? (
            <Box>
              <Text fontSize="xs" color="muted" truncate>
                {renderHighlighted(item.description, highlight)}
              </Text>
            </Box>
          ) : null}
          <HStack justify="space-between">
            <Text fontWeight="bold" color={priceColor}>
              LKR {item.price.toFixed(2)}
            </Text>
            <Text fontSize="xs" color="muted" truncate>
              {item.stock > 0 ? 'In stock' : 'Out of stock'}
            </Text>
          </HStack>
          {onAdd && (
            <Button
              size="sm"
              variant={isAdded ? 'solid' : 'outline'}
              colorScheme={isAdded ? 'green' : 'primary'}
              isDisabled={item.stock === 0}
              onClick={handleAdd}
            >
              {isAdded ? 'Added' : 'Add to cart'}
            </Button>
          )}
        </Stack>
      </Box>
    </MotionBox>
  )
}
