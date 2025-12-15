import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { getSession } from 'next-auth/react'

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip session check for auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/')

    if (!isAuthEndpoint) {
      try {
        // Get session token if available
        const session = await getSession()
        if (session?.user) {
          // Add any auth tokens if needed in future
          config.headers.set('X-User-ID', (session.user as any).id)
        }
      } catch (error) {
        // Silently fail if session is not available
        console.debug('No session available for request')
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      const data = error.response.data as any

      // Format error for consistent handling
      const formattedError = {
        message: data?.error?.message || data?.message || 'An error occurred',
        code: data?.error?.code || 'ERROR',
        details: data?.error?.details || null,
        status: error.response.status,
      }

      return Promise.reject(formattedError)
    }

    // Network error
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        details: null,
        status: 0,
      })
    }

    // Other errors
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: null,
      status: 0,
    })
  },
)

export default axiosInstance
