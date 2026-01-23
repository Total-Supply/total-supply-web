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
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background flex items-center justify-center p-4">
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-8 shadow-2xl text-center space-y-6">
          {/* Icon */}
          <div className="relative mx-auto w-fit">
            {status === 'loading' && (
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            )}
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-full mx-auto ${
                status === 'success'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30'
                  : status === 'error'
                    ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 ring-1 ring-red-500/30'
                    : 'bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30'
              }`}
            >
              {status === 'loading' && (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              )}
              {status === 'error' && (
                <AlertCircle className="h-10 w-10 text-red-500" />
              )}
              {status === 'idle' && <Mail className="h-10 w-10 text-primary" />}
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {status === 'success'
                ? 'Unsubscribed Successfully'
                : status === 'error'
                  ? 'Unsubscribe Failed'
                  : 'Email Preferences'}
            </h1>
            <p className="text-muted-foreground">{message}</p>
          </div>

          {/* Additional Info */}
          {status === 'success' && (
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <MailX className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium">What happens next?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You will no longer receive marketing emails from us. You may
                    still receive transactional emails related to your orders
                    and account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-muted-foreground">
                If you continue to experience issues, please contact our support
                team at{' '}
                <a
                  href="mailto:support@totalsupply.lk"
                  className="text-primary hover:underline font-medium"
                >
                  support@totalsupply.lk
                </a>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {status === 'success' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
                <Button
                  colorPalette="primary"
                  onClick={() => router.push('/profile')}
                  className="flex-1"
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
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button
                  colorPalette="primary"
                  onClick={() => router.push('/profile')}
                  className="flex-1"
                >
                  Profile Settings
                </Button>
              </>
            )}

            {status === 'loading' && (
              <div className="w-full rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                Processing your request...
              </div>
            )}
          </div>

          {/* Resubscribe Option */}
          {status === 'success' && (
            <div className="pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                Changed your mind?{' '}
                <button
                  onClick={() => router.push('/profile')}
                  className="text-primary hover:underline font-medium"
                >
                  Resubscribe to emails
                </button>
              </p>
            </div>
          )}
        </div>
      </MotionBox>
    </div>
  )
}
