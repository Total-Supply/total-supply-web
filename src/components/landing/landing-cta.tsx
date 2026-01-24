'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserPlus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LandingCTAEnhanced() {
  const router = useRouter()

  const benefits = [
    'Free delivery on first order',
    'Access to exclusive deals',
    'Priority customer support',
    '24/7 order tracking',
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Main CTA Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
            {/* 
              LIGHT MODE: Light gradient (white to light gray) with dark text
              DARK MODE: Dark gradient (dark slate) with white text
            */}
            <div className="relative bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 sm:p-8 md:p-12 lg:p-16 border border-slate-200/60 dark:border-slate-700/60">
              {/* Decorative overlays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.25),transparent_50%)]" />

              <div className="relative space-y-6 sm:space-y-8 text-center">
                {/* Badge */}
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary dark:text-white ring-1 ring-primary/30 dark:ring-white/30 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Limited Time Offer</span>
                  </div>
                </MotionBox>

                {/* Heading */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white">
                    Ready to Get Started?
                  </h2>
                  <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-slate-700 dark:text-white/95 leading-relaxed font-medium px-4 sm:px-0">
                    Join thousands of satisfied customers and experience the
                    convenience of
                    <span className="font-bold text-primary dark:text-white">
                      {' '}
                      Total Supply
                    </span>
                  </p>
                </div>

                {/* Benefits Grid */}
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl bg-white dark:bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-3.5 text-left ring-1 ring-slate-200 dark:ring-white/20 shadow-md hover:shadow-lg dark:hover:bg-white/15 transition-all duration-200"
                      >
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 dark:text-emerald-300 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </MotionBox>

                {/* Action Buttons */}
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                    {/* Primary CTA */}
                    <Button
                      size="lg"
                      onClick={() => router.push('/signup')}
                      className="group w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-white dark:hover:bg-white/95 text-white dark:text-slate-900 shadow-2xl shadow-primary/30 dark:shadow-black/30 border-0 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-bold"
                    >
                      <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Sign Up Now
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </Button>

                    {/* Secondary CTA */}
                    <Button
                      size="lg"
                      onClick={() => router.push('/shop')}
                      className="w-full sm:w-auto border-2 border-primary/30 dark:border-white/50 text-primary dark:text-white bg-primary/5 dark:bg-white/15 hover:bg-primary/10 dark:hover:bg-white/25 backdrop-blur-sm shadow-lg px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-bold"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Browse Products
                    </Button>
                  </div>
                </MotionBox>

                {/* Social Proof Stats */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-10 pt-6 sm:pt-8 border-t border-slate-300 dark:border-white/30">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 dark:text-emerald-300" />
                        50K+
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-white/90 mt-1 sm:mt-1.5">
                        Active Users
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        4.8★
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-white/90 mt-1 sm:mt-1.5">
                        Average Rating
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        100K+
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-white/90 mt-1 sm:mt-1.5">
                        Orders Delivered
                      </p>
                    </div>
                  </div>
                </MotionBox>
              </div>
            </div>
          </div>
        </MotionBox>
      </div>
    </section>
  )
}
