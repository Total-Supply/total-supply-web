import { OrderTrackingEnhanced } from '@/src/components/orders/customer/order-tracking-page'

export const metadata = {
  title: 'Track Order | Total Supply',
  description: 'View your order status and delivery details',
}

export default function OrderTracking() {
  return <OrderTrackingEnhanced />
}
