'use client'

import { useColorModeValue } from '@/src/hooks/color-mode'
import { RootState } from '@/src/store'
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Image,
  Portal,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter()
  const items = useSelector((state: RootState) => state.cart.items)
  const total = useSelector((state: RootState) => state.cart.total)
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200')
  const muted = useColorModeValue('gray.600', 'gray.300')

  const tax = 0
  const deliveryFee = total > 0 ? 0 : 0
  const grandTotal = total + tax + deliveryFee

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  return (
    <Drawer.Root
      open={isOpen}
      placement="end"
      size="sm"
      onOpenChange={(details) => {
        if (!details.open) {
          onClose()
        }
      }}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={cardBg}>
            <Drawer.Header>
              <Drawer.Title>Your cart</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              {items.length === 0 ? (
                <Stack gap={3} align="center" mt={8}>
                  <Text fontWeight="600">Your cart is empty</Text>
                  <Text fontSize="sm" color={muted} textAlign="center">
                    Add fresh items from the catalog to get started.
                  </Text>
                  <Button
                    colorPalette="primary"
                    onClick={() => handleNavigate('/shop')}
                  >
                    Browse catalog
                  </Button>
                </Stack>
              ) : (
                <Stack gap={4}>
                  {items.map((item) => (
                    <HStack
                      key={item.id}
                      gap={3}
                      borderWidth="1px"
                      borderColor={cardBorder}
                      borderRadius="xl"
                      p={3}
                      align="flex-start"
                    >
                      <Box
                        boxSize="60px"
                        borderRadius="lg"
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
                            fontSize="xs"
                          >
                            No image
                          </Box>
                        )}
                      </Box>
                      <Stack gap={1} flex="1">
                        <Text fontSize="sm" fontWeight="600">
                          {item.name}
                        </Text>
                        <Text fontSize="xs" color={muted}>
                          LKR {item.price.toFixed(2)}
                        </Text>
                        <Text fontSize="xs" color={muted}>
                          Qty {item.quantity}
                        </Text>
                        {item.stock !== undefined &&
                          item.stock !== null &&
                          item.stock <= 0 && (
                            <Text fontSize="xs" color="red.400">
                              Out of stock
                            </Text>
                          )}
                      </Stack>
                      <Text fontSize="sm" fontWeight="600">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </HStack>
                  ))}
                </Stack>
              )}
            </Drawer.Body>
            {items.length > 0 && (
              <Drawer.Footer>
                <Stack gap={3} w="full">
                  <Separator />
                  <HStack justify="space-between">
                    <Text color={muted}>Subtotal</Text>
                    <Text fontWeight="600">LKR {total.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color={muted}>Tax</Text>
                    <Text fontWeight="600">LKR {tax.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color={muted}>Delivery fee</Text>
                    <Text fontWeight="600">LKR {deliveryFee.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="600">Total</Text>
                    <Text fontWeight="700">LKR {grandTotal.toFixed(2)}</Text>
                  </HStack>
                  <HStack gap={3} pt={2}>
                    <Button
                      variant="outline"
                      flex="1"
                      onClick={() => handleNavigate('/cart')}
                    >
                      View cart
                    </Button>
                    <Button
                      colorPalette="primary"
                      flex="1"
                      onClick={() => handleNavigate('/checkout')}
                    >
                      Checkout
                    </Button>
                  </HStack>
                </Stack>
              </Drawer.Footer>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
