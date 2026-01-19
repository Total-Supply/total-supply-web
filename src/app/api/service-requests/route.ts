import { ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildServiceRequestEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { isCityServiceable } from '@/src/lib/service-area'
import { createServiceRequestSchema } from '@/src/lib/validations/service.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const REQUEST_PREFIX = 'SRV'

const generateRequestNumber = () => {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${REQUEST_PREFIX}-${datePart}-${randomPart}`
}

const getUniqueRequestNumber = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateRequestNumber()
    const existing = await prisma.serviceRequest.findUnique({
      where: { requestNumber: candidate },
      select: { id: true },
    })
    if (!existing) {
      return candidate
    }
  }
  throw new ValidationError('Unable to generate request number')
}

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const body = await request.json()
  const data = await validateBody(body, createServiceRequestSchema)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, unsubscribeToken: true },
  })

  let offering:
    | {
        id: number
        name: string
        type: string
        category: string | null
        isActive: boolean
      }
    | null = null

  if (data.serviceOfferingId) {
    offering = await prisma.serviceOffering.findUnique({
      where: { id: data.serviceOfferingId },
      select: {
        id: true,
        name: true,
        type: true,
        category: true,
        isActive: true,
      },
    })
    if (!offering || !offering.isActive) {
      throw new ValidationError('Selected service package is unavailable')
    }
    if (offering.type !== data.type) {
      throw new ValidationError('Selected service package does not match type')
    }
  }

  const requestNumber = await getUniqueRequestNumber()
  let addressId = data.addressId

  if (addressId) {
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true, city: true },
    })
    if (!existing) {
      throw new ValidationError('Invalid address')
    }
    if (!isCityServiceable(existing.city)) {
      throw new ValidationError('Address is outside service area', {
        city: existing.city,
      })
    }
  } else if (data.address) {
    if (!isCityServiceable(data.address.city)) {
      throw new ValidationError('Address is outside service area', {
        city: data.address.city,
      })
    }
    if (data.saveAsDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }
    const created = await prisma.address.create({
      data: {
        userId,
        label: data.address.label,
        line1: data.address.line1,
        line2: data.address.line2,
        city: data.address.city,
        postalCode: data.address.postalCode,
        country: data.address.country,
        isDefault: data.saveAsDefault ?? data.address.isDefault,
      },
      select: { id: true },
    })
    addressId = created.id
  }

  if (!addressId) {
    throw new ValidationError('Address is required')
  }

  const title =
    data.title ||
    offering?.name ||
    `${data.type === 'IT_SUPPORT' ? 'IT Support' : 'Cleaning'} request`

  const result = await prisma.$transaction(async (tx) => {
    const request = await tx.serviceRequest.create({
      data: {
        requestNumber,
        customerId: userId,
        type: data.type,
        category: (data.category ?? offering?.category ?? undefined) as import('@/generated/prisma').ServiceCategory | null | undefined,
        status: 'RECEIVED',
        priority: data.priority,
        title,
        description: data.description,
        addressId,
        requestedDate: data.requestedDate ?? undefined,
        notes: data.notes,
        serviceOfferingId: offering?.id ?? undefined,
      },
    })

    if (data.beforePhotos?.length) {
      await tx.servicePhoto.createMany({
        data: data.beforePhotos.map((url) => ({
          serviceId: request.id,
          url,
          type: 'BEFORE',
        })),
      })
    }

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: request.id,
        action: 'CREATE',
        actorId: userId,
        details: {
          type: data.type,
          priority: data.priority,
          category: data.category ?? offering?.category ?? undefined,
          serviceOfferingId: offering?.id ?? undefined,
          result: 'SUCCESS',
          actorName: user?.name,
        },
      },
    })

    return request
  })

  if (user) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const unsubscribeUrl = user.unsubscribeToken
      ? `${appUrl}/unsubscribe?token=${user.unsubscribeToken}`
      : undefined
    const { html, text } = buildServiceRequestEmail({
      name: user.name,
      requestNumber,
      type: data.type,
      requestedDate: data.requestedDate
        ? new Date(data.requestedDate).toLocaleString()
        : undefined,
      priority: data.priority,
      unsubscribeUrl,
    })
    try {
      await sendEmail({
        to: user.email,
        subject: `Service request ${requestNumber} received`,
        html,
        text,
      })
    } catch (error) {
      console.error('Service request email failed', error)
    }
  }

  return ApiResponse.success(
    {
      id: result.id,
      requestNumber,
    },
    'Service request created',
  )
}

export const POST = withErrorHandler(handler)

async function getHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const { searchParams } = request.nextUrl

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const type = searchParams.get('type')
  const priority = searchParams.get('priority')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const allowedSortBy = new Set(['createdAt', 'priority', 'status'])
  const safeSortBy = allowedSortBy.has(sortBy) ? sortBy : 'createdAt'
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

  const where: Record<string, unknown> = {}

  if (authRequest.user.role !== 'ADMIN') {
    where.customerId = userId
  }

  if (type) {
    where.type = type
  }
  if (priority) {
    where.priority = priority
  }
  if (status) {
    where.status = status
  }
  if (search) {
    const orConditions: Record<string, unknown>[] = [
      { requestNumber: { contains: search, mode: 'insensitive' } },
      { title: { contains: search, mode: 'insensitive' } },
    ]
    if (authRequest.user.role === 'ADMIN') {
      orConditions.push({
        customer: { name: { contains: search, mode: 'insensitive' } },
      })
      orConditions.push({
        customer: { email: { contains: search, mode: 'insensitive' } },
      })
    }
    where.OR = orConditions
  }

  const total = await prisma.serviceRequest.count({ where })
  const requests = await prisma.serviceRequest.findMany({
    where,
    select: {
      id: true,
      requestNumber: true,
      type: true,
      category: true,
      status: true,
      priority: true,
      title: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      [safeSortBy]: safeSortOrder,
    },
    skip: (page - 1) * limit,
    take: limit,
  })

  return ApiResponse.success(requests, undefined, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
}

export const GET = withErrorHandler(getHandler)


