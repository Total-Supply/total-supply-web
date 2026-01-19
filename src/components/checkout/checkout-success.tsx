'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { Button, Container, Stack, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

export function CheckoutSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <Stack gap={10}>
      <BackgroundGradient height="240px" />
      <Container maxW="container.md" pt={{ base: 8, md: 12 }} pb={16}>
        <Stack gap={4} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Order confirmed
            </Text>
          </MotionBox>
          <Text color="muted">
            Your order has been placed successfully.
          </Text>
          {orderNumber && (
            <Text fontWeight="600">Order #{orderNumber}</Text>
          )}
          <Stack gap={3} pt={4}>
            <Button
              colorScheme="primary"
              onClick={() =>
                orderNumber
                  ? router.push(`/orders/${orderNumber}`)
                  : router.push('/orders')
              }
            >
              Track order
            </Button>
            <Button variant="outline" onClick={() => router.push('/shop')}>
              Continue shopping
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  )
}



