import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  createOrderSchema,
  getOrdersQuerySchema,
} from '@/src/lib/validations/order.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

function generateOrderNumber() {
  const ts = Date.now().toString().slice(-8)
  const rnd = Math.floor(Math.random() * 9000 + 1000)
  return `ORD-${ts}-${rnd}`
}

/**
 * List My Orders
 *
 * @description Returns paginated list of orders for the authenticated customer.
 *
 * @params ListCustomerOrdersQuery
 * @response 200 - ListCustomerOrdersSuccessResponse - Orders list
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Orders
 * @openapi
 */
async function listOrdersHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = Number(authRequest.user.id)

  const queryObj = Object.fromEntries(request.nextUrl.searchParams.entries())
  const query = getOrdersQuerySchema.parse(queryObj)

  const where: Prisma.OrderWhereInput = {
    customerId: userId,
  }

  if (query.status) {
    where.status = query.status
  }

  const total = await prisma.order.count({ where })

  const orders = await prisma.order.findMany({
    where,
    include: {
      deliveryAddress: true,
      items: {
        include: {
          foodItem: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { [query.sortBy]: query.sortOrder },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  })

  const mapped = orders.map((o) => ({
    ...o,
    totalPrice: Number(o.totalPrice),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    deliveryAddress: o.deliveryAddress
      ? {
          ...o.deliveryAddress,
          line2: o.deliveryAddress.line2 ?? null,
          label: o.deliveryAddress.label ?? null,
        }
      : null,
    items: o.items.map((it) => ({
      ...it,
      unitPrice: Number(it.unitPrice),
    })),
  }))

  return ApiResponse.success(mapped, undefined, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  })
}

/**
 * Create Order
 *
 * @description Creates a new order for the authenticated customer. Calculates totalPrice from food items.
 * Supports selecting an existing saved address or providing a new address inline.
 *
 * @body CreateOrderBody
 * @response 201 - CreateOrderSuccessResponse - Order created
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Orders
 * @openapi
 */
async function createOrderHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = Number(authRequest.user.id)

  const body = await request.json()
  const data = await validateBody(body, createOrderSchema)

  // Resolve delivery address
  let deliveryAddressId: number | null = null

  if (data.deliveryAddressId) {
    const address = await prisma.address.findFirst({
      where: { id: data.deliveryAddressId, userId },
      select: { id: true },
    })
    if (!address) {
      return ApiResponse.notFound('Delivery address not found')
    }

    deliveryAddressId = address.id

    if (data.saveAsDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
      await prisma.address.update({
        where: { id: deliveryAddressId },
        data: { isDefault: true },
      })
    }
  } else if (data.deliveryAddress) {
    if (data.saveAsDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const createdAddress = await prisma.address.create({
      data: {
        userId,
        label: data.deliveryAddress.label ?? undefined,
        line1: data.deliveryAddress.line1,
        line2: data.deliveryAddress.line2 ?? undefined,
        city: data.deliveryAddress.city,
        postalCode: data.deliveryAddress.postalCode,
        country: data.deliveryAddress.country ?? 'Sri Lanka',
        isDefault: data.saveAsDefault ?? false,
      },
      select: { id: true },
    })

    deliveryAddressId = createdAddress.id
  }

  // Validate food items + compute total
  const qtyMap = new Map<number, number>()
  for (const it of data.items) {
    qtyMap.set(it.foodItemId, (qtyMap.get(it.foodItemId) || 0) + it.quantity)
  }

  const itemIds = Array.from(qtyMap.keys())

  const foodItems = await prisma.foodItem.findMany({
    where: {
      id: { in: itemIds },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  })

  if (foodItems.length !== itemIds.length) {
    return ApiResponse.badRequest('Invalid food item selection')
  }

  for (const fi of foodItems) {
    const requestedQty = qtyMap.get(fi.id) || 0
    if (fi.stock < requestedQty) {
      return ApiResponse.conflict(`Out of stock: ${fi.name}`)
    }
  }

  let total = new Prisma.Decimal(0)
  for (const fi of foodItems) {
    const q = qtyMap.get(fi.id) || 0
    total = total.plus(fi.price.mul(q))
  }

  const orderNumber = generateOrderNumber()

  const created = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: userId,
        deliveryAddressId: deliveryAddressId ?? undefined,
        notes: data.notes ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
        totalPrice: total,
        status: 'PENDING',
      },
    })

    await tx.orderItem.createMany({
      data: foodItems.map((fi) => ({
        orderId: order.id,
        foodItemId: fi.id,
        quantity: qtyMap.get(fi.id) || 0,
        unitPrice: fi.price,
      })),
    })

    // decrement stock
    for (const fi of foodItems) {
      const q = qtyMap.get(fi.id) || 0
      if (q > 0) {
        await tx.foodItem.update({
          where: { id: fi.id },
          data: { stock: { decrement: q } },
        })
      }
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        from: null,
        to: 'PENDING',
        changedById: userId,
        note: 'Order created',
      },
    })

    await tx.auditLog.create({
      data: {
        entityType: 'ORDER',
        entityId: order.id,
        action: 'CREATE',
        actorId: userId,
        details: {
          result: 'SUCCESS',
          actorName: authRequest.user.name,
          orderNumber: order.orderNumber,
        },
      },
    })

    return order
  })

  const full = await prisma.order.findUnique({
    where: { id: created.id },
    include: {
      deliveryAddress: true,
      items: {
        include: {
          foodItem: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  })

  if (!full) {
    return ApiResponse.internalError('Order created but could not be loaded')
  }

  const mapped = {
    ...full,
    totalPrice: Number(full.totalPrice),
    createdAt: full.createdAt.toISOString(),
    updatedAt: full.updatedAt.toISOString(),
    deliveryAddress: full.deliveryAddress
      ? {
          ...full.deliveryAddress,
          line2: full.deliveryAddress.line2 ?? null,
          label: full.deliveryAddress.label ?? null,
        }
      : null,
    items: full.items.map((it) => ({
      ...it,
      unitPrice: Number(it.unitPrice),
    })),
  }

  return ApiResponse.created(mapped, 'Order created')
}

export const GET = withErrorHandler(listOrdersHandler)
export const POST = withErrorHandler(createOrderHandler)
