'use client'

import { useColorModeValue } from '@/src/hooks/color-mode'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import type { UseToastOptions } from '@/src/hooks/use-toast'

type ToastArgs = {
  title: string
  description: string
  onViewCart: () => void
}

function AddToCartToast({ title, description, onViewCart }: ToastArgs) {
  const cardBg = useColorModeValue('white', 'gray.900')
  const border = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  return (
    <Box
      bg={cardBg}
      borderWidth="1px"
      borderColor={border}
      borderRadius="lg"
      boxShadow="lg"
      px={4}
      py={3}
    >
      <HStack justify="space-between" gap={4}>
        <Box>
          <Text fontWeight="600">{title}</Text>
          <Text fontSize="sm" color="muted">
            {description}
          </Text>
        </Box>
        <Button size="sm" variant="outline" onClick={onViewCart}>
          View cart
        </Button>
      </HStack>
    </Box>
  )
}

export function showAddToCartToast(
  toast: (options: UseToastOptions) => string | number,
  { title, description, onViewCart }: ToastArgs,
) {
  toast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
    render: () => (
      <AddToCartToast
        title={title}
        description={description}
        onViewCart={onViewCart}
      />
    ),
  })
}
