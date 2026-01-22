import { UnsubscribePage } from '@/src/components/marketing/unsubscribe-page'
import { Suspense } from 'react'

export default function Unsubscribe() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <UnsubscribePage />
    </Suspense>
  )
}


