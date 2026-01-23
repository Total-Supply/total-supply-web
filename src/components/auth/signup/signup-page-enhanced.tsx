'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'
import { useAuth } from '@/src/hooks/useAuth'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'

import { useCallback, useEffect, useState } from 'react'

type SignupPageProps = {
  siteKey?: string
}

type FormData = {
  email: string
  password: string
  confirmPassword: string
  name: string
  termsAccepted: boolean
}

export function SignupPageEnhanced({ siteKey }: SignupPageProps) {
  const toast = useToast()
  const { register, isLoading } = useAuth()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // Password strength calculation (computed, not state)
  const passwordStrength = (() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&#]/.test(password)) strength++
    return strength
  })()

  // Password checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&#]/.test(formData.password),
  }

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
    if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
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
        title: 'Account created! 🎉',
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
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300'
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength === 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStrengthText = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength === 3) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-bold">Create Your Account</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/30">
                  <Shield className="h-3 w-3" />
                  SECURE
                </span>
              </div>
              <p className="text-muted-foreground">
                Join thousands of businesses using Total Supply
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      Check your inbox
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="pl-10"
                    disabled={!!successMessage}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="pl-10"
                    disabled={!!successMessage}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                    disabled={!!successMessage}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < passwordStrength
                              ? getStrengthColor()
                              : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    {getStrengthText() && (
                      <p className="text-xs text-muted-foreground">
                        Password strength:{' '}
                        <span className="font-semibold">
                          {getStrengthText()}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              {/* <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <p className="text-xs font-semibold">Password must contain:</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${
                        passwordChecks.length
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={
                        passwordChecks.length
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${
                        passwordChecks.uppercase && passwordChecks.lowercase
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={
                        passwordChecks.uppercase && passwordChecks.lowercase
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      Uppercase and lowercase letters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${
                        passwordChecks.number
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={
                        passwordChecks.number
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      At least one number
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${
                        passwordChecks.special
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={
                        passwordChecks.special
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      Special character (@$!%*?&#)
                    </span>
                  </li>
                </ul>
              </div> */}

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="pl-10 pr-10"
                    disabled={!!successMessage}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Acceptance */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        termsAccepted: Boolean(checked),
                      })
                    }
                    disabled={!!successMessage}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.termsAccepted}
                  </p>
                )}
              </div>

              {/* reCAPTCHA Notice */}
              {siteKey && (
                <p className="text-xs text-muted-foreground text-center">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <Link
                    href="https://policies.google.com/privacy"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="https://policies.google.com/terms"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{' '}
                  apply.
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !!successMessage}
                className="w-full group"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </MotionBox>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/5" />

        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 flex flex-col justify-center space-y-8 text-white"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-semibold ring-1 ring-white/30">
            <Sparkles className="h-4 w-4" />
            <span>Join 50,000+ businesses</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Start Your Journey
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow">
              Get access to fresh ingredients and quality food items delivered
              daily
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Free delivery on first order',
              'Access to exclusive deals',
              'Priority customer support',
              '24/7 order tracking',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/30">
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-white/80">Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.8★</p>
              <p className="text-sm text-white/80">Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold">100K+</p>
              <p className="text-sm text-white/80">Orders</p>
            </div>
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
