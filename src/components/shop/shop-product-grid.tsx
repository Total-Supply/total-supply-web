import { MotionBox } from '@/src/components/motion/box'

import { ShopProductCard } from './shop-product-card'
import type { ShopItem } from './types'

type ShopProductGridProps = {
  items: ShopItem[]
  onItemClick: (slug: string) => void
  onAddToCart: (item: ShopItem) => void
  highlight?: string
}

export function ShopProductGrid({
  items,
  onItemClick,
  onAddToCart,
  highlight,
}: ShopProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {items.map((item, index) => (
        <MotionBox
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
        >
          <ShopProductCard
            item={item}
            onClick={() => onItemClick(item.slug)}
            onAddToCart={() => onAddToCart(item)}
            highlight={highlight}
          />
        </MotionBox>
      ))}
    </div>
  )
}
