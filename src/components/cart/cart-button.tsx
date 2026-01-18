'use client'

import { RootState } from '@/src/store'
import { Badge, Box, IconButton, useDisclosure } from '@chakra-ui/react'
import { FiShoppingCart } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { CartDrawer } from './cart-drawer'

export function CartButton() {
  const drawer = useDisclosure()
  const count = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )

  return (
    <>
      <Box position="relative">
        <IconButton
          aria-label="View cart"
          variant="ghost"
          onClick={drawer.onOpen}
        >
          <FiShoppingCart />
        </IconButton>
        {count > 0 && (
          <Badge
            position="absolute"
            top="1"
            right="1"
            colorScheme="primary"
            borderRadius="full"
            px="2"
            fontSize="xs"
          >
            {count}
          </Badge>
        )}
      </Box>
      <CartDrawer isOpen={drawer.open} onClose={drawer.onClose} />
    </>
  )
}


