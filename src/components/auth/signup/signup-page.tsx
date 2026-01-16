'use client'

import { AuthShell } from '@/src/components/auth/layout/auth-shell'
import { SignupForm } from '@/src/components/auth/signup/signup-form'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import Script from 'next/script'

export function SignupPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  return (
    <>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <BackgroundGradient zIndex="-1" />
      <AuthShell
        heroTitle="Exploring new frontiers, one step at a time."
        heroSubtitle="Create your account to start ordering and track service requests."
        heroTagline="Built for fast approvals and reliable service."
      >
        <SignupForm siteKey={siteKey} />
      </AuthShell>
    </>
  )
}
