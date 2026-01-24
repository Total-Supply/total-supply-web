'use client'

import { MotionBox } from '@/src/components/motion/box'
import { ChevronDown, HelpCircle, Search } from 'lucide-react'

import { useMemo, useState } from 'react'

const faqs = [
  {
    id: 1,
    category: 'orders',
    question: 'How do I track my order?',
    answer:
      "You can track your order by logging into your account and visiting the Orders page. You'll see real-time updates on your order status, including estimated delivery time.",
  },
  {
    id: 2,
    category: 'orders',
    question: 'Can I modify my order after placing it?',
    answer:
      'Orders can be modified within 30 minutes of placement. After that, please contact our support team for assistance.',
  },
  {
    id: 3,
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept credit/debit cards (Visa, Mastercard, Amex), mobile wallets, and bank transfers.',
  },
  {
    id: 4,
    category: 'payments',
    question: 'Is my payment information secure?',
    answer:
      'Yes, we use industry-standard encryption and comply with PCI DSS standards to protect your payment information.',
  },
  {
    id: 5,
    category: 'delivery',
    question: 'What are your delivery hours?',
    answer:
      'We deliver Monday to Saturday, 8 AM to 8 PM. Sunday deliveries are available in select areas.',
  },
  {
    id: 6,
    category: 'delivery',
    question: 'Do you offer same-day delivery?',
    answer:
      'Yes, same-day delivery is available for orders placed before 2 PM in eligible areas.',
  },
  {
    id: 7,
    category: 'returns',
    question: 'What is your return policy?',
    answer:
      'Items can be returned within 7 days of delivery. Products must be unused and in original packaging.',
  },
  {
    id: 8,
    category: 'returns',
    question: 'How long do refunds take?',
    answer:
      'Refunds are processed within 5-7 business days after we receive your returned item.',
  },
  {
    id: 9,
    category: 'products',
    question: 'How do I know if a product is in stock?',
    answer:
      'Stock availability is shown on each product page. We update inventory in real-time.',
  },
  {
    id: 10,
    category: 'account',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox.',
  },
]

type FAQSectionProps = {
  searchQuery?: string
  selectedCategory?: string | null
}

export function FAQSection({
  searchQuery = '',
  selectedCategory = null,
}: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null)

  const filteredFAQs = useMemo(() => {
    let filtered = faqs

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Frequently Asked Questions
        </h2>
      </div>

      {filteredFAQs.length > 0 ? (
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openId === faq.id

            return (
              <MotionBox
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3 sm:p-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </MotionBox>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-8 sm:p-12 text-center">
          <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            No FAQs Found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? `No results for "${searchQuery}". Try different keywords.`
              : 'No FAQs available for this category.'}
          </p>
        </div>
      )}
    </MotionBox>
  )
}
