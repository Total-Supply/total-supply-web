'use client'

import { Box, Button, HStack, Separator, Stack, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@/src/hooks/color-mode'
type CheckoutSummaryProps = {
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  onPlaceOrder: () => void
}

export function CheckoutSummary({
  subtotal,
  tax,
  deliveryFee,
  total,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')

  return (
    <Box borderWidth="1px" borderColor={cardBorder} borderRadius="2xl" p={6} bg={cardBg}>
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="600">
          Summary
        </Text>
        <Stack gap={3}>
          <HStack justify="space-between">
            <Text color="muted">Subtotal</Text>
            <Text fontWeight="600">LKR {subtotal.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="muted">Tax</Text>
            <Text fontWeight="600">LKR {tax.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="muted">Delivery fee</Text>
            <Text fontWeight="600">LKR {deliveryFee.toFixed(2)}</Text>
          </HStack>
        </Stack>
        <Separator />
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="600">
            Total
          </Text>
          <Text fontSize="lg" fontWeight="700">
            LKR {total.toFixed(2)}
          </Text>
        </HStack>
        <Button colorScheme="primary" onClick={onPlaceOrder}>
          Place order
        </Button>
      </Stack>
    </Box>
  )
}





