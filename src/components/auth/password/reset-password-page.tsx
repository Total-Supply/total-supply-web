'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Shield,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token')
    }
  }, [token])

  useEffect(() => {
    // Calculate password strength
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&#]/.test(password)) strength++
    setPasswordStrength(strength)
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: formData.password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Reset failed')
      }

      router.push('/login?reset=success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setIsLoading(false)
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
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Set New Password</h1>
              <p className="text-muted-foreground">
                Choose a strong password for your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Error
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </MotionBox>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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

                {/* Password Strength */}
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
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="pl-10 pr-10"
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
              </div>

              {/* Password Requirements */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <p className="text-xs font-semibold">Password must contain:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${formData.password.length >= 8 ? 'text-emerald-500' : 'text-gray-400'}`}
                    />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}`}
                    />
                    Uppercase and lowercase letters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${/\d/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}`}
                    />
                    At least one number
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-3 w-3 ${/[@$!%*?&#]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-400'}`}
                    />
                    Special character (@$!%*?&#)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Reset Password
                  </>
                )}
              </Button>
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
            <Shield className="h-4 w-4" />
            <span>Enterprise-Grade Security</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Secure Your Account
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow">
              Create a strong password to protect your Total Supply account
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Password encryption at rest',
              'Secure hashing algorithm',
              'Regular security audits',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </MotionBox>
      </div>
    </div>
  )
}
