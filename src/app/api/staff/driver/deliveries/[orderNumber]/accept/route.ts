import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
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
  const authRequest = await requireRole(request, ['DRIVER'])
  const userId = parseInt(authRequest.user.id)
  const { orderNumber } = await params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      status: true,
      driverId: true,
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  if (order.driverId !== userId) {
    throw new ForbiddenError('Order not assigned to you')
  }

  if (order.status !== 'PREPARING') {
    throw new ValidationError('Only preparing orders can be accepted for delivery')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const etaMinutes = 15

  const updated = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'OUT_FOR_DELIVERY',
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
        to: 'OUT_FOR_DELIVERY',
        changedById: userId,
        note: JSON.stringify({ etaMinutes }),
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
          status: 'OUT_FOR_DELIVERY',
          etaMinutes,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return nextOrder
  })

  try {
    await sendOrderStatusEmail(order.id, 'OUT_FOR_DELIVERY')
  } catch (error) {
    console.error('Out for delivery email failed', error)
  }

  return ApiResponse.success(updated, 'Delivery accepted')
}

export const POST = withErrorHandler(handler)


