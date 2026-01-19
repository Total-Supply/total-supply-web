import { Prisma } from '@/generated/prisma'
import { ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import {
  buildOrderConfirmationEmail,
  buildOrderNotificationEmail,
  sendEmail,
} from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { isCityServiceable } from '@/src/lib/service-area'
import {
  createOrderSchema,
  getOrdersQuerySchema,
} from '@/src/lib/validations/order.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const ORDER_PREFIX = 'TS'

const generateOrderNumber = () => {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${ORDER_PREFIX}-${datePart}-${randomPart}`
}

const getUniqueOrderNumber = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateOrderNumber()
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    })
    if (!existing) {
      return candidate
    }
  }
  throw new ValidationError('Unable to generate order number')
}

const sendWithRetry = async (
  attempts: number,
  task: () => Promise<void>,
) => {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      await task()
      return
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) {
    throw lastError
  }
}

async function postHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const body = await request.json()
  const data = await validateBody(body, createOrderSchema)

  if (!data.deliveryAddress && !data.deliveryAddressId) {
    throw new ValidationError('Delivery address is required')
  }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        unsubscribeToken: true,
      },
    })

  if (!user) {
    throw new ValidationError('User not found')
  }

  const itemIds = data.items.map((item) => item.foodItemId)
  const items = await prisma.foodItem.findMany({
    where: { id: { in: itemIds }, isActive: true },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  })

  if (items.length !== itemIds.length) {
    throw new ValidationError('One or more items are unavailable')
  }

  const itemMap = new Map(items.map((item) => [item.id, item]))
  data.items.forEach((item) => {
    const entry = itemMap.get(item.foodItemId)
    if (!entry || entry.stock < item.quantity) {
      throw new ValidationError('Insufficient stock', {
        foodItemId: item.foodItemId,
      })
    }
  })

  let total = new Prisma.Decimal(0)
  data.items.forEach((item) => {
    const entry = itemMap.get(item.foodItemId)
    if (entry) {
      total = total.plus(entry.price.mul(item.quantity))
    }
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const unsubscribeUrl = user.unsubscribeToken
    ? `${appUrl}/unsubscribe?token=${user.unsubscribeToken}`
    : undefined
  const supportPhone = process.env.SUPPORT_PHONE || '011 000 0000'
  const eta = process.env.ESTIMATED_DELIVERY || '60-90 minutes'
  const notifyEmail =
    process.env.ORDER_NOTIFICATION_EMAIL || process.env.SUPPORT_EMAIL

  const orderNumber = await getUniqueOrderNumber()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const result = await prisma.$transaction(async (tx) => {
    let deliveryAddressId = data.deliveryAddressId

    if (deliveryAddressId) {
      const existing = await tx.address.findFirst({
        where: { id: deliveryAddressId, userId },
        select: { id: true, city: true },
      })
      if (!existing) {
        throw new ValidationError('Invalid delivery address')
      }
      if (!isCityServiceable(existing.city)) {
        throw new ValidationError('Address is outside service area', {
          city: existing.city,
        })
      }
      if (data.saveAsDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        })
        await tx.address.update({
          where: { id: deliveryAddressId },
          data: { isDefault: true },
        })
      }
    } else if (data.deliveryAddress) {
      if (!isCityServiceable(data.deliveryAddress.city)) {
        throw new ValidationError('Address is outside service area', {
          city: data.deliveryAddress.city,
        })
      }

      if (data.saveAsDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        })
      }

      const createdAddress = await tx.address.create({
        data: {
          userId,
          label: data.deliveryAddress.label,
          line1: data.deliveryAddress.line1,
          line2: data.deliveryAddress.line2,
          city: data.deliveryAddress.city,
          postalCode: data.deliveryAddress.postalCode,
          country: data.deliveryAddress.country,
          isDefault: data.saveAsDefault ?? data.deliveryAddress.isDefault,
        },
        select: { id: true },
      })
      deliveryAddressId = createdAddress.id
    }

    for (const item of data.items) {
      const updated = await tx.foodItem.updateMany({
        where: {
          id: item.foodItemId,
          stock: { gte: item.quantity },
          isActive: true,
        },
        data: { stock: { decrement: item.quantity } },
      })
      if (updated.count === 0) {
        throw new ValidationError('Insufficient stock', {
          foodItemId: item.foodItemId,
        })
      }
    }

    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: userId,
        deliveryAddressId,
        status: 'PENDING',
        notes: data.notes,
        imageUrl: data.proofImageUrl ?? data.imageUrl,
        totalPrice: total,
      },
    })

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        from: null,
        to: 'PENDING',
        changedById: userId,
        note: 'Order created',
      },
    })

    await tx.orderItem.createMany({
      data: data.items.map((item) => {
        const entry = itemMap.get(item.foodItemId)
        return {
          orderId: order.id,
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          unitPrice: entry?.price || new Prisma.Decimal(0),
        }
      }),
    })

    await tx.auditLog.create({
      data: {
        entityType: 'ORDER',
        entityId: order.id,
        action: 'CREATE',
        actorId: userId,
        ipAddress: ip,
        details: {
          items: data.items,
          result: 'SUCCESS',
          actorName: user.name,
        },
      },
    })

    return { orderId: order.id, deliveryAddressId }
  })

  let addressText = 'Saved delivery address on file'
  if (data.deliveryAddress) {
    const line2 = data.deliveryAddress.line2 ? `, ${data.deliveryAddress.line2}` : ''
    addressText = `${data.deliveryAddress.line1}${line2}, ${data.deliveryAddress.city} ${data.deliveryAddress.postalCode}`
  } else if (result.deliveryAddressId) {
    const address = await prisma.address.findUnique({
      where: { id: result.deliveryAddressId },
      select: {
        line1: true,
        line2: true,
        city: true,
        postalCode: true,
      },
    })
    if (address) {
      const line2 = address.line2 ? `, ${address.line2}` : ''
      addressText = `${address.line1}${line2}, ${address.city} ${address.postalCode}`
    }
  }

  const emailItems = data.items.map((item) => {
    const entry = itemMap.get(item.foodItemId)
    return {
      name: entry?.name || 'Item',
      quantity: item.quantity,
      price: Number(entry?.price || 0),
    }
  })

    const { html, text } = buildOrderConfirmationEmail({
      name: user.name,
      orderNumber,
      placedAt: new Date().toLocaleString(),
      items: emailItems,
      address: addressText,
      totalPrice: Number(total.toString()),
      trackingUrl: `${appUrl}/orders/${orderNumber}`,
      supportPhone,
      eta,
      unsubscribeUrl,
    })

  try {
    await sendWithRetry(3, () =>
      sendEmail({
        to: user.email,
        subject: `Order #${orderNumber} Confirmed - Your food will arrive soon`,
        html,
        text,
      }),
    )
  } catch (error) {
    console.error('Order confirmation email failed', error)
  }

  if (notifyEmail) {
    const { html, text } = buildOrderNotificationEmail({
      orderNumber,
      customerName: user.name,
      totalPrice: Number(total.toString()),
      items: emailItems,
    })
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `New order ${orderNumber}`,
        html,
        text,
      })
    } catch (error) {
      console.error('Order notification email failed', error)
    }
  }

  return ApiResponse.success(
    {
      orderId: result.orderId,
      orderNumber,
    },
    'Order created',
  )
}

export const POST = withErrorHandler(postHandler)

async function getHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const { searchParams } = request.nextUrl
  const query = getOrdersQuerySchema.parse(Object.fromEntries(searchParams))
  const search = searchParams.get('search')?.trim()

  const where: Prisma.OrderWhereInput = {}
  if (authRequest.user.role !== 'ADMIN') {
    where.customerId = userId
  } else if (query.customerId) {
    where.customerId = query.customerId
  }

  if (query.status) {
    where.status = query.status
  }

  if (query.fromDate || query.toDate) {
    where.createdAt = {}
    if (query.fromDate) {
      where.createdAt.gte = query.fromDate
    }
    if (query.toDate) {
      where.createdAt.lte = query.toDate
    }
  }

  if (search) {
    where.orderNumber = {
      contains: search,
      mode: 'insensitive',
    }
  }

  const total = await prisma.order.count({ where })
  const orders = await prisma.order.findMany({
    where,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalPrice: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  })

  return ApiResponse.success(orders, undefined, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  })
}

export const GET = withErrorHandler(getHandler)


