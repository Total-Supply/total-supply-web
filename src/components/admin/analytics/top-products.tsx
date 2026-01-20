'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Package, Trophy } from 'lucide-react'

type TopProductsProps = {
  products: Array<{
    id: number
    name: string
    price: number
    totalSold: number
    orderCount: number
  }>
  isLoading: boolean
}

export function TopProducts({ products, isLoading }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/30">
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Top Products</h3>
          <p className="text-sm text-muted-foreground">Best selling items</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-muted/50"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          No product data available
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4 transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(Number(product.price))} · {product.orderCount}{' '}
                  orders
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-400">
                  {product.totalSold}
                </p>
                <p className="text-xs text-muted-foreground">Units Sold</p>
              </div>
              {index < 3 && (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    index === 0
                      ? 'bg-amber-500/20 text-amber-400'
                      : index === 1
                        ? 'bg-slate-400/20 text-slate-400'
                        : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  <span className="text-sm font-bold">#{index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MotionBox>
  )
}
