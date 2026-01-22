import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

function toISO(d: Date | null | undefined) {
  return d ? d.toISOString() : null
}

/**
 * Cancel My Service Request
 *
 * @description Cancels a service request owned by the authenticated customer.
 * Only allowed if the service is not RESOLVED/CANCELED.
 *
 * @pathParams ServiceIdParams
 * @response 200 - CancelCustomerServiceSuccessResponse - Canceled service
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Services
 * @openapi
 */
async function handler(request: NextRequest, { params }: Params) {
  const authRequest = await requireAuth(request)
  const customerId = Number(authRequest.user.id)

  const { id } = await params
  const serviceId = Number(id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  const service = await prisma.serviceRequest.findFirst({
    where: { id: serviceId, customerId },
    select: { id: true, status: true, requestNumber: true },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  if (service.status === 'RESOLVED') {
    return ApiResponse.badRequest('Completed services cannot be canceled')
  }
  if (service.status === 'CANCELED') {
    return ApiResponse.conflict('Service is already canceled')
  }

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.serviceRequest.update({
      where: { id: serviceId },
      data: { status: 'CANCELED' },
    })

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'STATUS_CHANGE',
        actorId: customerId,
        details: {
          result: 'SUCCESS',
          actorName: authRequest.user.name,
          from: service.status,
          to: 'CANCELED',
          requestNumber: service.requestNumber,
          trigger: 'customer_cancel',
        },
      },
    })

    return u
  })

  const full = await prisma.serviceRequest.findUnique({
    where: { id: updated.id },
    include: {
      photos: true,
      assignments: { orderBy: { assignedAt: 'desc' }, take: 1 },
    },
  })

  if (!full) {
    return ApiResponse.internalError('Canceled but could not reload service')
  }

  const dto = {
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

  return ApiResponse.success(dto, 'Service canceled')
}

export const PUT = withErrorHandler(handler)
