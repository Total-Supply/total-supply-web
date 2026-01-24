import {
  ServiceCategory,
  ServicePhotoType,
  ServicePriority,
  ServiceStatus,
  ServiceType,
} from '@/generated/prisma'
import {
  createServiceRequestSchema,
  rateServiceSchema,
} from '@/src/lib/validations/service.schema'
import {
  serviceOfferingCreateSchema,
  serviceOfferingUpdateSchema,
} from '@/src/lib/validations/service-offering.schema'
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
 * Query (Customer List)
 * -----------------------------
 */
export const ListCustomerServicesQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1).describe('Page number'),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe('Items per page (max 100)'),

    status: z.nativeEnum(ServiceStatus).optional().describe('Filter by status'),
    type: z
      .nativeEnum(ServiceType)
      .optional()
      .describe('Filter by service type'),
    priority: z
      .nativeEnum(ServicePriority)
      .optional()
      .describe('Filter by priority'),
  })
  .describe('Customer service list query parameters')

export const PaginationMeta = z
  .object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  .describe('Pagination metadata')

/**
 * -----------------------------
 * Bodies (from validations)
 * -----------------------------
 */
export const CreateCustomerServiceBody = createServiceRequestSchema.describe(
  'Create service request body (Customer)',
)

export const RateServiceBody = rateServiceSchema.describe(
  'Rate service body (Customer)',
)

/**
 * -----------------------------
 * Response Models
 * -----------------------------
 */
export const ServicePhotoResponse = z
  .object({
    id: z.number().int().positive(),
    url: z.string().url(),
    type: z.nativeEnum(ServicePhotoType),
    createdAt: z.string().datetime(),
  })
  .describe('Service photo (BEFORE/PROGRESS/AFTER)')

export const AssignmentSummaryResponse = z
  .object({
    id: z.number().int().positive(),
    staffId: z.number().int().positive(),
    status: z.nativeEnum(ServiceStatus),
    assignedAt: z.string().datetime(),
  })
  .describe('Latest staff assignment summary (if assigned)')

export const CustomerServiceRequestResponse = z
  .object({
    id: z.number().int().positive(),
    requestNumber: z.string(),
    type: z.nativeEnum(ServiceType),
    category: z.nativeEnum(ServiceCategory).nullable().optional(),
    status: z.nativeEnum(ServiceStatus),
    priority: z.nativeEnum(ServicePriority),

    title: z.string(),
    description: z.string(),

    addressId: z.number().int().positive().nullable().optional(),
    requestedDate: z.string().datetime().nullable().optional(),
    notes: z.string().nullable().optional(),

    photos: z.array(ServicePhotoResponse).describe('Service photos'),
    latestAssignment: AssignmentSummaryResponse.nullable().optional(),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .describe('Customer service request response')

export const ListCustomerServicesSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.array(CustomerServiceRequestResponse),
    meta: PaginationMeta,
    message: z.string().optional(),
  })
  .describe('List customer services success response')

export const CreateCustomerServiceSuccessResponse = z
  .object({
    success: z.literal(true),
    data: CustomerServiceRequestResponse,
    message: z.string().optional(),
  })
  .describe('Create customer service success response')

export const ServiceRatingResponse = z
  .object({
    id: z.number().int().positive(),
    serviceId: z.number().int().positive(),
    customerId: z.number().int().positive(),
    staffId: z.number().int().positive().nullable().optional(),
    score: z.number().int().min(1).max(5),
    review: z.string().nullable().optional(),
    wouldRecommend: z.boolean(),
    createdAt: z.string().datetime(),
  })
  .describe('Service rating response')

export const RateServiceSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceRatingResponse,
    message: z.string().optional(),
  })
  .describe('Rate service success response')

/**
 * -----------------------------
 * Service Offerings (Admin)
 * -----------------------------
 */
export const DecimalLike = z.union([z.number(), z.string()])

export const ServiceOfferingResponse = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  type: z.nativeEnum(ServiceType),
  category: z.nativeEnum(ServiceCategory).nullable().optional(),
  description: z.string().nullable().optional(),
  basePrice: DecimalLike.nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ServiceOfferingIdParams = z.object({
  id: z.string().describe('Service offering id'),
})

export const CreateServiceOfferingBody = serviceOfferingCreateSchema.describe(
  'Create service offering body (Admin)',
)

export const UpdateServiceOfferingBody = serviceOfferingUpdateSchema.describe(
  'Update service offering body (Admin)',
)

export const ListServiceOfferingsSuccessResponse = z.object({
  success: z.literal(true),
  data: z.array(ServiceOfferingResponse),
})

export const GetServiceOfferingSuccessResponse = z.object({
  success: z.literal(true),
  data: ServiceOfferingResponse,
})

export const CreateServiceOfferingSuccessResponse = z.object({
  success: z.literal(true),
  data: ServiceOfferingResponse,
  message: z.string().optional(),
})

export const UpdateServiceOfferingSuccessResponse = z.object({
  success: z.literal(true),
  data: ServiceOfferingResponse,
  message: z.string().optional(),
})

export const DeleteServiceOfferingSuccessResponse = z.object({
  success: z.literal(true),
  data: z.object({ id: z.number().int().positive() }),
  message: z.string().optional(),
})

/**
 * -----------------------------
 * Errors
 * -----------------------------
 */
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ConflictResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
