import VerificationSuccessPage from '@/src/components/auth/verification-success/page'

import { Suspense } from 'react'

export default function VerificationSuccess() {
  return (
    <Suspense fallback={<div />}>
      <VerificationSuccessPage />
    </Suspense>
  )
}
