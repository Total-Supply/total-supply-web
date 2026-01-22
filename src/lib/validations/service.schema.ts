import {
  ServiceCategory,
  ServicePriority,
  ServiceStatus,
  ServiceType,
} from '@/generated/prisma'
import { createAddressSchema } from './address.schema'
import { z } from 'zod'

export const serviceTypeSchema = z.nativeEnum(ServiceType)
export const serviceStatusSchema = z.nativeEnum(ServiceStatus)
export const servicePrioritySchema = z.nativeEnum(ServicePriority)
export const serviceCategorySchema = z.nativeEnum(ServiceCategory)

export const createServiceRequestSchema = z.object({
  type: serviceTypeSchema,
  category: serviceCategorySchema.optional(),
  serviceOfferingId: z.number().int().positive().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200).optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  addressId: z.number().int().positive().optional(),
  address: createAddressSchema.optional(),
  saveAsDefault: z.boolean().optional(),
  requestedDate: z.coerce.date().optional(),
  priority: servicePrioritySchema.default('MEDIUM'),
  notes: z.string().max(500).optional(),
  beforePhotos: z.array(z.string().url()).max(3).optional(),
})

export const updateServiceRequestSchema = z.object({
  status: serviceStatusSchema.optional(),
  priority: servicePrioritySchema.optional(),
  category: serviceCategorySchema.optional(),
  notes: z.string().max(500).optional(),
  staffId: z.number().int().positive().optional(),
  afterPhotos: z.array(z.string().url()).max(3).optional(),
})

export const assignServiceSchema = z.object({
  staffId: z.number().int().positive(),
  notes: z.string().max(500).optional(),
})

export const progressServiceSchema = z.object({
  notes: z.string().max(500).optional(),
  photos: z.array(z.string().url()).max(3).optional(),
})

export const itProgressSchema = z.object({
  notes: z.string().max(1000).optional(),
  photos: z.array(z.string().url()).max(5).optional(),
  timeSpentMinutes: z.number().int().min(1).max(480).optional(),
})

export const itCompleteSchema = z.object({
  completionNotes: z.string().min(10, 'Completion notes required').max(1000),
  solutionSummary: z.string().min(10, 'Solution summary required').max(1000),
  followUpRecommendations: z.string().max(1000).optional(),
  photos: z.array(z.string().url()).min(1).max(5),
})

export const completeServiceSchema = z.object({
  notes: z.string().min(10, 'Completion notes required').max(500),
  photos: z.array(z.string().url()).min(2).max(3),
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


