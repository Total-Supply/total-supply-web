'use client'

import { PolicyPageTemplate } from '@/src/components/policies/policy-page-template'
import { Shield } from 'lucide-react'

export function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: (
        <>
          <p>
            We collect information you provide directly to us, including name,
            email address, phone number, delivery address, and payment
            information when you create an account or place an order.
          </p>
          <p>
            We also automatically collect certain information about your device
            and how you interact with our services, including IP address,
            browser type, and usage data.
          </p>
        </>
      ),
    },
    {
      title: 'How We Use Your Information',
      content: (
        <>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and our services</li>
            <li>Improve and personalize your experience</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Data Security',
      content: (
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>
      ),
    },
    {
      title: 'Your Rights',
      content: (
        <>
          <p>
            You have the right to access, correct, or delete your personal
            information. You may also object to or restrict certain processing
            of your data. Contact us at privacy@totalsupply.lk to exercise these
            rights.
          </p>
        </>
      ),
    },
  ]

  return (
    <PolicyPageTemplate
      icon={Shield}
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information"
      lastUpdated="January 24, 2026"
      sections={sections}
    />
  )
}

export default PrivacyPage
