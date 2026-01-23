'use client'

import { MotionBox } from '@/src/components/motion/box'
import { useToast } from '@/src/hooks/use-toast'
import { RootState } from '@/src/store'
import {
  clearCart,
  removeFromCart,
  syncCartItems,
  updateQuantity,
} from '@/src/store/slices/cartSlice'
import { AlertCircle, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useMemo, useState } from 'react'

import { CartHeader } from './cart-header'
import { CartItemCard } from './cart-item-card'
import { CartSummary } from './cart-summary'
import { EmptyCart } from './empty-cart'

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
  const [isClearing, setIsClearing] = useState(false)

  const idsKey = useMemo(() => items.map((item) => item.id).join(','), [items])

  // Real-time price sync
  useEffect(() => {
    if (!idsKey.length) return

    const syncPrices = async () => {
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
        console.error('Cart sync error:', error)
        toast({
          title: 'Unable to sync cart',
          description: 'Some prices may be outdated',
          status: 'warning',
          duration: 2500,
        })
      } finally {
        setIsSyncing(false)
      }
    }

    syncPrices()
  }, [dispatch, idsKey, toast])

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      dispatch(clearCart())
      setIsClearing(false)
      toast({
        title: 'Cart cleared',
        description: 'All items removed from cart',
        status: 'success',
        duration: 2000,
      })
    }, 300)
  }

  const handleRemoveItem = (id: number, name: string) => {
    dispatch(removeFromCart(id))
    toast({
      title: 'Item removed',
      description: `${name} removed from cart`,
      status: 'info',
      duration: 2000,
    })
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  const tax = 0
  const deliveryFee = total > 0 ? 250 : 0
  const grandTotal = total + tax + deliveryFee

  const hasOutOfStock = items.some(
    (item) =>
      item.stock !== undefined && item.stock !== null && item.stock <= 0,
  )

  const hasOverLimit = items.some(
    (item) =>
      item.stock !== undefined &&
      item.stock !== null &&
      item.quantity > item.stock,
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <CartHeader
          itemCount={items.length}
          totalItems={items.reduce((sum, item) => sum + item.quantity, 0)}
          onClearCart={handleClearCart}
          isClearing={isClearing}
          isSyncing={isSyncing}
        />

        {items.length === 0 ? (
          <EmptyCart onContinueShopping={() => router.push('/shop')} />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Items List */}
            <div className="space-y-4">
              {/* Stock Warnings */}
              {(hasOutOfStock || hasOverLimit) && (
                <MotionBox
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                        Stock Issues Detected
                      </p>
                      <p className="text-sm text-amber-700/90 dark:text-amber-300/90 mt-1">
                        {hasOutOfStock && 'Some items are out of stock. '}
                        {hasOverLimit &&
                          'Some quantities exceed available stock. '}
                        Please adjust your cart before checkout.
                      </p>
                    </div>
                  </div>
                </MotionBox>
              )}

              {/* Syncing Indicator */}
              {isSyncing && (
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Updating prices and availability...
                    </p>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              {items.map((item, index) => (
                <MotionBox
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CartItemCard
                    item={item}
                    onRemove={() => handleRemoveItem(item.id, item.name)}
                    onQuantityChange={(qty) =>
                      handleQuantityChange(item.id, qty)
                    }
                  />
                </MotionBox>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CartSummary
                subtotal={total}
                tax={tax}
                deliveryFee={deliveryFee}
                total={grandTotal}
                itemCount={items.length}
                totalQuantity={items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )}
                hasIssues={hasOutOfStock || hasOverLimit}
                onContinueShopping={() => router.push('/shop')}
                onCheckout={() => router.push('/checkout')}
              />
            </div>
          </div>
        )}

        {/* Mobile Sticky Checkout */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg px-4 py-3 shadow-2xl lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">LKR {grandTotal.toFixed(2)}</p>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                disabled={hasOutOfStock || hasOverLimit}
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="mr-2 inline h-4 w-4" />
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
