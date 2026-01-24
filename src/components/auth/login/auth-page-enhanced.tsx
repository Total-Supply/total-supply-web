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
  Building,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

type AuthPageType = 'login' | 'signup'

type AuthPageProps = {
  type: AuthPageType
  title: string
  subtitle: string
  heroTitle: string
  heroSubtitle: string
  heroFeatures: string[]
}

type FormData = {
  email: string
  password: string
  rememberMe?: boolean
  // Signup specific
  name?: string
  phone?: string
  companyName?: string
  confirmPassword?: string
}

export function AuthPageEnhanced({
  type,
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  heroFeatures,
}: AuthPageProps) {
  const router = useRouter()
  const toast = useToast()
  const { login, isLoading } = useAuth()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
    ...(type === 'signup' && {
      name: '',
      phone: '',
      companyName: '',
      confirmPassword: '',
    }),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      if (type === 'login') {
        await login(formData)
        toast({
          title: 'Login successful! 🎉',
          description: 'Welcome back to Total Supply',
          status: 'success',
          duration: 3000,
        })
        router.push('/dashboard')
      } else {
        // TODO: Implement signup functionality or import it from the correct hook
        toast({
          title: 'Signup not implemented',
          description: 'Signup functionality is currently unavailable.',
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error: unknown) {
      let errorMessage =
        type === 'login' ? 'Invalid credentials' : 'Registration failed'
      let errorTitle = type === 'login' ? 'Login failed' : 'Signup failed'

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
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
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
            {/* Logo */}
            <div className="text-center space-y-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {type === 'signup' && (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="pl-10"
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

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 XX XXX XXXX"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Company Name (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="pl-10"
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
                <label className="text-sm font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
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
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {type === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot Password */}
              {type === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          rememberMe: Boolean(checked),
                        })
                      }
                    />
                    <span className="text-sm">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full group"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    {type === 'login' ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {type === 'login' ? (
                      <LogIn className="mr-2 h-5 w-5" />
                    ) : (
                      <UserPlus className="mr-2 h-5 w-5" />
                    )}
                    {type === 'login' ? 'Log In' : 'Create Account'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Toggle Link */}
              <p className="text-center text-sm text-muted-foreground">
                {type === 'login' ? (
                  <>
                    Don&#39;t have an account?{' '}
                    <Link
                      href="/signup"
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-semibold"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </p>
            </form>
          </div>
        </MotionBox>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/5" />

        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 flex flex-col justify-center space-y-8 text-white"
        >
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-semibold ring-1 ring-white/30">
            <Sparkles className="h-4 w-4" />
            <span>Trusted by 50,000+ businesses</span>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              {heroTitle}
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow">
              {heroSubtitle}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {heroFeatures.map((feature, index) => (
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
