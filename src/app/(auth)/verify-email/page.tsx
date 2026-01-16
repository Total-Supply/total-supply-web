import { VerifyEmailPage } from '@/src/components/auth/verify-email/verify-email-page'
import { Suspense } from 'react'

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div />}>
      <VerifyEmailPage />
    </Suspense>
  )
}
