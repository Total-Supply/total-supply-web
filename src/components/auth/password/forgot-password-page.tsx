'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Send,
  Shield,
} from 'lucide-react'
import Link from 'next/link'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
      }

      setMessage(
        data.message || 'If an account exists, a reset link has been sent.',
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Reset Your Password</h1>
              <p className="text-muted-foreground">
                Enter your email and we&#39;ll send you a reset link
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      Email Sent
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                      {message}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Error Message */}
            {error && (
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Error
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full group"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Reset Link
                  </>
                )}
              </Button>

              {/* Back to Login */}
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </form>

            {/* Help Text */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Reset links expire in 60 minutes for security
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
            <span>Secure Password Reset</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Reset Access Quickly
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow">
              We&#39;ll send a secure reset link to your email address
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Secure email verification',
              'Link expires in 60 minutes',
              '24/7 support available',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
