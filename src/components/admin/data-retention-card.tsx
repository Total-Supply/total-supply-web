'use client'

import { Button } from '@/src/components/ui/button'
import { Card, Flex, Stack, Text } from '@chakra-ui/react'

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
    <Card.Root borderRadius="xl" borderWidth="1px">
      <Card.Body>
        <Stack gap={2}>
          <Text fontSize="lg" fontWeight="semibold">
            Privacy & retention
          </Text>
          <Text fontSize="sm" color="muted">
            Runs daily via cron. Use this to trigger the job manually.
          </Text>
        </Stack>
        <Flex flexWrap="wrap" align="center" gap={3} mt={4}>
          <Button onClick={handleRun} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run retention job'}
          </Button>
          {message ? (
            <Text fontSize="sm" color="green.600">
              {message}
            </Text>
          ) : null}
          {error ? (
            <Text fontSize="sm" color="red.600">
              {error}
            </Text>
          ) : null}
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}
