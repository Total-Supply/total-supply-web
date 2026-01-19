'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { showAddToCartToast } from '@/src/components/cart/cart-toast'
import { addToCart } from '@/src/store/slices/cartSlice'
import { Button, Container, HStack, Stack, Text } from '@chakra-ui/react'
import { useToast } from '@/src/hooks/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ShopGrid } from './shop-grid'
import { ShopSkeleton } from './shop-skeleton'
import { ShopItem } from './shop-card'
import { CategoryFilter, ShopFilters } from './shop-filters'
import { ShopPriceFilter } from './shop-price-filter'
import { ShopSearch } from './shop-search'

type ShopResponse = {
  data: {
    id: number
    name: string
    slug: string
    description?: string | null
    price: number | string
    stock: number
    mainImageUrl?: string | null
  }[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const PAGE_SIZE = 20
const PRICE_RANGE_MIN = 0
const PRICE_RANGE_MAX = 10000
const RECENT_KEY = 'total-supply-recent-searches'

export function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const toast = useToast()
  const selectedFromUrl = searchParams.get('categories') || ''
  const minFromUrl = searchParams.get('minPrice')
  const maxFromUrl = searchParams.get('maxPrice')
  const searchFromUrl = searchParams.get('search') || ''

  const [items, setItems] = useState<ShopItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [categories, setCategories] = useState<CategoryFilter[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState(PRICE_RANGE_MIN)
  const [maxPrice, setMaxPrice] = useState(PRICE_RANGE_MAX)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const hasFilters =
    selectedCategories.length > 0 ||
    minPrice !== PRICE_RANGE_MIN ||
    maxPrice !== PRICE_RANGE_MAX ||
    debouncedSearch.length > 0

  useEffect(() => {
    const nextCategories = selectedFromUrl
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean)
    const parsedMin = minFromUrl ? Number(minFromUrl) : PRICE_RANGE_MIN
    const parsedMax = maxFromUrl ? Number(maxFromUrl) : PRICE_RANGE_MAX
    const nextMin = Number.isFinite(parsedMin) ? parsedMin : PRICE_RANGE_MIN
    const nextMax = Number.isFinite(parsedMax) ? parsedMax : PRICE_RANGE_MAX

    setSelectedCategories(nextCategories)
    setMinPrice(nextMin)
    setMaxPrice(nextMax)
    setSearchInput(searchFromUrl)
    setDebouncedSearch(searchFromUrl)
    setPage(1)
    loadItems(1, true, nextCategories, nextMin, nextMax, searchFromUrl)
  }, [selectedFromUrl, minFromUrl, maxFromUrl, searchFromUrl])

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed)
      }
    } catch {
      setRecentSearches([])
    }
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 300)
    return () => clearTimeout(handler)
  }, [searchInput])

  useEffect(() => {
    if (debouncedSearch === searchFromUrl) return
    setPage(1)
    updateUrl(selectedCategories, minPrice, maxPrice, debouncedSearch)
  }, [debouncedSearch])

  useEffect(() => {
    if (!debouncedSearch) return
    const updated = [
      debouncedSearch,
      ...recentSearches.filter((item) => item !== debouncedSearch),
    ].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }, [debouncedSearch])

  const loadItems = async (
    pageNumber: number,
    replace = false,
    categorySlugs: string[] = [],
    minValue = PRICE_RANGE_MIN,
    maxValue = PRICE_RANGE_MAX,
    searchValue = '',
  ) => {
    if (pageNumber === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const params = new URLSearchParams({
        page: String(pageNumber),
        limit: String(PAGE_SIZE),
      })
      if (categorySlugs.length) {
        params.set('categories', categorySlugs.join(','))
      }
      if (minValue !== PRICE_RANGE_MIN) {
        params.set('minPrice', String(minValue))
      }
      if (maxValue !== PRICE_RANGE_MAX) {
        params.set('maxPrice', String(maxValue))
      }
      if (searchValue) {
        params.set('search', searchValue)
      }

      const response = await fetch(`/api/food-items?${params.toString()}`)
      const data = (await response.json()) as ShopResponse
      const mappedItems = data.data.map((item) => ({
        ...item,
        price: Number(item.price),
      }))
      setItems((prev) => (replace ? mappedItems : [...prev, ...mappedItems]))
      setPage(data.meta?.page || pageNumber)
      setTotalPages(data.meta?.totalPages || 1)
      setTotalItems(data.meta?.total || mappedItems.length)
    } catch (error) {
      console.error('Failed to load food items', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/food-categories')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load categories')
      }
      setCategories(data.data || [])
    } catch (error) {
      console.error('Failed to load categories', error)
    }
  }

  const handleShowMore = () => {
    if (page >= totalPages || isLoadingMore) return
    loadItems(page + 1, false, selectedCategories, minPrice, maxPrice, debouncedSearch)
  }

  const updateUrl = (
    nextSelected: string[],
    nextMin: number,
    nextMax: number,
    nextSearch: string,
  ) => {
    const params = new URLSearchParams()
    if (nextSelected.length) {
      params.set('categories', nextSelected.join(','))
    }
    if (nextMin !== PRICE_RANGE_MIN) {
      params.set('minPrice', String(nextMin))
    }
    if (nextMax !== PRICE_RANGE_MAX) {
      params.set('maxPrice', String(nextMax))
    }
    if (nextSearch) {
      params.set('search', nextSearch)
    }
    const query = params.toString()
    router.replace(query ? `/shop?${query}` : '/shop')
  }

  const handleToggleCategory = (slug: string) => {
    const nextSelected = selectedCategories.includes(slug)
      ? selectedCategories.filter((item) => item !== slug)
      : [...selectedCategories, slug]
    setSelectedCategories(nextSelected)
    setPage(1)
    updateUrl(nextSelected, minPrice, maxPrice, debouncedSearch)
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setPage(1)
    updateUrl([], PRICE_RANGE_MIN, PRICE_RANGE_MAX, debouncedSearch)
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    setMinPrice(PRICE_RANGE_MIN)
    setMaxPrice(PRICE_RANGE_MAX)
    setSearchInput('')
    setDebouncedSearch('')
    setPage(1)
    updateUrl([], PRICE_RANGE_MIN, PRICE_RANGE_MAX, '')
  }

  const handlePriceChange = (nextMin: number, nextMax: number) => {
    setMinPrice(nextMin)
    setMaxPrice(nextMax)
    setPage(1)
    updateUrl(selectedCategories, nextMin, nextMax, debouncedSearch)
  }

  const handleResetPrice = () => {
    setMinPrice(PRICE_RANGE_MIN)
    setMaxPrice(PRICE_RANGE_MAX)
    setPage(1)
    updateUrl(selectedCategories, PRICE_RANGE_MIN, PRICE_RANGE_MAX, debouncedSearch)
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  const handleClearSearch = () => {
    setSearchInput('')
  }

  const handleSelectRecent = (value: string) => {
    setSearchInput(value)
  }

  const handleAddToCart = (item: ShopItem) => {
    if (item.stock === 0) return
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: 1,
        image: item.mainImageUrl,
        stock: item.stock,
      }),
    )
    showAddToCartToast(toast, {
      title: 'Added to cart',
      description: `Added 1x ${item.name}`,
      onViewCart: () => router.push('/cart'),
    })
  }

  return (
    <Stack gap={10}>
      <BackgroundGradient height="320px" />

      <Container maxW="container.xl" pt={{ base: 10, md: 16 }} pb={14}>
        <Stack gap={3} textAlign={{ base: 'left', md: 'center' }}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              Browse the Total Supply catalog
            </Text>
          </MotionBox>
          <Text color="muted" fontSize={{ base: 'sm', md: 'md' }}>
            Fresh ingredients and quality food items, updated daily.
          </Text>
        </Stack>

        <Stack gap={8} mt={10}>
          <ShopSearch
            value={searchInput}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            resultsCount={debouncedSearch ? totalItems : undefined}
            recent={recentSearches}
            onSelectRecent={handleSelectRecent}
          />
          {hasFilters && (
            <HStack justify="flex-end">
              <Button size="sm" variant="ghost" onClick={handleClearAll}>
                Clear all filters
              </Button>
            </HStack>
          )}

          <Stack gap={8} direction={{ base: 'column', lg: 'row' }}>
            <Stack
              gap={6}
              minW={{ base: 'full', lg: '240px' }}
              maxW={{ base: 'full', lg: '260px' }}
            >
              <ShopFilters
                categories={categories}
                selected={selectedCategories}
                onToggle={handleToggleCategory}
                onClear={handleClearFilters}
              />
              <ShopPriceFilter
                minValue={minPrice}
                maxValue={maxPrice}
                rangeMin={PRICE_RANGE_MIN}
                rangeMax={PRICE_RANGE_MAX}
                onChange={handlePriceChange}
                onReset={handleResetPrice}
              />
            </Stack>

            <Stack gap={6} flex="1">
              {isLoading ? (
                <ShopSkeleton count={12} />
              ) : items.length === 0 ? (
                <Stack
                  gap={2}
                  align="center"
                  py={16}
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderStyle="dashed"
                >
                  <Text fontSize="lg" fontWeight="600">
                    No results found
                  </Text>
                  <Text color="muted" fontSize="sm">
                    Try adjusting your filters or searching a different keyword.
                  </Text>
                </Stack>
              ) : (
                <>
                  <ShopGrid
                    items={items}
                    onItemClick={(slug) => router.push(`/shop/${slug}`)}
                    highlight={debouncedSearch}
                    onAddToCart={handleAddToCart}
                  />
                  {isLoadingMore ? <ShopSkeleton count={6} /> : null}
                </>
              )}

              {items.length > 0 && page < totalPages && (
                <HStack justify="center">
                  <Button
                    onClick={handleShowMore}
                    loading={isLoadingMore}
                    size="lg"
                    variant="outline"
                  >
                    Show more
                  </Button>
                </HStack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  )
}




