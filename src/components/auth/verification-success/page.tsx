'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

export default function VerificationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login?verified=true')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex items-center justify-center p-8">
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center space-y-8"
      >
        {/* Success Icon */}
        <div className="relative mx-auto w-fit">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
          <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 ring-2 ring-emerald-500/30">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Email Verified!</h1>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now log in to
            your account.
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Pending Admin Approval
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                Your account is waiting for admin approval. You&#39;ll receive an
                email once approved.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/login">
            <Button className="w-full group" size="lg">
              Continue to Login
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            Redirecting automatically in 5 seconds...
          </p>
        </div>
      </MotionBox>
    </div>
  )
}
