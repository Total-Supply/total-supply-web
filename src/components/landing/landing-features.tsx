'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Award, Clock, Headphones, Shield, TrendingUp, Zap } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security',
    color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Same-day delivery available for urgent orders',
    color:
      'from-yellow-500/20 to-yellow-600/10 text-yellow-400 ring-yellow-500/30',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our team is always here to help you',
    color:
      'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'Competitive pricing on all products and services',
    color:
      'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
  },
  {
    icon: Clock,
    title: 'Real-time Tracking',
    description: 'Track your orders and services in real-time',
    color: 'from-pink-500/20 to-pink-600/10 text-pink-400 ring-pink-500/30',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'Premium quality products and professional services',
    color:
      'from-orange-500/20 to-orange-600/10 text-orange-400 ring-orange-500/30',
  },
]

export function LandingFeatures() {
  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-muted-foreground">
              We provide exceptional service with features that make your life
              easier
            </p>
          </MotionBox>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </MotionBox>
          ))}
        </div>
      </div>
    </div>
  )
}
