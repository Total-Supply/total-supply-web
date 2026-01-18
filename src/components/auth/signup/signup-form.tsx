'use client'

import siteConfig from '@/src/data/config'
import { useToast } from '@/src/hooks/use-toast'
import { useAuth } from '@/src/hooks/useAuth'
import {
  Alert,
  Badge,
  Box,
  Field,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'

import { useCallback, useState } from 'react'

import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'
import { Input } from '../../ui/input'

type SignupFormProps = {
  siteKey?: string
}

export function SignupForm({ siteKey }: SignupFormProps) {
  const toast = useToast()
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const getRecaptchaToken = useCallback(async () => {
    if (!siteKey || typeof window === 'undefined') {
      return undefined
    }

    type Grecaptcha = {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
    const grecaptcha = (window as unknown as { grecaptcha?: Grecaptcha })
      .grecaptcha
    if (!grecaptcha?.execute) {
      return undefined
    }

    await new Promise<void>((resolve) => grecaptcha.ready(() => resolve()))
    return grecaptcha.execute(siteKey, { action: 'signup' })
  }, [siteKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const nextErrors: Record<string, string> = {}
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.termsAccepted) {
      nextErrors.termsAccepted = 'You must accept the terms to continue'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      const recaptchaToken = await getRecaptchaToken()
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        termsAccepted: formData.termsAccepted,
        recaptchaToken,
      })

      setSuccessMessage(result.message)
      toast({
        title: 'Account created',
        description: result.message,
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'VALIDATION_ERROR' &&
        'details' in error &&
        Array.isArray((error as { details: unknown }).details)
      ) {
        interface FieldErrorDetail {
          path?: (string | number)[]
          field?: string
          message: string
        }
        const fieldErrors: Record<string, string> = {}
        ;(error as { details: FieldErrorDetail[] }).details.forEach(
          (err: FieldErrorDetail) => {
            const field = err.path?.[0] || err.field
            fieldErrors[field as string] = err.message
          },
        )
        setErrors(fieldErrors)
      } else {
        toast({
          title: 'Registration failed',
          description:
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message?: string }).message
              : 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  return (
    <VStack
      gap={{ base: 4, md: 6 }}
      as="form"
      onSubmit={handleSubmit}
      align="stretch"
    >
      <Stack gap={{ base: 2, md: 3 }}>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'flex-start', sm: 'center' }}
          justify="space-between"
          gap={{ base: 2, sm: 4 }}
        >
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
            {siteConfig.signup.title}
          </Text>
          <Badge
            colorScheme="primary"
            variant="subtle"
            textTransform="uppercase"
          >
            Secure
          </Badge>
        </Stack>
        <Text color="muted" fontSize="sm">
          Create your account to start ordering and track service requests.
        </Text>
      </Stack>

      {successMessage && (
        <Alert.Root status="success" borderRadius="md">
          <Alert.Indicator />
          <Box>
            <Text fontWeight="600">Check your inbox</Text>
            <Text fontSize="sm">{successMessage}</Text>
          </Box>
        </Alert.Root>
      )}

      <Field.Root invalid={!!errors.name} required>
        <Field.Label>Full Name</Field.Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          isDisabled={!!successMessage}
        />
        <Field.ErrorText>{errors.name}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.email} required>
        <Field.Label>Email</Field.Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          isDisabled={!!successMessage}
        />
        <Field.ErrorText>{errors.email}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.password} required>
        <Field.Label>Password</Field.Label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          isDisabled={!!successMessage}
        />
        <Field.ErrorText>{errors.password}</Field.ErrorText>
      </Field.Root>

      {/* <Box
        borderWidth="1px"
        borderColor={cardAccent}
        borderRadius="md"
        p={{ base: 2, md: 3 }}
      >
        <Text fontSize="sm" fontWeight="600" mb="2">
          Password requirements
        </Text>
        <List gap={1} fontSize={{ base: 'xs', md: 'sm' }}>
          <ListItem>
            <ListIcon
              as={passwordChecks.length ? CheckCircleIcon : WarningIcon}
              color={passwordChecks.length ? 'green.400' : 'orange.400'}
            />
            Minimum 8 characters
          </ListItem>
          <ListItem>
            <ListIcon
              as={passwordChecks.uppercase ? CheckCircleIcon : WarningIcon}
              color={passwordChecks.uppercase ? 'green.400' : 'orange.400'}
            />
            At least one uppercase letter
          </ListItem>
          <ListItem>
            <ListIcon
              as={passwordChecks.number ? CheckCircleIcon : WarningIcon}
              color={passwordChecks.number ? 'green.400' : 'orange.400'}
            />
            At least one number
          </ListItem>
        </List>
      </Box> */}

      <Field.Root invalid={!!errors.confirmPassword} required>
        <Field.Label>Confirm Password</Field.Label>
        <Input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          isDisabled={!!successMessage}
        />
        <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.termsAccepted} required>
        <Checkbox
          name="termsAccepted"
          isChecked={formData.termsAccepted}
          onChange={handleChange}
          isDisabled={!!successMessage}
        >
          I agree to the{' '}
          <Link as={NextLink} href={siteConfig.termsUrl} color="primary.500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link as={NextLink} href={siteConfig.privacyUrl} color="primary.500">
            Privacy Policy
          </Link>
          .
        </Checkbox>
        <Field.ErrorText>{errors.termsAccepted}</Field.ErrorText>
      </Field.Root>

      {siteKey && (
        <Text fontSize="xs" color="muted">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </Text>
      )}

      <Button
        type="submit"
        colorScheme="primary"
        width="full"
        loading={isLoading}
        isDisabled={!!successMessage}
      >
        Create Account
      </Button>

      <Text fontSize="sm">
        Already have an account?{' '}
        <Link as={NextLink} href="/login" color="primary.500">
          Log in
        </Link>
      </Text>
    </VStack>
  )
}
