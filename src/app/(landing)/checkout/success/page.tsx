import { CheckoutSuccess } from '@/src/components/checkout/success/checkout-success'
import { Suspense } from 'react'

export const metadata = {
  title: 'Order Confirmed | Total Supply',
  description: 'Your order has been placed successfully',
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div />}>
      <CheckoutSuccess />
    </Suspense>
  )
}
