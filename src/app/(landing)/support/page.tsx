'use client'

import { ContactOptions } from '@/src/components/support/contact-options'
import { FAQAccordion } from '@/src/components/support/faq-accordion'
import { SupportCategories } from '@/src/components/support/support-categories'
import { SupportHero } from '@/src/components/support/support-hero'
import {
  TicketForm,
  TicketFormData,
} from '@/src/components/support/ticket-form'
import { useToast } from '@/src/hooks/use-toast'
import { Container } from '@chakra-ui/react'

import { useState } from 'react'

export default function SupportPage() {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketFormOpen, setTicketFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId)
    // Navigate or filter content based on category
  }

  const handleOpenChat = () => {
    toast({
      title: 'Live chat opening...',
      description: 'Connecting you with a support agent.',
      status: 'info',
      duration: 2000,
    })
    // Implement chat widget
  }

  const handleTicketSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to submit ticket')

      toast({
        title: 'Ticket submitted successfully',
        description: "We'll get back to you within 24 hours.",
        status: 'success',
        duration: 3000,
      })
      setTicketFormOpen(false)
    } catch (error) {
      toast({
        title: 'Submission failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 2500,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <div className="space-y-12">
        <SupportHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div>
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <SupportCategories onCategoryClick={handleCategoryClick} />
        </div>

        <FAQAccordion />

        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <ContactOptions
            onOpenChat={handleOpenChat}
            onOpenTicket={() => setTicketFormOpen(true)}
          />
        </div>

        <TicketForm
          isOpen={ticketFormOpen}
          onClose={() => setTicketFormOpen(false)}
          onSubmit={handleTicketSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </Container>
  )
}
