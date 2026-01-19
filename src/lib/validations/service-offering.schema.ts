import { ServiceCategory, ServiceType } from '@/generated/prisma'
import { z } from 'zod'

export const serviceOfferingCreateSchema = z.object({
  name: z.string().min(3).max(120),
  slug: z.string().min(3).max(140).optional(),
  type: z.nativeEnum(ServiceType),
  category: z.nativeEnum(ServiceCategory).optional(),
  description: z.string().max(1000).optional(),
  basePrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const serviceOfferingUpdateSchema = serviceOfferingCreateSchema.partial()

export type ServiceOfferingCreateInput = z.infer<
  typeof serviceOfferingCreateSchema
>
export type ServiceOfferingUpdateInput = z.infer<
  typeof serviceOfferingUpdateSchema
>


