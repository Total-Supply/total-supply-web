'use client'

import { SimpleGrid } from '@chakra-ui/react'
import { ShopCard, ShopItem } from './shop-card'

type ShopGridProps = {
  items: ShopItem[]
  onItemClick: (slug: string) => void
  highlight?: string
  onAddToCart?: (item: ShopItem) => void
}

export function ShopGrid({
  items,
  onItemClick,
  highlight,
  onAddToCart,
}: ShopGridProps) {
  return (
    <SimpleGrid columns={{ base: 2, md: 4, xl: 6 }} gap={{ base: 4, md: 6 }}>
      {items.map((item) => (
        <ShopCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.slug)}
          highlight={highlight}
          onAdd={onAddToCart}
        />
      ))}
    </SimpleGrid>
  )
}



