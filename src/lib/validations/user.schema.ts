import { UserRole, UserStatus } from '@/generated/prisma'
import { z } from 'zod'

export const userRoleSchema = z.nativeEnum(UserRole)
export const userStatusSchema = z.nativeEnum(UserStatus)

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: userRoleSchema.optional(),
})

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  profileImage: z.string().url().optional(),
  status: userStatusSchema.optional(),
  role: userRoleSchema.optional(),
})

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  sortBy: z.enum(['createdAt', 'name', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>
