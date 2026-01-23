import { UserRole, UserStatus } from '@/generated/prisma'
import {
  bulkApproveSchema,
  createUserSchema,
  getUsersQuerySchema,
  rejectUserSchema,
  updateUserSchema,
} from '@/src/lib/validations/user.schema'
import { z } from 'zod'

import {
  BadRequestResponse,
  ConflictResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from './common'

/**
 * Enums
 */
export const UserRoleEnum = z
  .nativeEnum(UserRole)
  .describe('User role (CUSTOMER, ADMIN, SALESMAN, DRIVER, CLEANER, IT_STAFF)')

export const UserStatusEnum = z
  .nativeEnum(UserStatus)
  .describe('User status (PENDING_APPROVAL, ACTIVE, SUSPENDED, REJECTED)')

/**
 * -----------------------------
 * Query / Params / Body
 * -----------------------------
 */
export const UserIdParams = z
  .object({
    id: z.string().describe('User ID'),
  })
  .describe('Path params containing the user id')

export const GetUsersQuery = getUsersQuerySchema.describe(
  'Admin user list query parameters (pagination, filters, sorting)',
)

export const UpdateAdminUserBody = updateUserSchema.describe(
  'Admin update user body (role/status/profile updates)',
)

export const RejectUserBody = rejectUserSchema.describe('Reject user body')

export const BulkApproveBody = bulkApproveSchema.describe('Bulk approve body')

/**
 * -----------------------------
 * Models
 * -----------------------------
 */
export const AdminUserListItem = z
  .object({
    id: z.number().int().positive(),
    email: z.string().email(),
    name: z.string(),
    phone: z.string().nullable().optional(),
    role: UserRoleEnum,
    status: UserStatusEnum,
    emailVerified: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .describe('Admin user list item')

export const AdminUserResponse = z
  .object({
    id: z.number().int().positive(),
    email: z.string().email(),
    name: z.string(),
    phone: z.string().nullable().optional(),
    profileImage: z.string().url().nullable().optional(),
    role: UserRoleEnum,
    status: UserStatusEnum,
    emailVerified: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .describe('Admin user detail response')

export const PaginationMeta = z
  .object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  })
  .describe('Pagination information')

/**
 * Body: POST /admin/users
 */
export const CreateAdminUserBody = createUserSchema.describe(
  'Create user body (admin)',
)

/**
 * Success response: POST /admin/users
 */
export const CreateAdminUserSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AdminUserResponse,
    message: z.string().optional(),
  })
  .describe('Admin create user success response')

/**
 * Success response: GET /admin/users/{id}
 */
export const GetAdminUserSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AdminUserResponse,
    message: z.string().optional(),
  })
  .describe('Admin get user by id success response')

/**
 * Success response: DELETE /admin/users/{id}
 */
export const DeleteAdminUserSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      id: z.number().int().positive().describe('Deleted user id'),
    }),
    message: z.string().optional(),
  })
  .describe('Admin delete user success response')

/**
 * -----------------------------
 * Success Responses
 * -----------------------------
 */
export const ListAdminUsersSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.array(AdminUserListItem),
    meta: PaginationMeta,
    message: z.string().optional(),
  })
  .describe('Admin users list success response')

export const UpdateAdminUserSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AdminUserResponse,
    message: z.string().optional(),
  })
  .describe('Admin user updated success response')

export const SuspendUserSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AdminUserResponse,
    message: z.string().optional(),
  })
  .describe('User suspended success response')

export const ReactivateUserSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AdminUserResponse,
    message: z.string().optional(),
  })
  .describe('User reactivated success response')

/**
 * Re-export common errors for generator
 */
export {
  BadRequestResponse,
  ConflictResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
}
