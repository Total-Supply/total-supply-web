'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  Mail,
  Package,
  Phone,
} from 'lucide-react'

type ServiceRequestSuccessProps = {
  requestId: string | null
  serviceType: 'CLEANING' | 'IT_SUPPORT'
  onNewRequest: () => void
  onViewRequest: () => void
}

export function ServiceRequestSuccess({
  requestId,
  serviceType,
  onNewRequest,
  onViewRequest,
}: ServiceRequestSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card/95 to-card/85 p-12 shadow-2xl text-center backdrop-blur-sm">
            {/* Success Icon */}
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
              </div>
            </MotionBox>

            {/* Success Message */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                Request Submitted!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your {serviceType === 'CLEANING' ? 'cleaning' : 'IT support'}{' '}
                service request has been received successfully.
              </p>
            </MotionBox>

            {/* Request ID */}
            {requestId && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 mb-8">
                  <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Request ID</p>
                    <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      #{requestId}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Info Cards */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 mx-auto mb-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm font-semibold">Request Received</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&#39;ve got your details
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 mx-auto mb-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="text-sm font-semibold">Under Review</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Team is checking
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 mx-auto mb-2">
                    <Phone className="h-5 w-5 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold">We&#39;ll Contact You</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Within 2 hours
                  </p>
                </div>
              </div>
            </MotionBox>

            {/* Action Buttons */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  colorPalette="primary"
                  onClick={onViewRequest}
                  className="group"
                >
                  <Package className="mr-2 h-5 w-5" />
                  View Request
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button size="lg" variant="outline" onClick={onNewRequest}>
                  <Home className="mr-2 h-5 w-5" />
                  New Request
                </Button>
              </div>
            </MotionBox>

            {/* Additional Info */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="mt-8 rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
                <p className="text-sm font-semibold">What Happens Next?</p>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>
                      Our team will review your request and photos (if provided)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>
                      We&#39;ll contact you to confirm availability and provide a
                      quote
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>
                      Once confirmed, we&#39;ll assign a specialist and schedule the
                      service
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <p className="text-xs text-muted-foreground">
                    Questions? Contact us at{' '}
                    <a
                      href="tel:0110000000"
                      className="text-primary hover:underline font-medium"
                    >
                      011 000 0000
                    </a>{' '}
                    or{' '}
                    <a
                      href="mailto:services@totalsupply.lk"
                      className="text-primary hover:underline font-medium"
                    >
                      services@totalsupply.lk
                    </a>
                  </p>
                </div>
              </div>
            </MotionBox>
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
