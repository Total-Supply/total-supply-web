import { MotionBox } from '@/src/components/motion/box'
import {
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'

import { Button } from '../ui/button'

type ContactOptionsProps = {
  onOpenChat: () => void
  onOpenTicket: () => void
}

const contactMethods = [
  {
    id: 'chat',
    name: 'Live Chat',
    description: 'Chat with our support team in real-time',
    icon: MessageCircle,
    color: 'from-blue-500/20 to-blue-600/10 text-blue-500 ring-blue-500/30',
    availability: 'Available 24/7',
    responseTime: 'Instant response',
    action: 'chat',
  },
  {
    id: 'ticket',
    name: 'Submit Ticket',
    description: 'Create a support ticket for detailed issues',
    icon: FileText,
    color:
      'from-purple-500/20 to-purple-600/10 text-purple-500 ring-purple-500/30',
    availability: 'Available 24/7',
    responseTime: 'Within 24 hours',
    action: 'ticket',
  },
  {
    id: 'email',
    name: 'Email Support',
    description: "Send us an email and we'll get back to you",
    icon: Mail,
    color:
      'from-emerald-500/20 to-emerald-600/10 text-emerald-500 ring-emerald-500/30',
    availability: 'support@totalsupply.lk',
    responseTime: 'Within 48 hours',
    action: 'email',
  },
  {
    id: 'phone',
    name: 'Phone Support',
    description: 'Call us for immediate assistance',
    icon: Phone,
    color: 'from-amber-500/20 to-amber-600/10 text-amber-500 ring-amber-500/30',
    availability: '+94 11 000 0000',
    responseTime: 'Mon-Sat, 8AM-8PM',
    action: 'phone',
  },
]

export function ContactOptions({
  onOpenChat,
  onOpenTicket,
}: ContactOptionsProps) {
  const handleAction = (action: string) => {
    switch (action) {
      case 'chat':
        onOpenChat()
        break
      case 'ticket':
        onOpenTicket()
        break
      case 'email':
        window.open('mailto:support@totalsupply.lk', '_self')
        break
      case 'phone':
        window.open('tel:+94110000000', '_self')
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact Methods Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {contactMethods.map((method, index) => {
          const Icon = method.icon

          return (
            <MotionBox
              key={method.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${method.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {method.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {method.availability}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {method.responseTime}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    colorPalette="primary"
                    size="sm"
                    onClick={() => handleAction(method.action)}
                    className="w-full"
                  >
                    {method.action === 'chat' && 'Start Chat'}
                    {method.action === 'ticket' && 'Create Ticket'}
                    {method.action === 'email' && 'Send Email'}
                    {method.action === 'phone' && 'Call Now'}
                  </Button>
                </div>
              </div>
            </MotionBox>
          )
        })}
      </div>

      {/* Visit Us Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 ring-1 ring-pink-500/30">
            <MapPin className="h-6 w-6 text-pink-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Visit Our Office</h3>
            <p className="text-sm text-muted-foreground mb-3">
              123 Business Street, Colombo 00700, Sri Lanka
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Monday - Saturday: 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </MotionBox>
    </div>
  )
}
