import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import {
  buildOrderDeclinedAdminEmail,
  buildOrderDelayEmail,
  sendEmail,
} from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { declineOrderSchema } from '@/src/lib/validations/order.schema'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const sendWithRetry = async (attempts: number, task: () => Promise<void>) => {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      await task()
      return
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) throw lastError
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const authRequest = await requireRole(request, ['SALESMAN'])
  const userId = parseInt(authRequest.user.id)
  const { orderNumber } = await params
  const body = await request.json()
  const data = await validateBody(body, declineOrderSchema)

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

  if (!['PENDING', 'ACCEPTED'].includes(order.status)) {
    throw new ValidationError('Only pending or accepted orders can be declined')
  }

  const nextSalesman = await prisma.user.findFirst({
    where: {
      role: 'SALESMAN',
      status: 'ACTIVE',
      id: { not: userId },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { id: 'asc' },
  })

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const updated = await prisma.$transaction(async (tx) => {
    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'PENDING',
        salesmanId: nextSalesman?.id ?? null,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        salesmanId: true,
      },
    })

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        from: order.status,
        to: 'PENDING',
        changedById: userId,
        note: JSON.stringify({
          reason: data.reason,
          notes: data.notes ?? null,
        }),
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
          status: 'PENDING',
          reason: data.reason,
          notes: data.notes ?? null,
          reassignedTo: nextSalesman?.id ?? null,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return nextOrder
  })

  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const notifyEmail =
    process.env.ORDER_NOTIFICATION_EMAIL || process.env.SUPPORT_EMAIL

  if (notifyEmail) {
    const { html, text } = buildOrderDeclinedAdminEmail({
      orderNumber,
      customerName: order.customer.name,
      salesmanName: authRequest.user.name,
      reason: data.reason,
      notes: data.notes ?? undefined,
      reassignedTo: nextSalesman?.name ?? null,
    })
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `Order ${orderNumber} declined`,
        html,
        text,
      })
    } catch (error) {
      console.error('Decline notification email failed', error)
    }
  }

  if (data.notifyCustomer && order.customer.email) {
    const { html, text } = buildOrderDelayEmail({
      name: order.customer.name,
      orderNumber,
      reason: data.reason,
      notes: data.notes ?? undefined,
      trackingUrl: `${appUrl}/orders/${orderNumber}`,
    })
    try {
      await sendWithRetry(3, () =>
        sendEmail({
          to: order.customer.email,
          subject: `Order ${orderNumber} update`,
          html,
          text,
        }),
      )
    } catch (error) {
      console.error('Decline customer email failed', error)
    }
  }

  return ApiResponse.success(updated, 'Order declined and reassigned')
}

export const POST = withErrorHandler(handler)


