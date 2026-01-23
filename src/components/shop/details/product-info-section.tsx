'use client'

import { MotionBox } from '@/src/components/motion/box'
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Minus,
  Package,
  Plus,
  Share2,
  ShoppingCart,
  Tag,
} from 'lucide-react'

import { useState } from 'react'

import { Button } from '../../ui/button'
import { FoodItemDetail } from '../types'

type ProductInfoSectionProps = {
  item: FoodItemDetail
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  onShare: () => void
}

export function ProductInfoSection({
  item,
  quantity,
  onQuantityChange,
  onAddToCart,
  onShare,
}: ProductInfoSectionProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const isOutOfStock = item.stock === 0
  const maxQuantity = Math.min(item.stock, 100)

  const handleAddToCart = () => {
    onAddToCart()
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Category & Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        {item.category && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Tag className="h-3 w-3" />
            {item.category.name}
          </span>
        )}
        {item.categories?.map((cat) => (
          <span
            key={cat.id}
            className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{item.name}</h1>
        {item.description && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Price & Stock */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-primary tabular-nums">
            LKR {Number(item.price).toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">per unit</span>
        </div>

        {/* Stock Status */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            isOutOfStock
              ? 'bg-red-500/10 text-red-700 dark:text-red-400'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          {isOutOfStock ? (
            <>
              <AlertCircle className="h-4 w-4" />
              Out of Stock
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              {item.stock} units available
            </>
          )}
        </div>
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-3">
          <label className="text-sm font-semibold">Quantity</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border/60 bg-card">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="flex h-12 w-12 items-center justify-center rounded-l-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="flex h-12 w-16 items-center justify-center text-lg font-bold tabular-nums">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity}
                className="flex h-12 w-12 items-center justify-center rounded-r-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Total:{' '}
              <span className="font-bold text-primary">
                LKR {(Number(item.price) * quantity).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          colorPalette={isAdded ? 'green' : 'primary'}
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" size="lg" onClick={onShare}>
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-3">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-blue-600/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Quality Guaranteed</p>
              <p className="text-xs text-muted-foreground">
                Fresh ingredients delivered daily
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <Package className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">
                Order now for same-day delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
