'use client'

import { Box, HStack, Image, Stack, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@/src/hooks/color-mode'
type OrderItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string | null
}

type CheckoutOrderReviewProps = {
  items: OrderItem[]
}

export function CheckoutOrderReview({ items }: CheckoutOrderReviewProps) {
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')

  return (
    <Box borderWidth="1px" borderColor={cardBorder} borderRadius="2xl" p={6} bg={cardBg}>
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="600">
          Order review
        </Text>
        <Stack gap={3}>
          {items.map((item) => (
            <HStack key={item.id} gap={3} align="flex-start">
              <Box boxSize="48px" borderRadius="lg" overflow="hidden" bg="gray.100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} w="full" h="full" objectFit="cover" />
                ) : (
                  <Box
                    w="full"
                    h="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.400"
                    fontSize="xs"
                  >
                    No image
                  </Box>
                )}
              </Box>
              <Stack gap={0} flex="1">
                <Text fontSize="sm" fontWeight="600">
                  {item.name}
                </Text>
                <Text fontSize="xs" color="muted">
                  Qty {item.quantity}
                </Text>
              </Stack>
              <Text fontSize="sm" fontWeight="600">
                LKR {(item.price * item.quantity).toFixed(2)}
              </Text>
            </HStack>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}





