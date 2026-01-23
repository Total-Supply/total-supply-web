'use client'

import { VerifyEmailPageEnhanced } from '@/src/components/auth/verify-email/verify-email-page'

import { Suspense } from 'react'

const VerifyEmailContent = () => {
  return <VerifyEmailPageEnhanced />
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
