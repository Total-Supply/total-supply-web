'use client'

import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { PageTransition } from '@/src/components/motion/page-transition'
import { Section } from '@/src/components/section'
import { useAuth } from '@/src/hooks/useAuth'
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
    } catch (error: any) {
      console.log('🚀 ~ handleSubmit ~ error:', error)

      // Handle specific error messages
      let errorMessage = 'Invalid credentials'
      let errorTitle = 'Login failed'

      if (error.message) {
        if (error.message.includes('pending approval')) {
          errorTitle = 'Account Pending Approval'
          errorMessage =
            'Your account is awaiting admin approval. Please check back later or contact support.'
        } else if (error.message.includes('suspended')) {
          errorTitle = 'Account Suspended'
          errorMessage =
            'Your account has been suspended. Please contact support.'
        } else if (error.message.includes('rejected')) {
          errorTitle = 'Account Rejected'
          errorMessage =
            'Your account registration was rejected. Please contact support.'
        } else {
          errorMessage = error.message
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
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />

      <Center height="100%" pt="20">
        <PageTransition width="100%">
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
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

            <Text fontSize="sm">
              Don&apos;t have an account?{' '}
              <Link as={NextLink} href="/signup" color="primary.500">
                Sign up
              </Link>
            </Text>
          </VStack>
        </PageTransition>
      </Center>
    </Section>
  )
}

export default Login
