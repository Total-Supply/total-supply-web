'use client'

import { Box, Button, HStack, Separator, Stack, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@/src/hooks/color-mode'
type CartSummaryProps = {
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  onContinue: () => void
  onCheckout: () => void
}

export function CartSummary({
  subtotal,
  tax,
  deliveryFee,
  total,
  onContinue,
  onCheckout,
}: CartSummaryProps) {
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')

  return (
    <Box
      borderWidth="1px"
      borderColor={cardBorder}
      borderRadius="2xl"
      bg={cardBg}
      p={6}
      boxShadow="lg"
    >
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="600">
          Order summary
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
          <Text fontSize="xs" color="muted">
            Delivery fees are estimated and confirmed at checkout.
          </Text>
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
        <Stack gap={3}>
          <Button colorPalette="primary" onClick={onCheckout}>
            Proceed to checkout
          </Button>
          <Button variant="outline" onClick={onContinue}>
            Continue shopping
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}





