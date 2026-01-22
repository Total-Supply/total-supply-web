'use client'

import { AuthShell } from '@/src/components/auth/layout/auth-shell'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import {
  Alert,
  Button,
  Link as ChakraLink,
  Field,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'

import * as React from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

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
      setLoading(false)
    }
  }

  return (
    <>
      <BackgroundGradient zIndex="-1" />

      <AuthShell
        heroTitle="Reset access quickly."
        heroSubtitle="We will send a secure reset link to your email."
        heroTagline="Links expire in 60 minutes."
      >
        <VStack gap={6} as="form" onSubmit={handleSubmit} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Reset your password
          </Text>

          <Text color="fg.muted" fontSize="sm">
            Enter your email and we will send you a reset link.
          </Text>

          {message && (
            <Alert.Root status="success" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description fontSize="sm">{message}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {error && (
            <Alert.Root status="error" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description fontSize="sm">{error}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <Field.Root required invalid={!!error}>
            <Field.Label>Email</Field.Label>

            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />

            {error && <Field.ErrorText>{error}</Field.ErrorText>}
          </Field.Root>

          <Button type="submit" width="full" loading={loading}>
            Send reset link
          </Button>

          <ChakraLink asChild color="blue.500" fontSize="sm">
            <NextLink href="/login">Back to login</NextLink>
          </ChakraLink>
        </VStack>
      </AuthShell>
    </>
  )
}
