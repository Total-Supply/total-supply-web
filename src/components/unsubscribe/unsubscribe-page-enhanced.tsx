'use client'

import { MotionBox } from '@/src/components/motion/box'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Home,
  Loader2,
  Mail,
  MailX,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import { Button } from '../ui/button'

type UnsubscribeStatus = 'idle' | 'loading' | 'success' | 'error'

export function UnsubscribePageEnhanced() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<UnsubscribeStatus>('idle')
  const [message, setMessage] = useState('Preparing to unsubscribe...')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage(
        'Missing unsubscribe token. Please use the link from your email.',
      )
      return
    }

    const unsubscribe = async () => {
      setStatus('loading')
      try {
        const response = await fetch(`/api/unsubscribe?token=${token}`)
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Unable to unsubscribe')
        }

        setStatus('success')
        setMessage(
          'You have been successfully unsubscribed from marketing emails.',
        )
      } catch (error) {
        setStatus('error')
        setMessage(
          error instanceof Error
            ? error.message
            : 'Unable to process your request. Please try again.',
        )
      }
    }

    unsubscribe()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background flex items-center justify-center p-4 sm:p-6">
      <MotionBox
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          {/* Icon */}
          <div className="relative mx-auto w-fit">
            {status === 'loading' && (
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            )}
            <div
              className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full mx-auto transition-all duration-300 ${
                status === 'success'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30'
                  : status === 'error'
                    ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30'
                    : 'bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30'
              }`}
            >
              {status === 'loading' && (
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500" />
              )}
              {status === 'error' && (
                <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
              )}
              {status === 'idle' && (
                <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              )}
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold">
              {status === 'success'
                ? 'Unsubscribed Successfully'
                : status === 'error'
                  ? 'Unsubscribe Failed'
                  : 'Email Preferences'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {message}
            </p>
          </div>

          {/* Additional Info - Success */}
          {status === 'success' && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-lg sm:rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2"
            >
              <div className="flex items-start gap-3 text-left">
                <MailX className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">What happens next?</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    You will no longer receive marketing emails from us. You may
                    still receive transactional emails related to your orders
                    and account.
                  </p>
                </div>
              </div>
            </MotionBox>
          )}

          {/* Additional Info - Error */}
          {status === 'error' && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-lg sm:rounded-xl border border-red-500/20 bg-red-500/5 p-4"
            >
              <p className="text-xs sm:text-sm text-muted-foreground text-left">
                If you continue to experience issues, please contact our support
                team at{' '}
                <a
                  href="mailto:support@totalsupply.lk"
                  className="text-primary hover:underline font-medium break-all"
                >
                  support@totalsupply.lk
                </a>
              </p>
            </MotionBox>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {status === 'success' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
                <Button
                  colorPalette="primary"
                  onClick={() => router.push('/profile')}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  Manage Preferences
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button
                  colorPalette="primary"
                  onClick={() => router.push('/profile')}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  Profile Settings
                </Button>
              </>
            )}

            {status === 'loading' && (
              <div className="w-full rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing your request...</span>
              </div>
            )}
          </div>

          {/* Resubscribe Option */}
          {status === 'success' && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="pt-4 border-t border-border/60"
            >
              <p className="text-xs sm:text-sm text-muted-foreground">
                Changed your mind?{' '}
                <button
                  onClick={() => router.push('/profile')}
                  className="text-primary hover:underline font-medium"
                >
                  Resubscribe to emails
                </button>
              </p>
            </MotionBox>
          )}
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          This is an automated page. No action is required from you.
        </p>
      </MotionBox>
    </div>
  )
}
