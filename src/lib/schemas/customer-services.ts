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
 * Get My Service Request (Details)
 *
 * @description Returns a single service request owned by the authenticated customer.
 *
 * @pathParams ServiceIdParams
 * @response 200 - GetCustomerServiceSuccessResponse - Service details
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
    include: {
      photos: true,
      assignments: { orderBy: { assignedAt: 'desc' }, take: 1 },
    },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  const dto = {
    id: service.id,
    requestNumber: service.requestNumber,
    type: service.type,
    category: service.category ?? null,
    status: service.status,
    priority: service.priority,
    title: service.title,
    description: service.description,
    addressId: service.addressId ?? null,
    requestedDate: toISO(service.requestedDate),
    notes: service.notes ?? null,
    photos: service.photos.map((p) => ({
      id: p.id,
      url: p.url,
      type: p.type,
      createdAt: p.createdAt.toISOString(),
    })),
    latestAssignment: service.assignments.length
      ? {
          id: service.assignments[0].id,
          staffId: service.assignments[0].staffId,
          status: service.assignments[0].status,
          assignedAt: service.assignments[0].assignedAt.toISOString(),
        }
      : null,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  }

  return ApiResponse.success(dto)
}

export const GET = withErrorHandler(handler)
