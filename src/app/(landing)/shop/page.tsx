import { ShopPageEnhanced } from '@/src/components/shop/shop-page'

import { Suspense } from 'react'

export default function Shop() {
  return (
    <Suspense fallback={null}>
      <ShopPageEnhanced />
    </Suspense>
  )
}
