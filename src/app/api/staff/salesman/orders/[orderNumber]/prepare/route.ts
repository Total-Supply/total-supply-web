import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { sendOrderStatusEmail } from '@/src/lib/order-status-email'
import prisma from '@/src/lib/prisma'
import { prepareOrderSchema } from '@/src/lib/validations/order.schema'
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
  const body = await request.json()
  const data = await validateBody(body, prepareOrderSchema)

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
    },
  })

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  if (order.salesmanId !== userId) {
    throw new ForbiddenError('Order not assigned to you')
  }

  if (order.status !== 'ACCEPTED') {
    throw new ValidationError('Only accepted orders can be marked as preparing')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const etaMinutes = data.etaMinutes ?? 20
  const statusNote = JSON.stringify({
    note: data.notes ?? null,
    photoUrl: data.photoUrl ?? null,
    etaMinutes,
  })

  const updated = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'PREPARING',
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
        to: 'PREPARING',
        changedById: userId,
        note: statusNote,
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
          status: 'PREPARING',
          notes: data.notes ?? null,
          photoUrl: data.photoUrl ?? null,
          etaMinutes,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return nextOrder
  })

  try {
    await sendOrderStatusEmail(order.id, 'PREPARING')
  } catch (error) {
    console.error('Order preparing email failed', error)
  }

  return ApiResponse.success(updated, 'Order marked as preparing')
}

export const POST = withErrorHandler(handler)


