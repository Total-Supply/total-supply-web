import { OrdersPageEnhanced } from '@/src/components/orders/customer/orders-page'
import { Suspense } from 'react'

export const metadata = {
  title: 'My Orders | Total Supply',
  description: 'Track your orders and view order history',
}

export default function Orders() {
  return (
    <Suspense fallback={<div />}>
      <OrdersPageEnhanced />
    </Suspense>
  )
}
