import {
  createFoodCategorySchema,
  createFoodItemSchema,
  updateFoodCategorySchema,
  updateFoodItemSchema,
} from '@/src/lib/validations/catalog.schema'
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
 * Shared / Helpers
 * -----------------------------
 */
export const PaginationMeta = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})

/**
 * -----------------------------
 * Path Params
 * -----------------------------
 */
export const CategoryIdParams = z.object({
  id: z.string().describe('Category id'),
})

export const ItemIdParams = z.object({
  id: z.string().describe('Item id'),
})

/**
 * -----------------------------
 * Categories
 * -----------------------------
 */
export const ListCategoriesQuery = z.object({
  page: z.coerce.number().int().min(1).default(1).describe('Page number'),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe('Items per page'),
  search: z.string().optional().describe('Search by name or slug'),
})

export const CategoryResponse = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CategoryWithCountResponse = CategoryResponse.extend({
  itemCount: z.number().int().min(0),
})

export const ListCategoriesSuccessResponse = z.object({
  success: z.literal(true),
  data: z.array(CategoryWithCountResponse),
  meta: PaginationMeta,
})

export const GetCategorySuccessResponse = z.object({
  success: z.literal(true),
  data: CategoryWithCountResponse,
})

export const CreateCategoryBody = createFoodCategorySchema
export const UpdateCategoryBody = updateFoodCategorySchema

export const CreateCategorySuccessResponse = z.object({
  success: z.literal(true),
  data: CategoryResponse,
  message: z.string().optional(),
})

export const UpdateCategorySuccessResponse = z.object({
  success: z.literal(true),
  data: CategoryResponse,
  message: z.string().optional(),
})

export const DeleteCategorySuccessResponse = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number().int().positive(),
  }),
  message: z.string().optional(),
})

/**
 * -----------------------------
 * Items
 * -----------------------------
 */
export const ListItemsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1).describe('Page number'),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe('Items per page'),
  search: z.string().optional().describe('Search by name / slug / sku'),
  categoryId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filter by category id'),
  isActive: z
    .enum(['true', 'false'])
    .optional()
    .describe('Filter by active status'),
})

export const ItemCategoryMini = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
})

export const ItemImageResponse = z.object({
  id: z.number().int().positive(),
  url: z.string(),
  position: z.number().int().min(0),
})

/**
 * Prisma Decimal may serialize to string.
 */
export const DecimalLike = z.union([z.number(), z.string()])

export const ItemSummaryResponse = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  price: DecimalLike.describe('Decimal may serialize as string'),
  stock: z.number().int().min(0),
  sku: z.string().nullable().optional(),
  isActive: z.boolean(),
  mainImageUrl: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  categories: z.array(ItemCategoryMini),
})

export const ItemDetailsResponse = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  ingredients: z.string().nullable().optional(),
  nutritionInfo: z.string().nullable().optional(),
  price: DecimalLike,
  sku: z.string().nullable().optional(),
  stock: z.number().int().min(0),
  isActive: z.boolean(),
  mainImageUrl: z.string().nullable().optional(),
  categories: z.array(ItemCategoryMini),
  images: z.array(ItemImageResponse),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ItemDbResponse = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  ingredients: z.string().nullable().optional(),
  nutritionInfo: z.string().nullable().optional(),
  price: DecimalLike,
  sku: z.string().nullable().optional(),
  stock: z.number().int().min(0),
  isActive: z.boolean(),
  mainImageUrl: z.string().nullable().optional(),
  categoryId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ListItemsSuccessResponse = z.object({
  success: z.literal(true),
  data: z.array(ItemSummaryResponse),
  meta: PaginationMeta,
})

export const GetItemSuccessResponse = z.object({
  success: z.literal(true),
  data: ItemDetailsResponse,
})

export const CreateItemBody = createFoodItemSchema
export const UpdateItemBody = updateFoodItemSchema

export const CreateItemSuccessResponse = z.object({
  success: z.literal(true),
  data: ItemDbResponse,
  message: z.string().optional(),
})

export const UpdateItemSuccessResponse = z.object({
  success: z.literal(true),
  data: ItemDbResponse,
  message: z.string().optional(),
})

export const DeleteItemSuccessResponse = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number().int().positive(),
  }),
  message: z.string().optional(),
})

/**
 * Re-export errors
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
