'use client'

import { showAddToCartToast } from '@/src/components/cart/cart-toast'
import { MotionBox } from '@/src/components/motion/box'
import { useToast } from '@/src/hooks/use-toast'
import { addToCart } from '@/src/store/slices/cartSlice'
import { Container } from '@chakra-ui/react'
import { Filter, Search, ShoppingCart, Sparkles, Store } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'

import { useEffect, useState } from 'react'

import { ShopEmptyState } from './shop-empty-state'
import { ShopFiltersPanel } from './shop-filters-panel'
import { ShopHeader } from './shop-header'
import { ShopLoadingSkeleton } from './shop-loading-skeleton'
import { ShopProductGrid } from './shop-product-grid'
import type { CategoryFilter, ShopItem } from './types'

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

const PAGE_SIZE = 24
const PRICE_RANGE_MIN = 0
const PRICE_RANGE_MAX = 10000
const RECENT_KEY = 'total-supply-recent-searches'

export function ShopPageEnhanced() {
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
  const [showFilters, setShowFilters] = useState(false)

  const hasFilters =
    selectedCategories.length > 0 ||
    minPrice !== PRICE_RANGE_MIN ||
    maxPrice !== PRICE_RANGE_MAX ||
    debouncedSearch.length > 0

  // Initialize from URL params
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

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  // Load recent searches
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

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 300)
    return () => clearTimeout(handler)
  }, [searchInput])

  // Update URL on search change
  useEffect(() => {
    if (debouncedSearch === searchFromUrl) return
    setPage(1)
    updateUrl(selectedCategories, minPrice, maxPrice, debouncedSearch)
  }, [debouncedSearch])

  // Save recent searches
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
      toast({
        title: 'Failed to load products',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
      })
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
    loadItems(
      page + 1,
      false,
      selectedCategories,
      minPrice,
      maxPrice,
      debouncedSearch,
    )
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
    router.replace(query ? `/shop?${query}` : '/shop', { scroll: false })
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
    updateUrl(
      selectedCategories,
      PRICE_RANGE_MIN,
      PRICE_RANGE_MAX,
      debouncedSearch,
    )
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
      description: `${item.name} added successfully`,
      onViewCart: () => router.push('/cart'),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container maxW="container.xl" className="relative px-4 py-12 md:py-16">
          <ShopHeader
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            recentSearches={recentSearches}
            onSelectRecent={handleSelectRecent}
            resultsCount={debouncedSearch ? totalItems : undefined}
            hasFilters={hasFilters}
            onClearAll={handleClearAll}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />
        </Container>
      </div>

      {/* Main Content */}
      <Container maxW="container.xl" className="px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <ShopFiltersPanel
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onClearFilters={handleClearFilters}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceRangeMin={PRICE_RANGE_MIN}
            priceRangeMax={PRICE_RANGE_MAX}
            onPriceChange={handlePriceChange}
            onResetPrice={handleResetPrice}
            isVisible={showFilters}
          />

          {/* Products Grid */}
          <div className="space-y-6">
            {isLoading ? (
              <ShopLoadingSkeleton count={24} />
            ) : items.length === 0 ? (
              <ShopEmptyState
                hasFilters={hasFilters}
                searchQuery={debouncedSearch}
                onClearFilters={handleClearAll}
              />
            ) : (
              <>
                <ShopProductGrid
                  items={items}
                  onItemClick={(slug: string) => router.push(`/shop/${slug}`)}
                  onAddToCart={handleAddToCart}
                  highlight={debouncedSearch}
                />

                {isLoadingMore && <ShopLoadingSkeleton count={12} />}

                {page < totalPages && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={handleShowMore}
                      disabled={isLoadingMore}
                      className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          Load More Products
                          <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
