import { MotionBox } from '@/src/components/motion/box'
import { Package, ShoppingCart, Sparkles } from 'lucide-react'

import { RelatedItem } from '../types'

type RelatedProductsSectionProps = {
  items: RelatedItem[]
  onItemClick: (slug: string) => void
  onAddToCart: (item: RelatedItem) => void
}

export function RelatedProductsSection({
  items,
  onItemClick,
  onAddToCart,
}: RelatedProductsSectionProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4 sm:space-y-6 mt-8 lg:mt-12"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">You May Also Like</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <MotionBox
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
          >
            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-sm">
              {/* Image */}
              <div
                onClick={() => onItemClick(item.slug)}
                className="relative aspect-square overflow-hidden bg-muted"
              >
                {item.mainImageUrl ? (
                  <img
                    src={item.mainImageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                  </div>
                )}

                {/* Quick Add */}
                {item.stock > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToCart(item)
                    }}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div
                onClick={() => onItemClick(item.slug)}
                className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2"
              >
                <p className="text-xs sm:text-sm font-semibold line-clamp-2 leading-tight">
                  {item.name}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-bold text-primary tabular-nums">
                    LKR {Number(item.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.stock > 0 ? 'In stock' : 'Out'}
                  </p>
                </div>
              </div>
            </div>
          </MotionBox>
        ))}
      </div>
    </MotionBox>
  )
}
