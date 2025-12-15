import { z } from 'zod'

export const createAddressSchema = z.object({
  label: z.string().max(50, 'Label too long').optional(),
  line1: z.string().min(1, 'Address line 1 is required').max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().max(100).default('Sri Lanka'),
  isDefault: z.boolean().default(false),
})

export const updateAddressSchema = createAddressSchema.partial()

export type CreateAddressInput = z.infer<typeof createAddressSchema>
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>
