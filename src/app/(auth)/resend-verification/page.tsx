import ResendVerificationPage from '@/src/components/auth/resend-verification/page'

import { Suspense } from 'react'

export default function ResendVerification() {
  return (
    <Suspense fallback={<div />}>
      <ResendVerificationPage />
    </Suspense>
  )
}
