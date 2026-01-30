import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import {
  ListOrdersSuccessResponse,
  ListCustomerOrdersQuery,
} from '@/src/lib/schemas/orders'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * List All Orders
 *
 * @description List all orders (ADMIN only).
 *
 * @response 200:ListOrdersSuccessResponse:Orders fetched
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Orders
 * @openapi
 */
export const GET = withErrorHandler(async function GET(request: NextRequest) {
  await requireAdmin(request)

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  
  // Basic validation without strict parsing for query params if needed, or use Zod
  const query = ListCustomerOrdersQuery.parse(searchParams)

  const page = query.page || 1
  const limit = query.limit || 10
  const skip = (page - 1) * limit

  const where: any = {}

  if (query.status) {
    where.status = query.status
  }
  
  // Allow filtering by specific order ID or search text if needed (extending basic requirement of fixing 404)
  
  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        items: true,
        deliveryAddress: true,
      },
    }),
  ])

  // Transform for Response if needed (Decimal/Date) - applying the same fix pattern
  const transformedOrders = orders.map((order) => ({
    ...order,
    totalPrice: order.totalPrice ? Number(order.totalPrice) : 0,
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
      createdAt: item.createdAt.toISOString(),
      // Check if foodItem is needed? usually frontend needs it but items: true gives foreign keys or relation?
      // items in Prisma result has orderId, foodItemId, quantity, unitPrice.
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }))

  const payload = {
    success: true,
    data: transformedOrders,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }

  // We might need to adjust ListOrdersSuccessResponse if it expects strict Decimal
  // But given I saw ZodError on Offerings, I assume Orders schema is similar.
  // I will check orders.ts next. 
  // For now I write this file.
  
  return ApiResponse.success(payload.data, undefined, payload.meta)
})
