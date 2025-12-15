import {
  OrderStatus,
  ServiceStatus,
  UserRole,
  UserStatus,
} from '@/generated/prisma'

export interface ApiUser {
  id: number
  email: string
  name: string
  phone?: string | null
  role: UserRole
  status: UserStatus
  profileImage?: string | null
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ApiOrder {
  id: number
  orderNumber: string
  customerId: number
  status: OrderStatus
  totalPrice: number
  notes?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ApiAddress {
  id: number
  userId: number
  label?: string | null
  line1: string
  line2?: string | null
  city: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date
}

export interface ApiServiceRequest {
  id: number
  requestNumber: string
  customerId: number
  type: string
  status: ServiceStatus
  priority: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UploadResponse {
  uploadUrl: string
  publicUrl: string
  expiresIn: number
}

export interface AuthResponse {
  user: ApiUser
  token?: string
}
