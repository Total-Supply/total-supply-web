'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { apiClient } from '@/src/lib/api/client'
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'

import { useEffect, useState } from 'react'

interface FoodItem {
  id: number
  name: string
  slug: string
  description: string
  price: number
  mainImageUrl: string
  stock: number
  isActive: boolean
  category: {
    id: number
    name: string
  }
}

const Shop: NextPage = () => {
  const router = useRouter()
  const [products, setProducts] = useState<FoodItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedCategory, search])

  const loadData = async () => {
    try {
      setLoading(true)
      // TODO: Implement API calls when endpoints are ready
      // const productsData = await apiClient.products.getAll({ category: selectedCategory, search })
      // const categoriesData = await apiClient.categories.getAll()

      // Mock data for now
      setProducts([])
      setCategories([])
    } catch (error) {
      console.error('Failed to load shop data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <BackgroundGradient height="300px" />

      <Container maxW="container.xl" pt={20} pb={10}>
        {/* Header */}
        <VStack spacing={4} textAlign="center" mb={8}>
          <Heading size="2xl">Our Shop</Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Browse our selection of fresh ingredients and quality food items
          </Text>
        </VStack>

        {/* Filters */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          mb={8}
          bg="white"
          p={4}
          borderRadius="xl"
          boxShadow="sm"
        >
          <HStack flex={1}>
            <Icon as={FiSearch} color="gray.400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              border="none"
              _focus={{ outline: 'none' }}
            />
          </HStack>

          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW={{ base: 'full', md: '250px' }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </Stack>

        {/* Products Grid */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height="400px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        ) : products.length === 0 ? (
          <VStack spacing={4} py={20}>
            <Text fontSize="xl" color="gray.500">
              No products found
            </Text>
            <Text color="gray.400">
              Try adjusting your filters or check back later
            </Text>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/shop/${product.slug}`)}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}

interface ProductCardProps {
  product: FoodItem
  onClick: () => void
}

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <VStack
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
      transition="all 0.3s"
      cursor="pointer"
      onClick={onClick}
      align="stretch"
    >
      <Box position="relative" h="200px" bg="gray.100">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            objectFit="cover"
            w="full"
            h="full"
          />
        ) : (
          <Box
            w="full"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.400">No Image</Text>
          </Box>
        )}

        {product.stock === 0 && (
          <Badge position="absolute" top={2} right={2} colorScheme="red">
            Out of Stock
          </Badge>
        )}
      </Box>

      <VStack p={4} align="stretch" spacing={2}>
        <Text fontSize="sm" color="gray.500">
          {product.category.name}
        </Text>
        <Heading size="sm" noOfLines={2}>
          {product.name}
        </Heading>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {product.description}
        </Text>

        <HStack justify="space-between" pt={2}>
          <Text fontSize="xl" fontWeight="bold" color="primary.500">
            LKR {product.price.toFixed(2)}
          </Text>
          <Button
            size="sm"
            colorScheme="primary"
            leftIcon={<Icon as={FiShoppingCart} />}
            isDisabled={product.stock === 0}
          >
            Add
          </Button>
        </HStack>
      </VStack>
    </VStack>
  )
}

export default Shop
