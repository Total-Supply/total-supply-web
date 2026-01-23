'use client'

import Script from 'next/script'

import { Suspense } from 'react'

import { SignupPageEnhanced } from './signup-page-enhanced'

const SignupContent = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  return (
    <>
      {siteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      )}
      <SignupPageEnhanced siteKey={siteKey} />
    </>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
