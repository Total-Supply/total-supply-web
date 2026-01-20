'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { FileText, Mail, MessageCircle, Phone } from 'lucide-react'

type ContactOptionsProps = {
  onOpenChat: () => void
  onOpenTicket: () => void
}

export function ContactOptions({
  onOpenChat,
  onOpenTicket,
}: ContactOptionsProps) {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      color: 'from-blue-500/20 to-blue-600/10 ring-blue-500/30',
      textColor: 'text-blue-400',
      onClick: onOpenChat,
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: "Send us an email and we'll respond within 24 hours",
      action: 'Send Email',
      color: 'from-purple-500/20 to-purple-600/10 ring-purple-500/30',
      textColor: 'text-purple-400',
      onClick: () => (window.location.href = 'mailto:support@totalsupply.com'),
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us Monday to Friday, 9 AM - 6 PM',
      action: 'Call Now',
      color: 'from-emerald-500/20 to-emerald-600/10 ring-emerald-500/30',
      textColor: 'text-emerald-400',
      onClick: () => (window.location.href = 'tel:+94771234567'),
    },
    {
      icon: FileText,
      title: 'Submit Ticket',
      description: 'Create a support ticket for detailed assistance',
      action: 'Create Ticket',
      color: 'from-amber-500/20 to-amber-600/10 ring-amber-500/30',
      textColor: 'text-amber-400',
      onClick: onOpenTicket,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {contactMethods.map((method, index) => {
        const Icon = method.icon
        return (
          <MotionBox
            key={method.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${method.color}`}
            >
              <Icon className={`h-6 w-6 ${method.textColor}`} />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">
              {method.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {method.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={method.onClick}
            >
              {method.action}
            </Button>
          </MotionBox>
        )
      })}
    </div>
  )
}
