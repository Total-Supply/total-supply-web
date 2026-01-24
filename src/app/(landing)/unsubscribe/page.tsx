import { UnsubscribePageEnhanced } from '@/src/components/unsubscribe/unsubscribe-page-enhanced'
import { Suspense } from 'react'

export const metadata = {
  title: 'Unsubscribe | Total Supply',
  description: 'Manage your email preferences',
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div />}>
      <UnsubscribePageEnhanced />
    </Suspense>
  )
}
