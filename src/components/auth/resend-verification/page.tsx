'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react'
import Link from 'next/link'

import { useState } from 'react'

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error?.message || 'Failed to send verification email',
        )
      }

      setStatus('success')
      setMessage(data.message || 'Verification email sent successfully!')
    } catch (error: unknown) {
      setStatus('error')
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('Failed to send verification email')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex items-center justify-center p-8">
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Resend Verification</h1>
            <p className="text-muted-foreground">
              Enter your email to receive a new verification link
            </p>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Email Sent!
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                    {message}
                  </p>
                </div>
              </div>
            </MotionBox>
          )}

          {status === 'error' && (
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
                    {message}
                  </p>
                </div>
              </div>
            </MotionBox>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
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
                  Resend Verification Email
                </>
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="text-center space-y-2">
            <Link
              href="/login"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Login
            </Link>
            <Link
              href="/signup"
              className="block text-sm text-primary hover:underline"
            >
              Need to register again?
            </Link>
          </div>

          {/* Help */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground text-center">
              💡 Check your spam folder if you don&#39;t see the email
            </p>
          </div>
        </div>
      </MotionBox>
    </div>
  )
}
