'use client'

import { AuthShell } from '@/src/components/auth/layout/auth-shell'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { Checkbox } from '@/src/components/ui/checkbox'
import { useToast } from '@/src/hooks/use-toast'
import { useAuth } from '@/src/hooks/useAuth'
import {
  Button,
  Field,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Suspense, useEffect, useState } from 'react'

const LoginContent: NextPage = () => {
  const router = useRouter()
  const toast = useToast()
  const { login, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'expired') {
      toast({
        title: 'Session expired',
        description: 'Please log in again to continue.',
        status: 'warning',
        duration: 4000,
      })
      router.replace('/login')
    }
  }, [router, searchParams, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      await login(formData)
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      })
      router.push('/dashboard')
    } catch (error: unknown) {
      let errorMessage = 'Invalid credentials'
      let errorTitle = 'Login failed'

      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: string }).message === 'string'
      ) {
        const message = (error as { message: string }).message
        if (message.includes('pending approval')) {
          errorTitle = 'Account Pending Approval'
          errorMessage =
            'Your account is awaiting admin approval. Please check back later or contact support.'
        } else if (message.includes('not verified')) {
          errorTitle = 'Email Not Verified'
          errorMessage =
            'Please verify your email using the link we sent before logging in.'
        } else if (message.includes('suspended')) {
          errorTitle = 'Account Suspended'
          errorMessage =
            'Your account has been suspended. Please contact support.'
        } else if (message.includes('rejected')) {
          errorTitle = 'Account Rejected'
          errorMessage =
            'Your account registration was rejected. Please contact support.'
        } else {
          errorMessage = message
        }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  return (
    <>
      <BackgroundGradient zIndex="-1" />
      <AuthShell
        heroTitle="Welcome back to Total Supply."
        heroSubtitle="Log in to manage orders, service requests, and approvals."
        heroTagline="Secure access with 30-day sessions."
      >
        <VStack gap={6} as="form" onSubmit={handleSubmit} align="stretch">
          <Text textStyle="sectionTitle">Welcome Back</Text>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            <Field.ErrorText>{errors.email}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          <Button
            type="submit"
            colorPalette="primary"
            width="full"
            loading={isLoading}
          >
            Log In
          </Button>

          <HStack width="full" justify="space-between">
            <Checkbox
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  rememberMe: Boolean(checked),
                })
              }
            >
              Remember me
            </Checkbox>

            <Link
              as={NextLink}
              href="/forgot-password"
              fontSize="sm"
              color="primary.600"
            >
              Forgot password?
            </Link>
          </HStack>

          <Text fontSize="sm">
            Don&apos;t have an account?{' '}
            <Link as={NextLink} href="/signup" color="primary.600">
              Sign up
            </Link>
          </Text>
        </VStack>
      </AuthShell>
    </>
  )
}

const Login = () => (
  <Suspense>
    <LoginContent />
  </Suspense>
)

export default Login
