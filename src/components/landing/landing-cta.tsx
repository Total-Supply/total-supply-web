'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { ArrowRight, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LandingCTA() {
  const router = useRouter()

  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 text-center shadow-2xl sm:p-16">
            <div className="absolute inset-0 bg-grid-white/10" />

            <div className="relative space-y-6">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/90">
                Join thousands of satisfied customers today and experience the
                convenience of Total Supply
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  variant="solid"
                  onClick={() => router.push('/signup')}
                  className="bg-white text-primary hover:bg-white/90 shadow-xl"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
