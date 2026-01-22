import { OrderStatus } from '@/generated/prisma'
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

// --------------------
// Enums
// --------------------
export const OrderStatusEnum = z
  .nativeEnum(OrderStatus)
  .describe(
    'Order status (PENDING, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELED)',
  )

// --------------------
// Request Schemas
// --------------------
export const CreateOrderBody = z
  .object({
    items: z
      .array(
        z.object({
          foodItemId: z.number().int().positive().describe('Food item ID'),
          quantity: z.number().int().min(1).describe('Quantity (min 1)'),
        }),
      )
      .min(1)
      .describe('Order items'),

    deliveryAddressId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Existing saved address ID'),

    deliveryAddress: z
      .object({
        label: z.string().optional().describe('Address label (Home/Office)'),
        line1: z.string().describe('Street address line 1'),
        line2: z.string().optional().describe('Street address line 2'),
        city: z.string().describe('City'),
        postalCode: z.string().describe('Postal code'),
        country: z.string().optional().describe('Country'),
        isDefault: z.boolean().optional().describe('Set as default address'),
      })
      .optional()
      .describe('Inline address payload'),

    saveAsDefault: z
      .boolean()
      .optional()
      .describe('If true, make selected/created address default'),

    notes: z.string().max(500).optional().describe('Customer notes'),
    imageUrl: z.string().url().optional().describe('Optional order photo URL'),
  })
  .describe('Create order request body')

export const ListCustomerOrdersQuery = z
  .object({
    page: z.coerce.number().min(1).default(1).describe('Page number'),
    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10)
      .describe('Items per page'),
    status: OrderStatusEnum.optional().describe('Filter by order status'),
    sortBy: z
      .enum(['createdAt', 'totalPrice', 'orderNumber'])
      .default('createdAt')
      .describe('Sort field'),
    sortOrder: z.enum(['asc', 'desc']).default('desc').describe('Sort order'),
  })
  .describe('Query parameters for listing customer orders')

export const OrderIdParams = z
  .object({
    id: z.string().describe('Order ID'),
  })
  .describe('Path params for order details')

// --------------------
// Response Schemas
// --------------------
export const OrderItemResponse = z
  .object({
    id: z.number().int().describe('Order item ID'),
    foodItemId: z.number().int().describe('Food item ID'),
    quantity: z.number().int().describe('Quantity'),
    unitPrice: z.number().describe('Unit price snapshot (LKR)'),
    foodItem: z
      .object({
        id: z.number().int(),
        name: z.string(),
        slug: z.string(),
      })
      .nullable()
      .describe('Food item minimal details'),
  })
  .describe('Order item response')

export const OrderDeliveryAddressResponse = z
  .object({
    id: z.number().int(),
    label: z.string().nullable(),
    line1: z.string(),
    line2: z.string().nullable(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  })
  .nullable()
  .describe('Delivery address used for this order')

export const OrderResponse = z
  .object({
    id: z.number().int().describe('Order ID'),
    orderNumber: z.string().describe('Human-friendly order number'),
    status: OrderStatusEnum,
    notes: z.string().nullable().describe('Customer notes'),
    imageUrl: z.string().nullable().describe('Order image URL'),
    totalPrice: z.number().nonnegative().describe('Total price (LKR)'),
    createdAt: z.string().datetime().describe('Created timestamp (ISO)'),
    updatedAt: z.string().datetime().describe('Updated timestamp (ISO)'),
    deliveryAddress: OrderDeliveryAddressResponse,
    items: z.array(OrderItemResponse).describe('Order items'),
  })
  .describe('Full order response')

export const PaginatedMeta = z
  .object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  .describe('Pagination meta')

export const ListCustomerOrdersSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.array(OrderResponse),
    meta: PaginatedMeta.optional(),
    message: z.string().optional(),
  })
  .describe('List customer orders success response')

export const CreateOrderSuccessResponse = z
  .object({
    success: z.literal(true),
    data: OrderResponse,
    message: z.string().optional(),
  })
  .describe('Create order success response')

export const GetOrderSuccessResponse = z
  .object({
    success: z.literal(true),
    data: OrderResponse,
    message: z.string().optional(),
  })
  .describe('Get order success response')

// Re-export error responses for docs
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ConflictResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
