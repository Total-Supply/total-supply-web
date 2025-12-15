'use client'

import { Features } from '@/src/components/features'
import { BackgroundGradient } from '@/src/components/gradients/background-gradient'
import { PageTransition } from '@/src/components/motion/page-transition'
import { Section } from '@/src/components/section'
import siteConfig from '@/src/data/config'
import { useAuth } from '@/src/hooks/useAuth'
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

const Signup: NextPage = () => {
  const router = useRouter()
  const toast = useToast()
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const result = await register(formData)

      // Check if user is admin (first user)
      const isAdmin = result.data?.role === 'ADMIN'

      toast({
        title: 'Account created',
        description: isAdmin
          ? 'Admin account created successfully. You can now log in!'
          : result.message ||
            'Your account is pending approval. You will be notified once approved.',
        status: 'success',
        duration: isAdmin ? 3000 : 7000,
        isClosable: true,
      })

      // Redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      // Handle validation errors
      if (error.code === 'VALIDATION_ERROR' && error.details) {
        const fieldErrors: Record<string, string> = {}
        error.details.forEach((err: any) => {
          const field = err.path?.[0] || err.field
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
      } else {
        // Handle other errors
        toast({
          title: 'Registration failed',
          description: error.message || 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  return (
    <Section height="100vh" innerWidth="container.xl">
      <BackgroundGradient
        zIndex="-1"
        width={{ base: 'full', lg: '50%' }}
        left="auto"
        right="0"
        borderLeftWidth="1px"
        borderColor="gray.200"
        _dark={{
          borderColor: 'gray.700',
        }}
      />
      <PageTransition height="100%" display="flex" alignItems="center">
        <Stack
          width="100%"
          alignItems={{ base: 'center', lg: 'flex-start' }}
          spacing="20"
          flexDirection={{ base: 'column', lg: 'row' }}
        >
          <Box pe="20">
            <NextLink href="/">
              <Box
                as={siteConfig.logo}
                width="160px"
                ms="4"
                mb={{ base: 0, lg: 16 }}
              />
            </NextLink>
            <Features
              display={{ base: 'none', lg: 'flex' }}
              columns={1}
              iconSize={4}
              flex="1"
              py="0"
              ps="0"
              maxW={{ base: '100%', xl: '80%' }}
              features={siteConfig.signup.features.map((feature) => ({
                iconPosition: 'left',
                variant: 'left-icon',
                ...feature,
              }))}
            />
          </Box>
          <Center height="100%" flex="1">
            <Box width="container.sm" pt="8" px="8">
              <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                <Text fontSize="2xl" fontWeight="bold">
                  {siteConfig.signup.title}
                </Text>

                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

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

                <FormControl isInvalid={!!errors.phone}>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94771234567"
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
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
                  Sign Up
                </Button>

                <Text fontSize="sm">
                  Already have an account?{' '}
                  <Link as={NextLink} href="/login" color="primary.500">
                    Log in
                  </Link>
                </Text>

                <Text color="muted" fontSize="sm">
                  By signing up you agree to our{' '}
                  <Link
                    href={siteConfig.termsUrl}
                    color="muted"
                    className="bold"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href={siteConfig.privacyUrl}
                    color="muted"
                    className="bold"
                  >
                    Privacy Policy
                  </Link>
                </Text>
              </VStack>
            </Box>
          </Center>
        </Stack>
      </PageTransition>
    </Section>
  )
}

export default Signup
