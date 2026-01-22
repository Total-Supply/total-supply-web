import {
  ServiceCategory,
  ServicePhotoType,
  ServicePriority,
  ServiceStatus,
  ServiceType,
} from '@/generated/prisma'
import {
  assignServiceSchema,
  completeServiceSchema,
  createServiceRequestSchema,
  itCompleteSchema,
  itProgressSchema,
  progressServiceSchema,
  updateServiceRequestSchema,
} from '@/src/lib/validations/service.schema'
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
 * -----------------------------
 * Params
 * -----------------------------
 */
export const ServiceIdParams = z
  .object({
    id: z.string().describe('Service request ID'),
  })
  .describe('Path parameters for service routes')

/**
 * -----------------------------
 * Enums
 * -----------------------------
 */
export const ServiceTypeEnum = z.nativeEnum(ServiceType)
export const ServiceStatusEnum = z.nativeEnum(ServiceStatus)
export const ServicePriorityEnum = z.nativeEnum(ServicePriority)
export const ServiceCategoryEnum = z.nativeEnum(ServiceCategory)

/**
 * -----------------------------
 * Query (Admin List)
 * -----------------------------
 */
export const ListAdminServicesQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1).describe('Page number'),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe('Items per page (max 100)'),

    status: ServiceStatusEnum.optional().describe('Filter by status'),
    type: ServiceTypeEnum.optional().describe('Filter by type'),
    priority: ServicePriorityEnum.optional().describe('Filter by priority'),

    search: z
      .string()
      .optional()
      .describe('Search by title / description / requestNumber'),
  })
  .describe('Query parameters for listing service requests (Admin)')

export const PaginationMeta = z
  .object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  })
  .describe('Pagination metadata')

/**
 * -----------------------------
 * Bodies (match your validations exactly)
 * -----------------------------
 */
export const CreateServiceRequestBody = createServiceRequestSchema.describe(
  'Create service request body',
)

export const UpdateServiceRequestBody = updateServiceRequestSchema.describe(
  'Update service request body (Admin)',
)

/**
 * -----------------------------
 * Response Models
 * -----------------------------
 */
export const ServiceRequestResponse = z
  .object({
    id: z.number().int().positive(),
    requestNumber: z.string(),
    customerId: z.number().int().positive(),

    type: ServiceTypeEnum,
    category: ServiceCategoryEnum.nullable().optional(),

    serviceOfferingId: z.number().int().positive().nullable().optional(),

    status: ServiceStatusEnum,
    priority: ServicePriorityEnum,

    title: z.string(),
    description: z.string(),

    addressId: z.number().int().positive().nullable().optional(),

    requestedDate: z.string().datetime().nullable().optional(),
    notes: z.string().nullable().optional(),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .describe('Service request object')

/**
 * -----------------------------
 * Success Responses
 * -----------------------------
 */
export const ListServicesSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.array(ServiceRequestResponse),
    meta: PaginationMeta,
    message: z.string().optional(),
  })
  .describe('List service requests response')

export const CreateServiceSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceRequestResponse,
    message: z.string().optional(),
  })
  .describe('Service request created response')

export const UpdateServiceSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceRequestResponse,
    message: z.string().optional(),
  })
  .describe('Service request updated response')

export const DeleteServiceSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      id: z.number().int().positive(),
    }),
    message: z.string().optional(),
  })
  .describe('Service request deleted/canceled response')

/**
 * -----------------------------
 * Action Bodies (Admin)
 * -----------------------------
 */
export const AssignServiceBody = assignServiceSchema.describe(
  'Assign staff to a service request',
)

export const ProgressServiceBody = progressServiceSchema.describe(
  'Add progress update for a service request',
)

export const ItProgressBody = itProgressSchema.describe(
  'Add IT progress update for a service request',
)

export const CompleteServiceBody = completeServiceSchema.describe(
  'Complete a service request (Cleaning)',
)

export const ItCompleteBody = itCompleteSchema.describe(
  'Complete a service request (IT)',
)

/**
 * -----------------------------
 * Action Response (Admin detail)
 * -----------------------------
 */
export const ServicePhotoResponse = z.object({
  id: z.number().int().positive(),
  url: z.string(),
  type: z.nativeEnum(ServicePhotoType),
  createdAt: z.string().datetime(),
})

export const ServiceAssignmentResponse = z.object({
  id: z.number().int().positive(),
  staffId: z.number().int().positive(),
  assignedById: z.number().int().positive().nullable().optional(),
  assignedAt: z.string().datetime(),
  acceptedAt: z.string().datetime().nullable().optional(),
  startedAt: z.string().datetime().nullable().optional(),
  completedAt: z.string().datetime().nullable().optional(),
  status: z.nativeEnum(ServiceStatus),
  notes: z.string().nullable().optional(),
  timeSpentMinutes: z.number().int().nullable().optional(),
  completionNotes: z.string().nullable().optional(),
  solutionSummary: z.string().nullable().optional(),
  followUpRecommendations: z.string().nullable().optional(),
})

export const ServiceRequestAdminDetailResponse = z.object({
  id: z.number().int().positive(),
  requestNumber: z.string(),
  customerId: z.number().int().positive(),

  type: z.string(),
  category: z.string().nullable().optional(),

  serviceOfferingId: z.number().int().positive().nullable().optional(),

  status: z.nativeEnum(ServiceStatus),
  priority: z.string(),

  title: z.string(),
  description: z.string(),

  addressId: z.number().int().positive().nullable().optional(),
  requestedDate: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),

  photos: z.array(ServicePhotoResponse),
  assignments: z.array(ServiceAssignmentResponse),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ServiceActionSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceRequestAdminDetailResponse,
    message: z.string().optional(),
  })
  .describe('Service action success response (Admin detail view)')

/**
 * -----------------------------
 * Errors
 * -----------------------------
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
