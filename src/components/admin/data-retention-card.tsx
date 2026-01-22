'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'

import { useState } from 'react'

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: {
    message: string
  }
}

export function DataRetentionCard() {
  const [isRunning, setIsRunning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRun = async () => {
    setIsRunning(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/admin/data-retention', {
        method: 'POST',
      })
      const payload = (await response.json()) as ApiResponse<{
        anonymizedCount: number
        purgedCount: number
      }>
      if (!response.ok) {
        throw new Error(payload.error?.message || 'Failed to run retention job')
      }
      setMessage(
        `Anonymized ${payload.data.anonymizedCount} users, purged ${payload.data.purgedCount} records.`,
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to run retention job',
      )
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-sm border border-border/70 bg-card/80 p-6 shadow-[0_30px_90px_-50px_rgba(6,7,24,0.85)]"
    >
      <div className="space-y-3">
        <p className="text-lg font-semibold text-foreground">
          Privacy & retention
        </p>
        <p className="text-sm text-muted-foreground">
          Runs daily via cron. Use this to trigger the job manually.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={handleRun} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run retention job'}
        </Button>
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </div>
    </MotionBox>
  )
}
