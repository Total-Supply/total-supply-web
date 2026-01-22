'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { PageTransition } from '@/src/components/motion/page-transition'
import { Section } from '@/src/components/section'
import {
  Alert,
  Box,
  Center,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import { Button } from '../../ui/button'

type VerifyState = 'idle' | 'loading' | 'success' | 'error' | 'expired'

export function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [state, setState] = useState<VerifyState>('idle')
  const [message, setMessage] = useState<string>('')
  const [resendEmail, setResendEmail] = useState<string>('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Missing verification token.')
      return
    }

    const verify = async () => {
      setState('loading')
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          const error = data.error
          if (error?.code === 'TOKEN_EXPIRED') {
            setState('expired')
            setResendEmail(error?.details?.email || '')
            setMessage(
              'Your verification link expired. Please request a new one.',
            )
            return
          }
          throw new Error(error?.message || 'Verification failed')
        }

        if (data?.data?.alreadyVerified) {
          setState('success')
          setMessage('Email already verified. Redirecting to login...')
          setTimeout(() => router.push('/login'), 1200)
          return
        }

        setState('success')
        setMessage(
          data.message || 'Email verified. Waiting for admin approval.',
        )
      } catch (error: unknown) {
        setState('error')
        if (error instanceof Error) {
          setMessage(error.message || 'Verification failed')
        } else {
          setMessage('Verification failed')
        }
      }
    }

    verify()
  }, [token])

  const handleResend = async () => {
    if (!resendEmail) {
      setMessage('Please enter your email to resend verification.')
      return
    }

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unable to resend email')
      }

      setMessage('Verification email sent. Please check your inbox.')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || 'Unable to resend email')
      } else {
        setMessage('Unable to resend email')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />
      <Center height="100%" pt="20">
        <PageTransition style={{ width: '100%' }}>
          <VStack gap={6}>
            <Stack gap={2} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                Verify your email
              </Text>
              <Text color="muted" fontSize="sm">
                We are confirming your email address.
              </Text>
            </Stack>

            {state === 'loading' && (
              <Box textAlign="center">
                <Spinner size="lg" />
                <Text mt="4" fontSize="sm" color="muted">
                  Verifying your email address...
                </Text>
              </Box>
            )}

            {state === 'success' && (
              <Alert.Root status="success" borderRadius="md">
                <Alert.Indicator />
                <Text fontSize="sm">{message}</Text>
              </Alert.Root>
            )}

            {state === 'expired' && (
              <Alert.Root status="warning" borderRadius="md">
                <Alert.Indicator />
                <VStack align="start" gap={3}>
                  <Text fontSize="sm">{message}</Text>
                  <Box width="100%">
                    <Text fontSize="xs" color="muted" mb="2">
                      Resend verification to:
                    </Text>
                    <Input
                      value={resendEmail}
                      onChange={(event) => setResendEmail(event.target.value)}
                      placeholder="you@example.com"
                      size="sm"
                      bg="white"
                    />
                    <Button
                      mt="3"
                      size="sm"
                      colorPalette="primary"
                      onClick={handleResend}
                      loading={isResending}
                    >
                      Resend link
                    </Button>
                  </Box>
                </VStack>
              </Alert.Root>
            )}

            {state === 'error' && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                <Text fontSize="sm">{message}</Text>
              </Alert.Root>
            )}

            <NextLink href="/login" passHref>
              <Button as="a" colorPalette="primary" width="full">
                Go to login
              </Button>
            </NextLink>
            <Link
              as={NextLink}
              href="/signup"
              fontSize="sm"
              color="primary.500"
            >
              Need to register again?
            </Link>
          </VStack>
        </PageTransition>
      </Center>
    </Section>
  )
}
