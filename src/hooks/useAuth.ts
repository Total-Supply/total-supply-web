import { apiClient } from '@/src/lib/api/client'
import { LoginInput, RegisterInput } from '@/src/lib/validations/auth.schema'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

interface ApiError {
  message: string
  code: string
  details?: unknown
  status: number
}

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiClient.auth.register(data)
      return result
    } catch (err: unknown) {
      const apiError = err as ApiError
      setError(apiError.message)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw {
          message: result.error,
          code: 'AUTH_ERROR',
          status: 401,
        }
      }

      return result
    } catch (err: unknown) {
      const apiError = err as ApiError
      setError(apiError.message)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiClient.auth.signout()
      await signOut({ redirect: false })
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user: session?.user,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isLoading,
    error,
    register,
    login,
    logout,
  }
}
