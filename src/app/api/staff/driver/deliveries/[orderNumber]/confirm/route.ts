import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { sendOrderStatusEmail } from '@/src/lib/order-status-email'
import prisma from '@/src/lib/prisma'
import { confirmDeliverySchema } from '@/src/lib/validations/order.schema'
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
  const body = await request.json()
  const data = await validateBody(body, confirmDeliverySchema)

  if (!data.photoUrl) {
    throw new ValidationError('Delivery photo is required')
  }

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

  if (order.status !== 'OUT_FOR_DELIVERY') {
    throw new ValidationError('Only out-for-delivery orders can be confirmed')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const deliveredAt = new Date()

  const updated = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'DELIVERED',
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
        to: 'DELIVERED',
        changedById: userId,
        note: data.notes ?? undefined,
      },
    })

    await tx.deliveryProof.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        photoUrl: data.photoUrl,
        note: data.notes ?? undefined,
        deliveredAt,
        driverId: userId,
      },
      update: {
        photoUrl: data.photoUrl,
        note: data.notes ?? undefined,
        deliveredAt,
        driverId: userId,
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
          status: 'DELIVERED',
          notes: data.notes ?? null,
          photoUrl: data.photoUrl,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return nextOrder
  })

  try {
    await sendOrderStatusEmail(order.id, 'DELIVERED')
  } catch (error) {
    console.error('Delivery confirmation email failed', error)
  }

  return ApiResponse.success(updated, 'Delivery confirmed')
}

export const POST = withErrorHandler(handler)


