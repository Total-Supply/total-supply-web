import { ValidationError, ForbiddenError, NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { sendOrderStatusEmail } from '@/src/lib/order-status-email'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const authRequest = await requireRole(request, ['SALESMAN'])
  const userId = parseInt(authRequest.user.id)
  const { orderNumber } = await params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      status: true,
      salesmanId: true,
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        select: {
          foodItemId: true,
          quantity: true,
          foodItem: {
            select: {
              name: true,
              stock: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  if (order.salesmanId !== userId) {
    throw new ForbiddenError('Order not assigned to you')
  }

  if (order.status !== 'PENDING') {
    throw new ValidationError('Only pending orders can be accepted')
  }

  const outOfStock = order.items.find(
    (item) => item.foodItem.stock < item.quantity,
  )
  if (outOfStock) {
    throw new ValidationError('One or more items are out of stock', {
      item: outOfStock.foodItem.name,
    })
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const updated = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'ACCEPTED',
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
      },
    })

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        from: order.status,
        to: 'ACCEPTED',
        changedById: userId,
        note: 'Order accepted by salesman',
      },
    })

    await tx.auditLog.create({
      data: {
        entityType: 'ORDER',
        entityId: order.id,
        action: 'STATUS_CHANGE',
        actorId: userId,
        ipAddress: ip,
        details: {
          status: 'ACCEPTED',
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return nextOrder
  })

  try {
    await sendOrderStatusEmail(order.id, 'ACCEPTED')
  } catch (error) {
    console.error('Order acceptance email failed', error)
  }

  return ApiResponse.success(updated, 'Order accepted. Start preparing')
}

export const POST = withErrorHandler(handler)


