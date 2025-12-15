import { OrderStatus } from '@prisma/client'
import { z } from 'zod'

export const orderStatusSchema = z.nativeEnum(OrderStatus)

export const orderItemSchema = z.object({
  foodItemId: z.number().int().positive(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, 'Order must contain at least one item'),
  deliveryAddressId: z.number().int().positive().optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
})

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  salesmanId: z.number().int().positive().optional(),
  driverId: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
})

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: orderStatusSchema.optional(),
  customerId: z.coerce.number().int().positive().optional(),
  salesmanId: z.coerce.number().int().positive().optional(),
  driverId: z.coerce.number().int().positive().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  sortBy: z
    .enum(['createdAt', 'totalPrice', 'orderNumber'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type OrderItemInput = z.infer<typeof orderItemSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>
