import { ServicePriority, ServiceStatus, ServiceType } from '@prisma/client'
import { z } from 'zod'

export const serviceTypeSchema = z.nativeEnum(ServiceType)
export const serviceStatusSchema = z.nativeEnum(ServiceStatus)
export const servicePrioritySchema = z.nativeEnum(ServicePriority)

export const createServiceRequestSchema = z.object({
  type: serviceTypeSchema,
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  addressId: z.number().int().positive().optional(),
  requestedDate: z.coerce.date().optional(),
  priority: servicePrioritySchema.default('MEDIUM'),
  notes: z.string().max(500).optional(),
})

export const updateServiceRequestSchema = z.object({
  status: serviceStatusSchema.optional(),
  priority: servicePrioritySchema.optional(),
  notes: z.string().max(500).optional(),
})

export const assignServiceSchema = z.object({
  staffId: z.number().int().positive(),
  notes: z.string().max(500).optional(),
})

export const rateServiceSchema = z.object({
  serviceId: z.number().int().positive(),
  staffId: z.number().int().positive().optional(),
  score: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
  wouldRecommend: z.boolean().default(false),
})

export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>
export type UpdateServiceRequestInput = z.infer<
  typeof updateServiceRequestSchema
>
export type AssignServiceInput = z.infer<typeof assignServiceSchema>
export type RateServiceInput = z.infer<typeof rateServiceSchema>
