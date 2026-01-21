import { ServiceCategory, ServiceType } from '@/generated/prisma'
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
 * Path params: /admin/services/offerings/[id]
 */
export const ServiceOfferingIdParams = z
  .object({
    id: z.string().describe('Service offering ID'),
  })
  .describe('Path parameters for service offering routes')

/**
 * Prisma Enums (from generated Prisma schema)
 */
export const ServiceTypeEnum = z
  .nativeEnum(ServiceType)
  .describe('Type of service offering')

export const ServiceCategoryEnum = z
  .nativeEnum(ServiceCategory)
  .describe('Category of service offering')

/**
 * NOTE: Prisma Decimal may serialize as string depending on runtime.
 * In DB it is Decimal?, so allow string | number | null.
 */
export const DecimalLike = z.union([z.number(), z.string()])

export const ServiceOfferingResponse = z
  .object({
    id: z.number().int().positive().describe('Service offering ID'),
    name: z.string().describe('Service name'),
    slug: z.string().describe('URL slug'),
    type: ServiceTypeEnum,
    category: ServiceCategoryEnum.nullable().optional(),
    description: z.string().nullable().optional(),
    basePrice: DecimalLike.nullable().optional().describe('Base price (LKR)'),
    isActive: z.boolean().describe('Active status'),
    createdAt: z.string().datetime().describe('Created at (ISO 8601)'),
    updatedAt: z.string().datetime().describe('Updated at (ISO 8601)'),
  })
  .describe('Service offering object')

/**
 * ✅ Bodies (EXACTLY match your validations)
 */
export const CreateServiceOfferingBody = serviceOfferingCreateSchema.describe(
  'Create service offering request body',
)

export const UpdateServiceOfferingBody = serviceOfferingUpdateSchema.describe(
  'Update service offering request body',
)

/**
 * ✅ Success responses
 */
export const ListServiceOfferingsSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.array(ServiceOfferingResponse),
    message: z.string().optional(),
  })
  .describe('List service offerings response')

export const GetServiceOfferingSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceOfferingResponse,
    message: z.string().optional(),
  })
  .describe('Get service offering response')

export const CreateServiceOfferingSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceOfferingResponse,
    message: z.string().optional(),
  })
  .describe('Created service offering response')

export const UpdateServiceOfferingSuccessResponse = z
  .object({
    success: z.literal(true),
    data: ServiceOfferingResponse,
    message: z.string().optional(),
  })
  .describe('Updated service offering response')

export const DeleteServiceOfferingSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({ id: z.number().int().positive() }),
    message: z.string().optional(),
  })
  .describe('Deleted service offering response')

/**
 * Re-export common error schemas
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
