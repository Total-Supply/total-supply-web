import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { sendOrderStatusEmail } from '@/src/lib/order-status-email'
import { updateOrderSchema } from '@/src/lib/validations/order.schema'
import { requireAuth, requireStaff } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const { orderNumber } = await params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalPrice: true,
      createdAt: true,
      customerId: true,
      notes: true,
      imageUrl: true,
      salesman: {
        select: {
          id: true,
          name: true,
        },
      },
      deliveryAddress: {
        select: {
          line1: true,
          line2: true,
          city: true,
          postalCode: true,
          country: true,
        },
      },
      statusHistory: {
        select: {
          id: true,
          from: true,
          to: true,
          changedAt: true,
          note: true,
          changedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          changedAt: 'asc',
        },
      },
      deliveryProof: {
        select: {
          photoUrl: true,
          deliveredAt: true,
          driver: {
            select: {
              id: true,
              name: true,
            },
          },
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
              mainImageUrl: true,
            },
          },
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

  return ApiResponse.success({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalPrice: order.totalPrice,
    createdAt: order.createdAt,
    notes: order.notes,
    imageUrl: order.imageUrl,
    salesman: order.salesman,
    address: order.deliveryAddress,
    statusHistory: order.statusHistory,
    deliveryProof: order.deliveryProof,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      foodItem: {
        id: item.foodItem.id,
        name: item.foodItem.name,
        image: item.foodItem.mainImageUrl,
      },
    })),
  })
}

export const GET = withErrorHandler(handler)

async function patchHandler(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const authRequest = await requireStaff(request)
  const { orderNumber } = await params
  const body = await request.json()
  const data = updateOrderSchema.parse(body)

  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      status: true,
    },
  })

  if (!existing) {
    throw new NotFoundError('Order not found')
  }

  if (data.status && data.status === existing.status) {
    throw new ValidationError('Status is unchanged')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: existing.id },
      data: {
        status: data.status ?? undefined,
        notes: data.notes ?? undefined,
        salesmanId: data.salesmanId ?? undefined,
        driverId: data.driverId ?? undefined,
      },
    })

    if (data.status) {
      await tx.orderStatusHistory.create({
        data: {
          orderId: existing.id,
          from: existing.status,
          to: data.status,
          changedById: parseInt(authRequest.user.id),
          note: data.notes,
        },
      })
    }

    if (data.deliveryProofUrl) {
      const deliveredAt = data.deliveredAt ?? new Date()
      await tx.deliveryProof.upsert({
        where: { orderId: existing.id },
        create: {
          orderId: existing.id,
          photoUrl: data.deliveryProofUrl,
          deliveredAt,
          driverId: data.driverId ?? undefined,
        },
        update: {
          photoUrl: data.deliveryProofUrl,
          deliveredAt,
          driverId: data.driverId ?? undefined,
        },
      })
    }

    await tx.auditLog.create({
      data: {
        entityType: 'ORDER',
        entityId: existing.id,
        action: 'STATUS_CHANGE',
        actorId: parseInt(authRequest.user.id),
        ipAddress: ip,
        details: {
          status: data.status,
          notes: data.notes,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return order
  })

  if (data.status) {
    try {
      await sendOrderStatusEmail(existing.id, data.status)
    } catch (error) {
      console.error('Order status email failed', error)
    }
  }

  return ApiResponse.success(updated, 'Order updated')
}

export const PATCH = withErrorHandler(patchHandler)


