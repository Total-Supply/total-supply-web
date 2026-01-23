'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  ArrowRight,
  Clock,
  Package,
  ShoppingCart,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LandingHero() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <BackgroundGradient height="100%" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Sri Lanka&apos;s Complete Supply Solution
              </div>
            </MotionBox>

            {/* Main Heading */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                Your Complete
                <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Supply Chain Solution
                </span>
              </h1>
            </MotionBox>

            {/* Description */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-10">
                Order fresh food, schedule professional cleaning services, and
                get expert IT support—all in one platform. Fast, reliable, and
                convenient.
              </p>
            </MotionBox>

            {/* CTA Buttons */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                colorPalette="primary"
                onClick={() => router.push('/shop')}
                className="group"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/services')}
              >
                View Services
              </Button>
            </MotionBox>

            {/* Feature Pills */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6"
            >
              {[
                { icon: Package, label: 'Fresh Products' },
                { icon: Truck, label: 'Fast Delivery' },
                { icon: Clock, label: '24/7 Support' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{feature.label}</span>
                </div>
              ))}
            </MotionBox>
          </div>
        </div>
      </div>
    </div>
  )
}
