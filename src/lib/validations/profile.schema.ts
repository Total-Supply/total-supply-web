import { z } from 'zod'

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  profileImage: z.string().url('Invalid image URL').optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
