'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react'

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-lg"
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl" />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-blue-500/30">
          <Shield className="h-6 w-6 text-blue-400" />
        </div>

        <div className="flex-1">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Privacy & Retention
            </p>
            <p className="text-sm text-muted-foreground">
              Runs daily via cron. Use this to trigger the job manually for data
              cleanup and anonymization.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              loading={isRunning}
              colorPalette="blue"
              variant="solid"
              size="sm"
            >
              {isRunning ? 'Running...' : 'Run Retention Job'}
            </Button>

            {message && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-emerald-400">{message}</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 ring-1 ring-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
