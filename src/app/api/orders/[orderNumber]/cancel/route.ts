import { ValidationError, ForbiddenError, NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildOrderCancellationEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const cancelSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(200),
})

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const { orderNumber } = await params
  const body = await request.json()
  const data = await validateBody(body, cancelSchema)

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      customerId: true,
      status: true,
      orderNumber: true,
      items: {
        select: {
          foodItemId: true,
          quantity: true,
        },
      },
      customer: {
        select: {
          email: true,
          name: true,
          unsubscribeToken: true,
        },
      },
    },
  })

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  if (authRequest.user.role !== 'ADMIN' && order.customerId !== userId) {
    throw new ForbiddenError('Cannot access this order')
  }

  if (!['PENDING', 'ACCEPTED'].includes(order.status)) {
    throw new ValidationError('Order cannot be canceled at this stage')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELED',
      },
    })

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        from: order.status,
        to: 'CANCELED',
        changedById: userId,
        note: data.reason,
      },
    })

    await Promise.all(
      order.items.map((item) =>
        tx.foodItem.update({
          where: { id: item.foodItemId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    )

    await tx.auditLog.create({
      data: {
        entityType: 'ORDER',
        entityId: order.id,
        action: 'STATUS_CHANGE',
        actorId: userId,
        ipAddress: ip,
        details: {
          to: 'CANCELED',
          reason: data.reason,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const unsubscribeUrl = order.customer.unsubscribeToken
    ? `${appUrl}/unsubscribe?token=${order.customer.unsubscribeToken}`
    : undefined

  const { html, text } = buildOrderCancellationEmail({
    name: order.customer.name,
    orderNumber: order.orderNumber,
    reason: data.reason,
    unsubscribeUrl,
  })

  try {
    await sendEmail({
      to: order.customer.email,
      subject: `Order ${order.orderNumber} canceled`,
      html,
      text,
    })
  } catch (error) {
    console.error('Order cancellation email failed', error)
  }

  const notifyEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SUPPORT_EMAIL
  if (notifyEmail) {
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `Order ${order.orderNumber} canceled`,
        html,
        text,
      })
    } catch (error) {
      console.error('Order cancellation notification failed', error)
    }
  }

  return ApiResponse.success({ orderNumber: order.orderNumber }, 'Order canceled')
}

export const POST = withErrorHandler(handler)


