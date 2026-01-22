import { OrderStatus } from '@/generated/prisma'
import { createAddressSchema } from './address.schema'
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
  deliveryAddress: createAddressSchema.optional(),
  saveAsDefault: z.boolean().optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  proofImageUrl: z.string().url('Invalid image URL').optional(),
})

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  salesmanId: z.number().int().positive().optional(),
  driverId: z.number().int().positive().optional(),
  deliveryProofUrl: z.string().url('Invalid image URL').optional(),
  deliveredAt: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
})

export const prepareOrderSchema = z.object({
  notes: z.string().max(500).optional(),
  photoUrl: z.string().url('Invalid image URL').optional(),
  etaMinutes: z.coerce.number().int().min(5).max(240).optional(),
})

export const declineOrderSchema = z.object({
  reason: z.enum(['Out of stock', 'Not enough time', 'Other']),
  notes: z.string().max(500).optional(),
  notifyCustomer: z.boolean().optional(),
})

export const confirmDeliverySchema = z.object({
  photoUrl: z.string().url('Invalid image URL'),
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


