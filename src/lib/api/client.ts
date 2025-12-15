import axios from 'axios'

import axiosInstance from '../axiosInstance'
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from '../validations/auth.schema'
import { UploadInput } from '../validations/upload.schema'

export const apiClient = {
  // Auth endpoints
  auth: {
    register: async (data: RegisterInput) => {
      const response = await axiosInstance.post('/auth/register', data)
      return response.data
    },

    login: async (data: LoginInput) => {
      const response = await axiosInstance.post('/auth/login', data)
      return response.data
    },

    getSession: async () => {
      const response = await axiosInstance.get('/auth/session')
      return response.data
    },

    getMe: async () => {
      const response = await axiosInstance.get('/auth/me')
      return response.data
    },

    updateProfile: async (data: UpdateProfileInput) => {
      const response = await axiosInstance.put('/auth/update-profile', data)
      return response.data
    },

    signout: async () => {
      const response = await axiosInstance.post('/auth/signout')
      return response.data
    },
  },

  // Upload endpoints
  upload: {
    getUploadUrl: async (data: UploadInput) => {
      const response = await axiosInstance.post('/upload', data)
      return response.data
    },

    uploadFile: async (uploadUrl: string, file: File) => {
      const response = await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      return response.data
    },
  },

  // Test endpoints
  test: {
    database: async () => {
      const response = await axiosInstance.get('/test-db')
      return response.data
    },
  },

  // Products endpoints
  products: {
    getAll: async (params?: {
      category?: string
      search?: string
      page?: number
      limit?: number
    }) => {
      const response = await axiosInstance.get('/products', { params })
      return response.data
    },

    getBySlug: async (slug: string) => {
      const response = await axiosInstance.get(`/products/${slug}`)
      return response.data
    },

    getFeatured: async () => {
      const response = await axiosInstance.get('/products/featured')
      return response.data
    },
  },

  // Categories endpoints
  categories: {
    getAll: async () => {
      const response = await axiosInstance.get('/categories')
      return response.data
    },
  },

  // Services endpoints
  services: {
    create: async (data: any) => {
      const response = await axiosInstance.post('/services', data)
      return response.data
    },

    getMyRequests: async () => {
      const response = await axiosInstance.get('/services/my-requests')
      return response.data
    },
  },
}

// Re-export axios instance for custom calls
export { axiosInstance }
