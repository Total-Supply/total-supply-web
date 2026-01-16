import { ResetPasswordPage } from '@/src/components/auth/password/reset-password-page'
import { Suspense } from 'react'

export default function ResetPassword() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordPage />
    </Suspense>
  )
}
