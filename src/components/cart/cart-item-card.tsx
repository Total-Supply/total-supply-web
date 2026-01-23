'use client'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { NumberInput } from '@chakra-ui/react'
import { AlertTriangle, Minus, Package, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

type CartItem = {
  id: number
  name: string
  slug?: string
  price: number
  quantity: number
  image?: string | null
  stock?: number | null
}

type CartItemCardProps = {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const maxQuantity =
    item.stock && item.stock > 0 ? Math.min(100, item.stock) : 100
  const isOutOfStock =
    item.stock !== undefined && item.stock !== null && item.stock <= 0
  const isOverLimit =
    item.stock !== undefined &&
    item.stock !== null &&
    item.quantity > item.stock
  const hasStockWarning = isOutOfStock || isOverLimit

  const handleIncrement = () => {
    if (item.quantity < maxQuantity) {
      onQuantityChange(item.quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.quantity - 1)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex gap-5">
        {/* Product Image */}
        <Link
          href={item.slug ? `/shop/${item.slug}` : '#'}
          className="relative flex-shrink-0"
        >
          <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all group-hover:ring-2 group-hover:ring-primary">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            {hasStockWarning && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-400" />
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <Link
                href={item.slug ? `/shop/${item.slug}` : '#'}
                className="group/link"
              >
                <h3 className="text-lg font-semibold transition-colors group-hover/link:text-primary">
                  {item.name}
                </h3>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                colorPalette="red"
                className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                LKR {item.price.toFixed(2)} per unit
              </p>
              {item.stock !== undefined && item.stock !== null && (
                <Badge
                  variant="subtle"
                  className={
                    item.stock <= 5
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }
                >
                  {item.stock} in stock
                </Badge>
              )}
            </div>

            {/* Stock Warnings */}
            {isOutOfStock && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Out of stock - Remove this item to continue
                </p>
              </div>
            )}

            {isOverLimit && !isOutOfStock && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Only {item.stock} left - Adjust quantity to continue
                </p>
              </div>
            )}
          </div>

          {/* Quantity Controls & Price */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrement}
                disabled={item.quantity <= 1 || isOutOfStock}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-all hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="flex h-9 min-w-[4rem] items-center justify-center rounded-lg border border-border bg-background px-3">
                <span className="font-semibold tabular-nums">
                  {item.quantity}
                </span>
              </div>

              <button
                onClick={handleIncrement}
                disabled={item.quantity >= maxQuantity || isOutOfStock}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-all hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-xl font-bold tabular-nums">
                LKR {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
