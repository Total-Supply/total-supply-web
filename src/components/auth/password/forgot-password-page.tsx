'use client'

import { AuthShell } from '@/src/components/auth/layout/auth-shell'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
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
    } catch (err: any) {
      setError(err.message || 'Request failed')
    } finally {
      setIsLoading(false)
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
        <VStack spacing={6} as="form" onSubmit={handleSubmit} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Reset your password
          </Text>
          <Text color="muted" fontSize="sm">
            Enter your email and we will send you a reset link.
          </Text>

          {message && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">{message}</Text>
            </Alert>
          )}

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          )}

          <FormControl isInvalid={!!error} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="primary"
            width="full"
            isLoading={isLoading}
          >
            Send reset link
          </Button>

          <Link as={NextLink} href="/login" color="primary.500" fontSize="sm">
            Back to login
          </Link>
        </VStack>
      </AuthShell>
    </>
  )
}
