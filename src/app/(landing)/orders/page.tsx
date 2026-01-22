import { OrdersPage } from '@/src/components/orders/orders-page'

import { Suspense } from 'react'

export default function OrdersRoute() {
  return (
    <Suspense fallback={null}>
      <OrdersPage />
    </Suspense>
  )
}
