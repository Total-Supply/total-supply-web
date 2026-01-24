import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const [totalOrders, activeCustomers, totalProducts, servicesAvailable] =
    await Promise.all([
      prisma.order.count({
        where: { status: 'DELIVERED' },
      }),
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          status: 'ACTIVE',
        },
      }),
      prisma.foodItem.count({
        where: { stock: { gt: 0 } },
      }),
      prisma.serviceRequest
        .groupBy({
          by: ['type'],
          _count: true,
        })
        .then((result) => result.length),
    ])

  return ApiResponse.success({
    totalOrders,
    activeCustomers,
    totalProducts,
    servicesAvailable,
  })
}

export const GET = withErrorHandler(handler)
