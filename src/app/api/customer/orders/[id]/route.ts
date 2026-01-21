import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = {
  params: Promise<{ id: string }>
}

/**
 * Get My Order (by ID)
 *
 * @description Returns a single order owned by the authenticated customer.
 *
 * @pathParams OrderIdParams
 * @response 200 - GetOrderSuccessResponse - Order details
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Orders
 * @openapi
 */
async function handler(request: NextRequest, { params }: Params) {
  const authRequest = await requireAuth(request)
  const userId = Number(authRequest.user.id)

  const { id } = await params
  const orderId = Number(id)
  if (Number.isNaN(orderId)) {
    return ApiResponse.badRequest('Invalid order id')
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      deliveryAddress: true,
      items: {
        include: {
          foodItem: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  })

  if (!order) {
    return ApiResponse.notFound('Order not found')
  }

  return ApiResponse.success({
    ...order,
    totalPrice: Number(order.totalPrice),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    deliveryAddress: order.deliveryAddress
      ? {
          ...order.deliveryAddress,
          line2: order.deliveryAddress.line2 ?? null,
          label: order.deliveryAddress.label ?? null,
        }
      : null,
    items: order.items.map((it) => ({
      ...it,
      unitPrice: Number(it.unitPrice),
    })),
  })
}

export const GET = withErrorHandler(handler)
