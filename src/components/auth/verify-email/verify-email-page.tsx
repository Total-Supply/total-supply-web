'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Send,
  Shield,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

type VerifyState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'expired'
  | 'already-verified'

export function VerifyEmailPageEnhanced() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [state, setState] = useState<VerifyState>('idle')
  const [message, setMessage] = useState<string>('')
  const [resendEmail, setResendEmail] = useState<string>('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Missing verification token.')
      return
    }

    const verify = async () => {
      setState('loading')
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          const error = data.error
          if (error?.code === 'TOKEN_EXPIRED') {
            setState('expired')
            setResendEmail(error?.details?.email || '')
            setMessage(
              'Your verification link expired. Please request a new one.',
            )
            return
          }
          throw new Error(error?.message || 'Verification failed')
        }

        if (data?.data?.alreadyVerified) {
          setState('already-verified')
          setMessage('Email already verified. Redirecting to login...')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        setState('success')
        setMessage(
          data.message ||
            'Email verified successfully! Waiting for admin approval.',
        )
        setTimeout(() => router.push('/login?verified=true'), 3000)
      } catch (error: unknown) {
        setState('error')
        if (error instanceof Error) {
          setMessage(error.message || 'Verification failed')
        } else {
          setMessage('Verification failed')
        }
      }
    }

    verify()
  }, [token, router])

  const handleResend = async () => {
    if (!resendEmail) {
      setMessage('Please enter your email to resend verification.')
      return
    }

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unable to resend email')
      }

      setState('success')
      setMessage('Verification email sent! Please check your inbox.')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || 'Unable to resend email')
      } else {
        setMessage('Unable to resend email')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex">
      {/* Left Side - Status */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="space-y-8">
            {/* Icon & Status */}
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-fit">
                {state === 'loading' && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                )}
                <div
                  className={`relative inline-flex h-20 w-20 items-center justify-center rounded-full ring-2 ${
                    state === 'success' || state === 'already-verified'
                      ? 'bg-emerald-500/10 ring-emerald-500/30'
                      : state === 'error'
                        ? 'bg-red-500/10 ring-red-500/30'
                        : state === 'expired'
                          ? 'bg-amber-500/10 ring-amber-500/30'
                          : 'bg-primary/10 ring-primary/30'
                  }`}
                >
                  {state === 'loading' && (
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  )}
                  {(state === 'success' || state === 'already-verified') && (
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  )}
                  {state === 'error' && (
                    <XCircle className="h-10 w-10 text-red-500" />
                  )}
                  {state === 'expired' && (
                    <Clock className="h-10 w-10 text-amber-500" />
                  )}
                  {state === 'idle' && (
                    <Mail className="h-10 w-10 text-primary" />
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  {state === 'loading' && 'Verifying Email...'}
                  {state === 'success' && 'Email Verified!'}
                  {state === 'already-verified' && 'Already Verified'}
                  {state === 'error' && 'Verification Failed'}
                  {state === 'expired' && 'Link Expired'}
                  {state === 'idle' && 'Verify Your Email'}
                </h1>
                <p className="text-muted-foreground">
                  {state === 'loading' &&
                    'Please wait while we verify your email address'}
                  {state === 'success' &&
                    'Your email has been verified successfully'}
                  {state === 'already-verified' &&
                    'Your email was already verified'}
                  {state === 'error' &&
                    'We could not verify your email address'}
                  {state === 'expired' && 'Your verification link has expired'}
                  {state === 'idle' &&
                    'Check your inbox for the verification link'}
                </p>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border p-4 ${
                  state === 'success' || state === 'already-verified'
                    ? 'border-emerald-500/20 bg-emerald-500/10'
                    : state === 'error'
                      ? 'border-red-500/20 bg-red-500/10'
                      : state === 'expired'
                        ? 'border-amber-500/20 bg-amber-500/10'
                        : 'border-primary/20 bg-primary/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {(state === 'success' || state === 'already-verified') && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  )}
                  {state === 'error' && (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  {state === 'expired' && (
                    <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  {state === 'loading' && (
                    <Loader2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 animate-spin" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        state === 'success' || state === 'already-verified'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : state === 'error'
                            ? 'text-red-700 dark:text-red-400'
                            : state === 'expired'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-primary'
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Resend Section for Expired */}
            {state === 'expired' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Resend verification to:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full"
                  size="lg"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Error Actions */}
            {state === 'error' && !token && (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Need help?</p>
                    <p className="text-xs text-muted-foreground">
                      If you&#39;re having trouble verifying your email, please
                      contact support or try signing up again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {(state === 'success' || state === 'already-verified') && (
                <Link href="/login">
                  <Button className="w-full group" size="lg">
                    Continue to Login
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}

              {state !== 'loading' &&
                state !== 'success' &&
                state !== 'already-verified' && (
                  <>
                    <Link href="/login">
                      <Button className="w-full" size="lg">
                        Go to Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="outline" className="w-full" size="lg">
                        Need to register again?
                      </Button>
                    </Link>
                  </>
                )}
            </div>

            {/* Help Text */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                🔒 Verification links are valid for 24 hours
              </p>
            </div>
          </div>
        </MotionBox>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/5" />

        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 flex flex-col justify-center space-y-8 text-white"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-semibold ring-1 ring-white/30">
            <Shield className="h-4 w-4" />
            <span>Secure Email Verification</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Almost There!
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow">
              Verify your email to unlock full access to Total Supply
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Secure account protection',
              'Order tracking & notifications',
              'Priority customer support',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm p-6 space-y-4">
            <p className="text-sm font-semibold">Verification Process</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-sm">Account created</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
                <span className="text-sm">Email verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm">Admin approval pending</span>
              </div>
            </div>
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
