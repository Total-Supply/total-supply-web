'use client'

import { addToCart } from '@/src/store/slices/cartSlice'
import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

interface ProductCardProps {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  stock: number
  category?: string
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  stock,
  category,
}: ProductCardProps) {
  const dispatch = useDispatch()
  const toast = useToast()

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        image,
      }),
    )

    toast({
      title: 'Added to cart',
      description: `${name} has been added to your cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
    >
      <Image
        src={image || '/placeholder.png'}
        alt={name}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <VStack p={4} align="start" spacing={2}>
        {category && (
          <Badge colorScheme="primary" fontSize="xs">
            {category}
          </Badge>
        )}

        <Heading size="md" noOfLines={1}>
          {name}
        </Heading>

        {description && (
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {description}
          </Text>
        )}

        <Text fontSize="xl" fontWeight="bold" color="primary.500">
          LKR {price.toFixed(2)}
        </Text>

        <Button
          leftIcon={<FiShoppingCart />}
          colorScheme="primary"
          width="full"
          onClick={handleAddToCart}
          isDisabled={stock === 0}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </VStack>
    </Box>
  )
}
