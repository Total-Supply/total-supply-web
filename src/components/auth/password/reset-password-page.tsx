'use client'

import { AuthShell } from '@/src/components/auth/layout/auth-shell'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { Alert, Button, Field, Input, Link, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

export function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Missing reset token.')
    }
  }, [token])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!token) {
      setError('Missing reset token.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Reset failed')
      }

      setMessage(data.message || 'Password reset successfully.')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Reset failed')
      } else {
        setError('Reset failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <BackgroundGradient zIndex="-1" />
      <AuthShell
        heroTitle="Set a new password."
        heroSubtitle="Choose a strong password to secure your account."
        heroTagline="Use at least 8 characters with uppercase and a number."
      >
        <VStack gap={6} as="form" onSubmit={handleSubmit} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Choose a new password
          </Text>
          <Text color="muted" fontSize="sm">
            Your new password must include an uppercase letter and a number.
          </Text>

          {message && (
            <Alert.Root status="success" borderRadius="md">
              <Alert.Indicator />
              <Text fontSize="sm">{message}</Text>
            </Alert.Root>
          )}

          {error && (
            <Alert.Root status="error" borderRadius="md">
              <Alert.Indicator />
              <Text fontSize="sm">{error}</Text>
            </Alert.Root>
          )}

          <Field.Root invalid={!!error} required>
            <Field.Label>New password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
            />
          </Field.Root>

          <Field.Root invalid={!!error} required>
            <Field.Label>Confirm password</Field.Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
            />
            <Field.ErrorText>{error}</Field.ErrorText>
          </Field.Root>

          <Button
            type="submit"
            colorScheme="primary"
            width="full"
            loading={isLoading}
          >
            Reset password
          </Button>

          <Link
            as={NextLink}
            href="/forgot-password"
            color="primary.500"
            fontSize="sm"
          >
            Need a new reset link?
          </Link>
        </VStack>
      </AuthShell>
    </>
  )
}



