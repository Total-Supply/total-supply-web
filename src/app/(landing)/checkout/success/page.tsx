import { CheckoutSuccess } from '@/src/components/checkout/checkout-success'
import { Suspense } from 'react'

export default function CheckoutSuccessRoute() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccess />
    </Suspense>
  )
}


