import { ServiceRequestsPage } from '@/src/components/services/requests/service-requests-page'

import { Suspense } from 'react'

export default function ServiceRequestsRoute() {
  return (
    <Suspense fallback={null}>
      <ServiceRequestsPage />
    </Suspense>
  )
}
