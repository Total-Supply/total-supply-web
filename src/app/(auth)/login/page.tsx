'use client'

import { AuthShell } from '@/src/components/auth/layout/auth-shell'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { useAuth } from '@/src/hooks/useAuth'
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Login: NextPage = () => {
  const router = useRouter()
  const toast = useToast()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
        <VStack spacing={6} as="form" onSubmit={handleSubmit} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Welcome Back
          </Text>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="primary"
            width="full"
            isLoading={isLoading}
          >
            Log In
          </Button>

          <HStack width="full" justify="space-between">
            <Checkbox size="sm">Remember me</Checkbox>
            <Link
              as={NextLink}
              href="/forgot-password"
              fontSize="sm"
              color="primary.500"
            >
              Forgot password?
            </Link>
          </HStack>

          <Text fontSize="sm">
            Don&apos;t have an account?{' '}
            <Link as={NextLink} href="/signup" color="primary.500">
              Sign up
            </Link>
          </Text>
        </VStack>
      </AuthShell>
    </>
  )
}

export default Login
