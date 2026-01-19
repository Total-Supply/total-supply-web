'use client'

import { Button } from '@/src/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function UnsubscribePage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('Preparing to unsubscribe...')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing unsubscribe token.')
      return
    }

    const run = async () => {
      setStatus('loading')
      try {
        const response = await fetch(`/api/unsubscribe?token=${token}`)
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Unable to unsubscribe')
        }
        setStatus('success')
        setMessage('You have been unsubscribed from marketing emails.')
      } catch (error) {
        setStatus('error')
        setMessage(
          error instanceof Error ? error.message : 'Unable to unsubscribe',
        )
      }
    }

    run()
  }, [searchParams])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Email Preferences</h1>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      {status === 'success' ? (
        <Button asChild>
          <a href="/login">Back to login</a>
        </Button>
      ) : null}
      {status === 'error' ? (
        <Button variant="outline" asChild>
          <a href="/profile">Go to profile</a>
        </Button>
      ) : null}
    </div>
  )
}


