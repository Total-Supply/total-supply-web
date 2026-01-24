'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { addToCart } from '@/src/store/slices/cartSlice'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import { useEffect, useState } from 'react'

type FoodItem = {
  id: number
  name: string
  slug: string
  price: string | number
  stock: number
  mainImageUrl: string | null
  category:
    | {
        id: number
        name: string
        slug: string
      }
    | string
}

export function LandingFeaturedProducts() {
  const router = useRouter()
  const toast = useToast()
  const dispatch = useDispatch()
  const [products, setProducts] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/food-items?limit=8')
        const data = await response.json()
        if (response.ok) {
          setProducts(data.data || [])
        }
      } catch (error) {
        console.error('Failed to load products', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleAddToCart = (product: FoodItem) => {
    const price =
      typeof product.price === 'string'
        ? parseFloat(product.price)
        : product.price

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: price,
        quantity: 1,
        image: product.mainImageUrl,
        stock: product.stock,
      }),
    )
    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart`,
      status: 'success',
      duration: 2000,
    })
  }

  const getCategoryName = (category: FoodItem['category']): string => {
    if (typeof category === 'string') return category
    return category?.name || 'Uncategorized'
  }

  const formatPrice = (price: string | number): number => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice) ? 0 : numPrice
  }

  return (
    <div className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Check out our most popular and fresh items
            </p>
          </MotionBox>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 sm:h-96 animate-pulse rounded-xl bg-muted/50"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No featured products available
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {products.map((product, index) => {
                const price = formatPrice(product.price)
                const categoryName = getCategoryName(product.category)

                return (
                  <MotionBox
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="group relative h-full overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      {/* Image */}
                      <div
                        onClick={() => router.push(`/shop/${product.slug}`)}
                        className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
                      >
                        {product.mainImageUrl ? (
                          <img
                            src={product.mainImageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <Badge
                            variant="subtle"
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500/90 text-white text-xs"
                          >
                            Low Stock
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {categoryName}
                          </p>
                          <h3
                            onClick={() => router.push(`/shop/${product.slug}`)}
                            className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          >
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg sm:text-2xl font-bold text-primary">
                              LKR {price.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.stock} in stock
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          colorPalette="primary"
                          className="w-full"
                          size="sm"
                        >
                          <ShoppingCart className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            Add to Cart
                          </span>
                        </Button>
                      </div>
                    </div>
                  </MotionBox>
                )
              })}
            </div>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-10 sm:mt-12"
            >
              <Button
                size="lg"
                colorPalette="primary"
                onClick={() => router.push('/shop')}
                className="group"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </MotionBox>
          </>
        )}
      </div>
    </div>
  )
}
