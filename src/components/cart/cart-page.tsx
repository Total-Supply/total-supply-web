'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { RootState } from '@/src/store'
import {
  removeFromCart,
  syncCartItems,
  updateQuantity,
} from '@/src/store/slices/cartSlice'
import {
  Box,
  Button,
  Container,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useToast } from '@/src/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useMemo, useState } from 'react'

import { CartItemRow } from './cart-item-row'
import { CartSummary } from './cart-summary'

type FoodItemSnapshot = {
  id: number
  price: number | string
  stock: number
  name: string
  slug: string
  mainImageUrl?: string | null
}

export function CartPage() {
  const router = useRouter()
  const toast = useToast()
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.cart.items)
  const total = useSelector((state: RootState) => state.cart.total)
  const [isSyncing, setIsSyncing] = useState(false)
  const stickyBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const stickyBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  const idsKey = useMemo(() => items.map((item) => item.id).join(','), [items])

  useEffect(() => {
    if (!idsKey.length) return
    const load = async () => {
      setIsSyncing(true)
      try {
        const params = new URLSearchParams({ ids: idsKey })
        const response = await fetch(`/api/food-items?${params.toString()}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to sync prices')
        }
        const updates = (data.data || []).map((item: FoodItemSnapshot) => ({
          id: item.id,
          price: Number(item.price),
          stock: item.stock,
          name: item.name,
          slug: item.slug,
          image: item.mainImageUrl,
        }))
        dispatch(syncCartItems(updates))
      } catch (error) {
        toast({
          title: 'Unable to sync cart',
          status: 'warning',
          duration: 2500,
        })
      } finally {
        setIsSyncing(false)
      }
    }

    load()
  }, [dispatch, idsKey, toast])

  const tax = 0
  const deliveryFee = total > 0 ? 0 : 0
  const grandTotal = total + tax + deliveryFee

  return (
    <Stack gap={10}>
      <BackgroundGradient height="260px" />
      <Container
        maxW="container.xl"
        pt={{ base: 8, md: 12 }}
        pb={{ base: 24, md: 16 }}
      >
        <Stack gap={3}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Your cart
            </Text>
          </MotionBox>
          <Text color="muted" fontSize={{ base: 'sm', md: 'md' }}>
            Review your items before checkout.
          </Text>
        </Stack>

        {items.length === 0 ? (
          <Stack
            mt={10}
            gap={3}
            align="center"
            borderRadius="2xl"
            borderWidth="1px"
            borderStyle="dashed"
            py={16}
          >
            <Text fontSize="lg" fontWeight="600">
              Your cart is empty
            </Text>
            <Text color="muted" fontSize="sm">
              Browse the catalog to add fresh items.
            </Text>
            <Button onClick={() => router.push('/shop')} colorScheme="primary">
              Continue shopping
            </Button>
          </Stack>
        ) : (
          <Stack
            gap={{ base: 8, lg: 10 }}
            mt={10}
            direction={{ base: 'column', lg: 'row' }}
          >
            <Stack gap={4} flex="1">
              {isSyncing && (
                <Text fontSize="sm" color="muted">
                  Updating prices and availability...
                </Text>
              )}
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onRemove={() => dispatch(removeFromCart(item.id))}
                  onQuantityChange={(quantity) =>
                    dispatch(updateQuantity({ id: item.id, quantity }))
                  }
                />
              ))}
            </Stack>

            <Box
              w={{ base: 'full', lg: '320px' }}
              position={{ base: 'static', lg: 'sticky' }}
              top={{ lg: '120px' }}
              alignSelf="flex-start"
            >
              <CartSummary
                subtotal={total}
                tax={tax}
                deliveryFee={deliveryFee}
                total={grandTotal}
                onContinue={() => router.push('/shop')}
                onCheckout={() => router.push('/checkout')}
              />
            </Box>
          </Stack>
        )}
      </Container>

      {items.length > 0 && (
        <Box
          display={{ base: 'block', lg: 'none' }}
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          bg={stickyBg}
          borderTopWidth="1px"
          borderColor={stickyBorder}
          px={4}
          py={3}
          boxShadow="0 -10px 24px rgba(15, 23, 42, 0.12)"
        >
          <HStack justify="space-between">
            <Text fontWeight="600">Total: LKR {grandTotal.toFixed(2)}</Text>
            <Button
              colorScheme="primary"
              onClick={() => router.push('/checkout')}
            >
              Checkout
            </Button>
          </HStack>
        </Box>
      )}
    </Stack>
  )
}
