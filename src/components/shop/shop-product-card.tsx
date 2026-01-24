'use client'

import { AlertCircle, CheckCircle2, Package, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

import { type MouseEvent, useEffect, useRef, useState } from 'react'

import type { ShopItem } from './types'

type ShopProductCardProps = {
  item: ShopItem
  onClick: () => void
  onAddToCart: () => void
  highlight?: string
}

function renderHighlighted(text: string, query?: string) {
  if (!query) return text

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'ig')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-gray-100 px-1 rounded"
        >
          {part}
        </mark>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function ShopProductCard({
  item,
  onClick,
  onAddToCart,
  highlight,
}: ShopProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isOutOfStock = item.stock === 0

  // Reset image error if product image changes
  useEffect(() => {
    queueMicrotask(() => setImageError(false))
  }, [item.mainImageUrl])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (isOutOfStock) return

    onAddToCart()
    setIsAdded(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col h-full rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {item.mainImageUrl && !imageError ? (
          <Image
            src={item.mainImageUrl}
            alt={item.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Sold Out
          </div>
        )}

        {/* Quick Add Button (Desktop) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
            isOutOfStock
              ? 'bg-muted cursor-not-allowed opacity-50'
              : isAdded
                ? 'bg-emerald-500 scale-110'
                : 'bg-primary opacity-0 group-hover:opacity-100 hover:scale-110'
          }`}
        >
          {isAdded ? (
            <CheckCircle2 className="h-5 w-5 text-white" />
          ) : (
            <ShoppingCart className="h-5 w-5 text-white" />
          )}
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 space-y-2">
        {/* Product Name */}
        <h3 className="text-sm font-semibold line-clamp-2 leading-tight">
          {renderHighlighted(item.name, highlight)}
        </h3>

        {/* Description (if available) */}
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {renderHighlighted(item.description, highlight)}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-2">
          <div>
            <p className="text-lg font-bold text-primary tabular-nums">
              LKR {item.price.toFixed(2)}
            </p>

            <p
              className={`text-xs ${
                isOutOfStock ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              {isOutOfStock ? (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Out of stock
                </span>
              ) : (
                `${item.stock} in stock`
              )}
            </p>
          </div>
        </div>

        {/* Mobile Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-3 w-full rounded-lg py-2 text-sm font-semibold transition-all duration-200 md:hidden ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Added!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </span>
          )}
        </button>
      </div>

      {/* Active Indicator */}
      {!isOutOfStock && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  )
}
