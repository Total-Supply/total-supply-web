'use client'

import { MotionBox } from '@/src/components/motion/box'
import { ChevronDown } from 'lucide-react'

import { useState } from 'react'

type FAQ = {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I track my order?',
    answer:
      'You can track your order by visiting the Orders page in your account dashboard. Click on the specific order to see detailed tracking information and estimated delivery date.',
    category: 'orders',
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway.',
    category: 'payments',
  },
  {
    id: '3',
    question: 'How long does delivery take?',
    answer:
      'Standard delivery typically takes 3-5 business days. Express delivery is available for 1-2 business days. Delivery times may vary based on your location and product availability.',
    category: 'shipping',
  },
  {
    id: '4',
    question: 'Can I change my delivery address?',
    answer:
      'Yes, you can change your delivery address before the order is shipped. Go to your order details and click "Edit Address". Once shipped, address changes are not possible.',
    category: 'shipping',
  },
  {
    id: '5',
    question: 'How do I reset my password?',
    answer:
      'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to reset your password. The link is valid for 24 hours.',
    category: 'account',
  },
  {
    id: '6',
    question: 'Is my personal data secure?',
    answer:
      'Yes, we use industry-standard encryption and security measures to protect your personal data. We comply with GDPR and never share your information with third parties without consent.',
    category: 'security',
  },
]

export function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium text-foreground">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openId === faq.id && (
              <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </MotionBox>
  )
}
