'use client'

import { MotionBox } from '@/src/components/motion/box'
import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'

import { useState } from 'react'

import { ContactOptions } from './contact-options-enhanced'
import { FAQSection } from './faq-section-enhanced'
import { LiveChatWidget } from './live-chat-widget'
import { SupportCategories } from './support-categories-enhanced'
import { SupportHero } from './support-hero-enhanced'
import { SupportStats } from './support-stats'
import { TicketFormModal } from './ticket-form-modal'
import { TicketFormData } from './types'

export function SupportPageEnhanced() {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [ticketFormOpen, setTicketFormOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Smooth scroll to FAQ section
    const faqSection = document.getElementById('faq-section')
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleOpenChat = () => {
    setChatOpen(true)
    toast({
      title: 'Live chat opened 💬',
      description: 'An agent will be with you shortly',
      status: 'info',
      duration: 2000,
    })
  }

  const handleTicketSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to submit ticket')
      }

      toast({
        title: 'Ticket submitted successfully! ✅',
        description: `Ticket #${result.data.ticketNumber} - We'll respond within 24 hours`,
        status: 'success',
        duration: 4000,
      })
      setTicketFormOpen(false)
    } catch (error) {
      toast({
        title: 'Submission failed',
        description:
          error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container maxW="container.xl" className="relative px-4 py-12 md:py-16">
          <SupportHero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </Container>
      </div>

      {/* Main Content */}
      <Container maxW="container.xl" className="px-4 py-8 md:py-12">
        <div className="space-y-12">
          {/* Stats */}
          <SupportStats />

          {/* Categories */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Browse by Category
            </h2>
            <SupportCategories
              onCategoryClick={handleCategoryClick}
              selectedCategory={selectedCategory}
            />
          </MotionBox>

          {/* FAQ Section */}
          <div id="faq-section">
            <FAQSection
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Contact Options */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Get in Touch
            </h2>
            <ContactOptions
              onOpenChat={handleOpenChat}
              onOpenTicket={() => setTicketFormOpen(true)}
            />
          </MotionBox>
        </div>
      </Container>

      {/* Ticket Form Modal */}
      <TicketFormModal
        isOpen={ticketFormOpen}
        onClose={() => setTicketFormOpen(false)}
        onSubmit={handleTicketSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Live Chat Widget */}
      <LiveChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
