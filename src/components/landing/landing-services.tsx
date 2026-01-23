'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { ArrowRight, Package, Sparkles, Wrench } from 'lucide-react'
import { useRouter } from 'next/navigation'

const services = [
  {
    icon: Package,
    title: 'Food Supply',
    description:
      'Fresh ingredients and quality food items delivered to your doorstep within hours',
    features: ['Fresh produce', 'Quality guarantee', 'Same-day delivery'],
    color:
      'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    link: '/shop',
    buttonText: 'Browse Menu',
  },
  {
    icon: Sparkles,
    title: 'Cleaning Services',
    description:
      'Professional cleaning services for homes and offices with trained staff',
    features: ['Home cleaning', 'Office cleaning', 'Deep cleaning'],
    color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    link: '/services?type=CLEANING',
    buttonText: 'Book Cleaning',
  },
  {
    icon: Wrench,
    title: 'IT Support',
    description:
      'Expert technical support and IT solutions for your business needs',
    features: ['24/7 support', 'On-site service', 'Remote assistance'],
    color:
      'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    link: '/services?type=IT_SUPPORT',
    buttonText: 'Get Support',
  },
]

export function LandingServices() {
  const router = useRouter()

  return (
    <div className="bg-muted/20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions for all your business and personal needs
            </p>
          </MotionBox>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Icon */}
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${service.color}`}
                >
                  <service.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => router.push(service.link)}
                  colorPalette="primary"
                  className="w-full group/btn"
                >
                  {service.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </MotionBox>
          ))}
        </div>
      </div>
    </div>
  )
}
