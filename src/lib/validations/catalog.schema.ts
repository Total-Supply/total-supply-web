import { z } from 'zod'

const slugSchema = z.string().min(2).max(140)

export const createFoodCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: slugSchema.optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
})

export const updateFoodCategorySchema = createFoodCategorySchema.partial()

export const createFoodItemSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema.optional(),
  description: z.string().max(2000).optional(),
  ingredients: z.string().max(2000).optional(),
  nutritionInfo: z.string().max(2000).optional(),
  price: z.coerce.number().min(0.01),
  sku: z.string().max(140).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  categoryId: z.number().int().positive(),
  categoryIds: z.array(z.number().int().positive()).optional(),
  mainImageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
})

export const updateFoodItemSchema = createFoodItemSchema.partial()

export type CreateFoodCategoryInput = z.infer<typeof createFoodCategorySchema>
export type UpdateFoodCategoryInput = z.infer<typeof updateFoodCategorySchema>
export type CreateFoodItemInput = z.infer<typeof createFoodItemSchema>
export type UpdateFoodItemInput = z.infer<typeof updateFoodItemSchema>


