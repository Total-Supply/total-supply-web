import {
  Prisma,
  ServicePriority,
  ServiceStatus,
  ServiceType,
} from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { createServiceRequestSchema } from '@/src/lib/validations/service.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

function generateServiceRequestNumber() {
  const ts = Date.now().toString().slice(-8)
  const rnd = Math.floor(Math.random() * 9000 + 1000)
  return `SR-${ts}-${rnd}`
}

function toISO(d: Date | null | undefined) {
  return d ? d.toISOString() : null
}

/**
 * List My Service Requests
 *
 * @description Returns the authenticated customer's service requests (paginated).
 *
 * @params ListCustomerServicesQuery
 * @response 200 - ListCustomerServicesSuccessResponse - Service requests list
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Services
 * @openapi
 */
async function listHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const customerId = Number(authRequest.user.id)

  const searchParams = request.nextUrl.searchParams

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const status = searchParams.get('status')
  const type = searchParams.get('type')
  const priority = searchParams.get('priority')

  const where: Prisma.ServiceRequestWhereInput = { customerId }

  // Ensure status is cast to the correct enum type
  if (status && status in ServiceStatus) {
    where.status = status as ServiceStatus
  }
  if (type && type in ServiceType) where.type = type as ServiceType
  if (priority && priority in ServicePriority)
    where.priority = priority as ServicePriority

  const total = await prisma.serviceRequest.count({ where })

  const services = await prisma.serviceRequest.findMany({
    where,
    include: {
      photos: true,
      assignments: {
        orderBy: { assignedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  const mapped = services.map((s) => ({
    id: s.id,
    requestNumber: s.requestNumber,
    type: s.type,
    category: s.category ?? null,
    status: s.status,
    priority: s.priority,
    title: s.title,
    description: s.description,
    addressId: s.addressId ?? null,
    requestedDate: toISO(s.requestedDate),
    notes: s.notes ?? null,
    photos: s.photos.map((p) => ({
      id: p.id,
      url: p.url,
      type: p.type,
      createdAt: p.createdAt.toISOString(),
    })),
    latestAssignment: s.assignments.length
      ? {
          id: s.assignments[0].id,
          staffId: s.assignments[0].staffId,
          status: s.assignments[0].status,
          assignedAt: s.assignments[0].assignedAt.toISOString(),
        }
      : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))

  return ApiResponse.success(mapped, undefined, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
}

/**
 * Create Service Request (Customer)
 *
 * @description Creates a new service request for the authenticated customer.
 * Supports using saved addressId or an inline address object.
 *
 * @body CreateCustomerServiceBody
 * @response 201 - CreateCustomerServiceSuccessResponse - Service request created
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Services
 * @openapi
 */
async function createHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const customerId = Number(authRequest.user.id)

  const body = await request.json()
  const data = await validateBody(body, createServiceRequestSchema)

  // Resolve address (optional)
  let addressId: number | undefined

  if (data.addressId) {
    const existing = await prisma.address.findFirst({
      where: { id: data.addressId, userId: customerId },
      select: { id: true },
    })
    if (!existing) {
      return ApiResponse.notFound('Address not found')
    }

    addressId = existing.id

    if (data.saveAsDefault) {
      await prisma.address.updateMany({
        where: { userId: customerId },
        data: { isDefault: false },
      })
      await prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      })
    }
  } else if (data.address) {
    if (data.saveAsDefault) {
      await prisma.address.updateMany({
        where: { userId: customerId },
        data: { isDefault: false },
      })
    }

    const createdAddr = await prisma.address.create({
      data: {
        userId: customerId,
        label: data.address.label ?? undefined,
        line1: data.address.line1,
        line2: data.address.line2 ?? undefined,
        city: data.address.city,
        postalCode: data.address.postalCode,
        country: data.address.country ?? 'Sri Lanka',
        isDefault: data.saveAsDefault ?? false,
      },
      select: { id: true },
    })

    addressId = createdAddr.id
  }

  // Validate serviceOfferingId (optional)
  if (data.serviceOfferingId) {
    const offering = await prisma.serviceOffering.findUnique({
      where: { id: data.serviceOfferingId },
      select: { id: true, isActive: true, type: true, category: true },
    })

    if (!offering || !offering.isActive) {
      return ApiResponse.badRequest('Invalid service offering selection')
    }

    if (offering.type !== data.type) {
      return ApiResponse.badRequest('Service offering type mismatch')
    }

    if (
      data.category &&
      offering.category &&
      data.category !== offering.category
    ) {
      return ApiResponse.badRequest('Service offering category mismatch')
    }
  }

  const requestNumber = generateServiceRequestNumber()

  const title =
    data.title ??
    (data.type === 'IT_SUPPORT'
      ? 'IT Support Request'
      : 'Cleaning Service Request')

  const created = await prisma.$transaction(async (tx) => {
    const service = await tx.serviceRequest.create({
      data: {
        requestNumber,
        customerId,
        type: data.type,
        category: data.category ?? undefined,
        serviceOfferingId: data.serviceOfferingId ?? undefined,
        title,
        description: data.description,
        addressId: addressId ?? undefined,
        requestedDate: data.requestedDate ?? undefined,
        priority: data.priority ?? 'MEDIUM',
        notes: data.notes ?? undefined,
      },
    })

    if (data.beforePhotos?.length) {
      await tx.servicePhoto.createMany({
        data: data.beforePhotos.map((url) => ({
          serviceId: service.id,
          url,
          type: 'BEFORE',
        })),
      })
    }

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: service.id,
        action: 'CREATE',
        actorId: customerId,
        details: {
          result: 'SUCCESS',
          actorName: authRequest.user.name,
          requestNumber: service.requestNumber,
        },
      },
    })

    return service
  })

  const full = await prisma.serviceRequest.findUnique({
    where: { id: created.id },
    include: {
      photos: true,
      assignments: { orderBy: { assignedAt: 'desc' }, take: 1 },
    },
  })

  if (!full) {
    return ApiResponse.internalError(
      'Service request created but could not be loaded',
    )
  }

  const responseDto = {
    id: full.id,
    requestNumber: full.requestNumber,
    type: full.type,
    category: full.category ?? null,
    status: full.status,
    priority: full.priority,
    title: full.title,
    description: full.description,
    addressId: full.addressId ?? null,
    requestedDate: toISO(full.requestedDate),
    notes: full.notes ?? null,
    photos: full.photos.map((p) => ({
      id: p.id,
      url: p.url,
      type: p.type,
      createdAt: p.createdAt.toISOString(),
    })),
    latestAssignment: full.assignments.length
      ? {
          id: full.assignments[0].id,
          staffId: full.assignments[0].staffId,
          status: full.assignments[0].status,
          assignedAt: full.assignments[0].assignedAt.toISOString(),
        }
      : null,
    createdAt: full.createdAt.toISOString(),
    updatedAt: full.updatedAt.toISOString(),
  }

  return ApiResponse.created(responseDto, 'Service request created')
}

export const GET = withErrorHandler(listHandler)
export const POST = withErrorHandler(createHandler)
