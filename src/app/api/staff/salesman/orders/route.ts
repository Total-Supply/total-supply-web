import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const allowedStatuses = new Set(['PENDING', 'ACCEPTED', 'PREPARING'])

async function handler(request: NextRequest) {
  const authRequest = await requireRole(request, ['SALESMAN'])
  const userId = parseInt(authRequest.user.id)
  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')

  const where: any = {
    salesmanId: userId,
  }

  if (status && allowedStatuses.has(status)) {
    where.status = status
  } else {
    where.status = { in: Array.from(allowedStatuses) }
  }

  const orders = await prisma.order.findMany({
    where,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      notes: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      deliveryAddress: {
        select: {
          line1: true,
          line2: true,
          city: true,
          postalCode: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          foodItem: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return ApiResponse.success(orders)
}

export const GET = withErrorHandler(handler)
