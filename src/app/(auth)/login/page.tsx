'use client'

import { AuthPageEnhanced } from '@/src/components/auth/login/auth-page-enhanced'

import { Suspense } from 'react'

const LoginContent = () => {
  return (
    <AuthPageEnhanced
      type="login"
      title="Welcome Back"
      subtitle="Log in to manage your orders and service requests"
      heroTitle="Total Supply Platform"
      heroSubtitle="Secure access to your account with enterprise-grade protection"
      heroFeatures={[
        '30-day secure sessions',
        'Two-factor authentication',
        'Real-time order tracking',
      ]}
    />
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
