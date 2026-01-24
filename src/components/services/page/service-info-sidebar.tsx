'use client'

import { Box, HStack, Text } from '@chakra-ui/react'
import { Calendar, CheckCircle2, Clock, Phone, Sparkles } from 'lucide-react'

type ServiceInfoSidebarProps = {
  isVisible: boolean
}

export function ServiceInfoSidebar({ isVisible }: ServiceInfoSidebarProps) {
  return (
    <div className={`space-y-6 ${isVisible ? 'block' : 'hidden lg:block'}`}>
      {/* Hero Card */}
      <Box
        borderRadius="3xl"
        className="relative overflow-hidden border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.15),_transparent_40%),_linear-gradient(135deg,_rgba(14,116,144,0.85),_rgba(15,23,42,0.95))] transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
      >
        <Box className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <Box className="absolute top-4 right-4">
          <Sparkles className="h-8 w-8 text-white/40" />
        </Box>
        <Box className="relative p-6 space-y-3">
          <Text fontSize="xl" fontWeight="700" color="white">
            Cleaning & IT Support
            <br />
            On Demand
          </Text>
          <Text fontSize="sm" color="whiteAlpha.800" lineHeight="relaxed">
            Send photos, set priority, and get a confirmed time slot within
            hours.
          </Text>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Professionals
            </span>
          </div>
        </Box>
      </Box>

      {/* Process Card */}
      <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm space-y-5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <Text fontSize="lg" fontWeight="600">
            What happens next?
          </Text>
        </div>

        <Text color="muted" fontSize="sm" lineHeight="relaxed">
          Our team reviews your request, confirms availability, and assigns the
          right specialist for your needs.
        </Text>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 group">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 mt-0.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="flex-1">
              <Text fontSize="sm" fontWeight="500" mb={0.5}>
                Quick Response
              </Text>
              <Text fontSize="xs" color="muted">
                Team reply under 2 hours
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3 group">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 mt-0.5">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="flex-1">
              <Text fontSize="sm" fontWeight="500" mb={0.5}>
                Confirmed Booking
              </Text>
              <Text fontSize="xs" color="muted">
                Receive your time slot details
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-3 group">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 mt-0.5">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
            </div>
            <div className="flex-1">
              <Text fontSize="sm" fontWeight="500" mb={0.5}>
                Service Delivery
              </Text>
              <Text fontSize="xs" color="muted">
                Professional completes the job
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Card */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="h-4 w-4 text-primary" />
          <Text fontSize="sm" fontWeight="600">
            Need Immediate Help?
          </Text>
        </div>
        <Text fontSize="sm" color="muted" mb={3}>
          Our support team is available 24/7
        </Text>
        <a
          href="tel:0110000000"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30"
        >
          <Phone className="h-4 w-4" />
          011 000 0000
        </a>
      </div>
    </div>
  )
}
