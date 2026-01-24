'use client'

import { MotionBox } from '@/src/components/motion/box'
import { useToast } from '@/src/hooks/use-toast'
import { addToCart } from '@/src/store/slices/cartSlice'
import { Container } from '@chakra-ui/react'
import { ArrowLeft, Loader2, Minus, Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import { useEffect, useState } from 'react'

import { showAddToCartToast } from '../../cart/cart-toast'
import { Button } from '../../ui/button'
import { FoodItemDetail, RelatedItem } from '../types'
import { ProductBreadcrumb } from './product-breadcrumb'
import { ProductDetailsSection } from './product-details-section'
import { ProductImageGallery } from './product-image-gallery'
import { ProductInfoSection } from './product-info-section'
import { RelatedProductsSection } from './related-products-section'

export function ShopDetailPageEnhanced() {
  const router = useRouter()
  const dispatch = useDispatch()
  const toast = useToast()
  const params = useParams()
  const slug = params?.slug as string | undefined

  const [item, setItem] = useState<FoodItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [related, setRelated] = useState<RelatedItem[]>([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!slug) return

    const loadItem = async () => {
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
      } catch (error) {
        console.error('Failed to load item', error)
        toast({
          title: 'Failed to load product',
          description:
            error instanceof Error ? error.message : 'Please try again',
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadItem()
  }, [slug])

  useEffect(() => {
    if (!item?.category?.id) return

    const loadRelated = async () => {
      try {
        const response = await fetch(
          `/api/food-items?categoryId=${item.category?.id}&limit=8`,
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
    showAddToCartToast(toast, {
      title: 'Added to cart',
      description: `${quantity}x ${item.name}`,
      onViewCart: () => router.push('/cart'),
    })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copied! 📋',
        description: 'Share this product with others',
        status: 'success',
        duration: 2500,
      })
    } catch (error) {
      toast({
        title: 'Failed to copy link',
        status: 'error',
        duration: 2500,
      })
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (item && quantity < Math.min(item.stock, 100)) {
      setQuantity(quantity + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <Container maxW="container.xl" className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading product...</p>
          </div>
        </Container>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <Container maxW="container.xl" className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This product doesn&#39;t exist or has been removed.
            </p>
            <Button onClick={() => router.push('/shop')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  const isOutOfStock = item.stock === 0
  const maxQuantity = Math.min(item.stock, 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section - Minimal with Breadcrumb */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/shop')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>

          <ProductBreadcrumb item={item} />
        </Container>
      </div>

      {/* Main Content */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 mb-8 lg:mb-12">
          {/* Image Gallery */}
          <ProductImageGallery item={item} />

          {/* Product Info */}
          <ProductInfoSection
            item={item}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onShare={handleShare}
          />
        </div>

        {/* Product Details */}
        <ProductDetailsSection item={item} />

        {/* Related Products */}
        {related.length > 0 && (
          <RelatedProductsSection
            items={related}
            onItemClick={(slug) => router.push(`/shop/${slug}`)}
            onAddToCart={(relatedItem) => {
              dispatch(
                addToCart({
                  id: relatedItem.id,
                  name: relatedItem.name,
                  slug: relatedItem.slug,
                  price: Number(relatedItem.price),
                  quantity: 1,
                  image: relatedItem.mainImageUrl,
                  stock: relatedItem.stock,
                }),
              )
              showAddToCartToast(toast, {
                title: 'Added to cart',
                description: relatedItem.name,
                onViewCart: () => router.push('/cart'),
              })
            }}
          />
        )}

        {/* Mobile Bottom Spacing */}
        <div className="h-24 md:hidden" />
      </Container>

      {/* Mobile Sticky Footer - Enhanced */}
      {item && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border/60 shadow-2xl md:hidden">
          <div className="px-4 py-3">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Quantity
                </span>
                <div className="flex items-center rounded-full border border-border/60 bg-muted/30">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-l-full hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center text-sm font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= maxQuantity}
                    className="flex h-9 w-9 items-center justify-center rounded-r-full hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Price & Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Price</p>
                <p className="text-xl font-bold text-primary tabular-nums">
                  LKR {(Number(item.price) * quantity).toFixed(2)}
                </p>
              </div>
              <Button
                colorPalette="primary"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
