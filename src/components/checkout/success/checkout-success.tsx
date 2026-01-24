'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Container } from '@chakra-ui/react'
import { ArrowRight, CheckCircle2, Home, Package } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

export function CheckoutSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (orderNumber) {
            router.push(`/orders/${orderNumber}`)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderNumber, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20">
      {/* Hero Section - Match Other Pages */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container
          maxW="container.xl"
          className="relative px-8 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12"
        >
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thank you for your order. We&apos;re preparing it for delivery.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container
        maxW="container.xl"
        className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card/95 to-card/85 p-8 sm:p-12 shadow-2xl text-center backdrop-blur-sm">
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

            {/* Order Number */}
            {orderNumber && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 mb-8">
                  <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">
                      Order Number
                    </p>
                    <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {orderNumber}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Info Cards */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 mx-auto mb-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm font-semibold">Order Placed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Successfully received
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20 mx-auto mb-2">
                    <Package className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-sm font-semibold">Processing</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preparing your items
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 mx-auto mb-2">
                    <Home className="h-5 w-5 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold">Delivery Soon</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Track your order
                  </p>
                </div>
              </div>
            </MotionBox>

            {/* Countdown */}
            {orderNumber && countdown > 0 && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground mb-6">
                  Redirecting to order tracking in {countdown} seconds...
                </p>
              </MotionBox>
            )}

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
                  onClick={() =>
                    orderNumber
                      ? router.push(`/orders/${orderNumber}`)
                      : router.push('/orders')
                  }
                  className="group"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Track Order
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/shop')}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Button>
              </div>
            </MotionBox>

            {/* Additional Info */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your registered email
                  address. You can track your order status in real-time from
                  your orders page.
                </p>
              </div>
            </MotionBox>
          </div>
        </MotionBox>
      </Container>
    </div>
  )
}
