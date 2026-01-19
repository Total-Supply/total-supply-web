'use client'

import { showAddToCartToast } from '@/src/components/cart/cart-toast'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { useColorModeValue } from '@/src/hooks/color-mode'
import { useToast } from '@/src/hooks/use-toast'
import { addToCart } from '@/src/store/slices/cartSlice'
import {
  Badge,
  Box,
  Breadcrumb,
  Container,
  HStack,
  IconButton,
  Image,
  Input,
  Skeleton,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '../ui/button'

type FoodImage = {
  id: number
  url: string
}

type FoodItemDetail = {
  id: number
  name: string
  slug: string
  description: string | null
  ingredients: string | null
  nutritionInfo: string | null
  price: number | string
  stock: number
  mainImageUrl?: string | null
  images?: FoodImage[]
  categories?: {
    id: number
    name: string
    slug: string
  }[]
  category?: {
    id: number
    name: string
    slug: string
  }
}

type RelatedItem = {
  id: number
  name: string
  slug: string
  price: number | string
  stock: number
  mainImageUrl?: string | null
}

export function ShopDetailPage() {
  const router = useRouter()
  const toast = useToast()
  const dispatch = useDispatch()
  const params = useParams()
  const slug = params?.slug as string | undefined
  const [item, setItem] = useState<FoodItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [related, setRelated] = useState<RelatedItem[]>([])
  const [isAdded, setIsAdded] = useState(false)

  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.900')
  const cardBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')

  const gallery = useMemo(() => {
    if (!item) return []
    const images = item.images?.map((img) => img.url) || []
    const main = item.mainImageUrl ? [item.mainImageUrl] : []
    return Array.from(new Set([...main, ...images]))
  }, [item])
  const activeImage = gallery[activeIndex] || null

  useEffect(() => {
    if (activeIndex >= gallery.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, gallery.length])

  useEffect(() => {
    if (!slug) return

    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/food-items/${slug}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Item not found')
        }
        const nextItem = {
          ...data.data,
          price: Number(data.data.price),
        } as FoodItemDetail
        setItem(nextItem)
        setQuantity(1)
        setActiveIndex(0)
      } catch (error) {
        console.error('Failed to load item', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [slug])

  useEffect(() => {
    if (!item?.category?.id) return
    const loadRelated = async () => {
      try {
        const response = await fetch(
          `/api/food-items?categoryId=${item.category?.id}&limit=6`,
        )
        const data = await response.json()
        if (!response.ok) return
        const items = (data.data || [])
          .filter((entry: RelatedItem) => entry.slug !== item.slug)
          .map((entry: RelatedItem) => ({
            ...entry,
            price: Number(entry.price),
          }))
        setRelated(items)
      } catch (error) {
        console.error('Failed to load related items', error)
      }
    }

    loadRelated()
  }, [item?.category?.id, item?.slug])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copied',
        description: 'Share this item with your team.',
        status: 'success',
        duration: 2500,
      })
    } catch (error) {
      toast({
        title: 'Unable to copy link',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const handleAddToCart = () => {
    if (!item || item.stock === 0) return
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: Number(item.price),
        quantity,
        image: item.mainImageUrl,
        stock: item.stock,
      }),
    )
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1200)
    showAddToCartToast(toast, {
      title: 'Added to cart',
      description: `Added ${quantity}x ${item.name}`,
      onViewCart: () => router.push('/cart'),
    })
  }

  return (
    <Stack gap={10}>
      <BackgroundGradient height="320px" />
      <Container maxW="container.xl" pt={{ base: 10, md: 16 }} pb={20}>
        <Breadcrumb.Root fontSize="sm" color="muted">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link onClick={() => router.push('/')}>
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link
                onClick={() =>
                  router.push(`/shop?categories=${item?.category?.slug || ''}`)
                }
              >
                {item?.category?.name || 'Catalog'}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link aria-current="page">
                {item?.name || 'Item'}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <MotionBox
          mt={6}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="xl"
          >
            {isLoading ? (
              <Stack p={8} gap={6}>
                <Skeleton height="240px" borderRadius="2xl" />
                <Skeleton height="24px" />
                <Skeleton height="18px" />
                <Skeleton height="18px" />
              </Stack>
            ) : item ? (
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                gap={10}
                p={{ base: 6, md: 10 }}
              >
                <Stack flex="1" gap={4}>
                  <Box minH={{ base: '220px', md: '320px' }}>
                    {activeImage ? (
                      <Box position="relative" w="full" h="full">
                        <Image
                          src={activeImage}
                          alt={item.name}
                          objectFit="cover"
                          w="full"
                          h="full"
                          borderRadius="2xl"
                        />
                        {gallery.length > 1 && (
                          <HStack
                            position="absolute"
                            top="50%"
                            left="4"
                            right="4"
                            transform="translateY(-50%)"
                            justify="space-between"
                          >
                            <IconButton
                              aria-label="Previous image"
                              variant="solid"
                              size="sm"
                              onClick={() =>
                                setActiveIndex(
                                  (prev) =>
                                    (prev - 1 + gallery.length) %
                                    gallery.length,
                                )
                              }
                            >
                              <ChevronLeft size={16} />
                            </IconButton>
                            <IconButton
                              aria-label="Next image"
                              variant="solid"
                              size="sm"
                              onClick={() =>
                                setActiveIndex(
                                  (prev) => (prev + 1) % gallery.length,
                                )
                              }
                            >
                              <ChevronRight size={16} />
                            </IconButton>
                          </HStack>
                        )}
                      </Box>
                    ) : (
                      <Box
                        w="full"
                        h="full"
                        borderRadius="2xl"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.400"
                      >
                        No image
                      </Box>
                    )}
                  </Box>
                  {gallery.length > 1 && (
                    <HStack gap={3} flexWrap="wrap">
                      {gallery.map((url, index) => (
                        <Box
                          key={url}
                          borderWidth={activeIndex === index ? '2px' : '1px'}
                          borderColor={
                            activeIndex === index ? 'primary.500' : cardBorder
                          }
                          borderRadius="lg"
                          overflow="hidden"
                          cursor="pointer"
                          onClick={() => setActiveIndex(index)}
                        >
                          <Image
                            src={url}
                            alt={item.name}
                            boxSize="70px"
                            objectFit="cover"
                          />
                        </Box>
                      ))}
                    </HStack>
                  )}
                </Stack>

                <Stack flex="1" gap={4}>
                  <HStack gap={3}>
                    <Text fontSize="2xl" fontWeight="bold">
                      {item.name}
                    </Text>
                    {item.stock === 0 && (
                      <Badge colorPalette="red">Sold Out</Badge>
                    )}
                  </HStack>
                  <Text color="muted" fontSize="sm">
                    {item.category?.name || 'Food item'}
                  </Text>
                  {item.categories?.length ? (
                    <HStack gap={2} flexWrap="wrap">
                      {item.categories.map((category) => (
                        <Tag.Root
                          key={category.id}
                          size="sm"
                          borderRadius="full"
                        >
                          <Tag.Label>{category.name}</Tag.Label>
                        </Tag.Root>
                      ))}
                    </HStack>
                  ) : null}
                  <Text fontSize="xl" fontWeight="bold" color="primary.500">
                    LKR {Number(item.price).toFixed(2)}
                  </Text>
                  <Text color="gray.600">
                    {item.description || 'No description available.'}
                  </Text>

                  <HStack gap={3}>
                    <Tag.Root colorPalette={item.stock > 0 ? 'green' : 'red'}>
                      <Tag.Label>
                        {item.stock > 0 ? 'In stock' : 'Out of stock'}
                      </Tag.Label>
                    </Tag.Root>
                    <Text fontSize="sm" color="muted">
                      {item.stock} available
                    </Text>
                  </HStack>

                  <Stack gap={2}>
                    <Text fontSize="sm" fontWeight="600">
                      Quantity
                    </Text>
                    <HStack>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(
                            Math.min(
                              item.stock > 0 ? Math.min(100, item.stock) : 100,
                              Math.max(1, Number(event.target.value)),
                            ),
                          )
                        }
                        width="120px"
                      />
                      <Button
                        colorPalette="primary"
                        isDisabled={item.stock === 0}
                        onClick={handleAddToCart}
                      >
                        {isAdded ? 'Added' : 'Add to cart'}
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        Share this item
                      </Button>
                    </HStack>
                  </Stack>

                  {item.ingredients ? (
                    <Stack gap={2}>
                      <Text fontSize="sm" fontWeight="600">
                        Ingredients
                      </Text>
                      <Text fontSize="sm" color="muted">
                        {item.ingredients}
                      </Text>
                    </Stack>
                  ) : null}

                  {item.nutritionInfo ? (
                    <Stack gap={2}>
                      <Text fontSize="sm" fontWeight="600">
                        Nutritional info
                      </Text>
                      <Text fontSize="sm" color="muted">
                        {item.nutritionInfo}
                      </Text>
                    </Stack>
                  ) : null}
                </Stack>
              </Stack>
            ) : (
              <Stack p={8} gap={2} align="center">
                <Text fontWeight="600">Item not found</Text>
                <Text color="muted">Please return to the catalog.</Text>
              </Stack>
            )}
          </Box>
        </MotionBox>

        {related.length > 0 && (
          <Stack mt={10} gap={4}>
            <Text fontSize="lg" fontWeight="600">
              Related items
            </Text>
            <HStack gap={4} flexWrap="wrap">
              {related.map((relatedItem) => (
                <Box
                  key={relatedItem.id}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="xl"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => router.push(`/shop/${relatedItem.slug}`)}
                  minW={{ base: '140px', md: '180px' }}
                >
                  {relatedItem.mainImageUrl ? (
                    <Image
                      src={relatedItem.mainImageUrl}
                      alt={relatedItem.name}
                      h="120px"
                      w="full"
                      objectFit="cover"
                    />
                  ) : (
                    <Box
                      h="120px"
                      w="full"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.400"
                      fontSize="sm"
                    >
                      No image
                    </Box>
                  )}
                  <Stack gap={1} p={3}>
                    <Text fontSize="sm" fontWeight="600" truncate>
                      {relatedItem.name}
                    </Text>
                    <Text fontSize="xs" color="muted">
                      LKR {Number(relatedItem.price).toFixed(2)}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </HStack>
          </Stack>
        )}
      </Container>

      {item && (
        <Box
          position={{ base: 'fixed', md: 'static' }}
          bottom="0"
          left="0"
          right="0"
          bg={cardBg}
          borderTopWidth={{ base: '1px', md: '0' }}
          borderColor={cardBorder}
          px={{ base: 4, md: 0 }}
          py={{ base: 3, md: 0 }}
          display={{ base: 'block', md: 'none' }}
          boxShadow={{
            base: '0 -12px 30px rgba(15, 23, 42, 0.12)',
            md: 'none',
          }}
        >
          <HStack justify="space-between">
            <Text fontWeight="600">LKR {Number(item.price).toFixed(2)}</Text>
            <Button
              colorPalette="primary"
              isDisabled={item.stock === 0}
              onClick={handleAddToCart}
            >
              {isAdded ? 'Added' : 'Add to cart'}
            </Button>
          </HStack>
        </Box>
      )}
    </Stack>
  )
}
