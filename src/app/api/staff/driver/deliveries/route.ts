import { OrderStatus } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireRole(request, ['DRIVER'])
  const userId = parseInt(authRequest.user.id)
  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')
  const allowedStatuses: OrderStatus[] = ['PREPARING', 'OUT_FOR_DELIVERY']
  const selectedStatus = allowedStatuses.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined

  const orders = await prisma.order.findMany({
    where: {
      driverId: userId,
      status: selectedStatus
        ? selectedStatus
        : { in: allowedStatuses },
    },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      notes: true,
      deliveryAddress: {
        select: {
          line1: true,
          line2: true,
          city: true,
          postalCode: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      items: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const payload = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    notes: order.notes,
    customer: order.customer,
    deliveryAddress: order.deliveryAddress,
    itemsCount: order.items.length,
  }))

  return ApiResponse.success(payload)
}

export const GET = withErrorHandler(handler)


