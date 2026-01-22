import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  AssignServiceBody,
  ServiceActionSuccessResponse,
  ServiceIdParams,
} from '@/src/lib/schemas/services'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Assign Service Request (Admin)
 *
 * @description Assigns a staff member to a service request.
 * Creates a ServiceAssignment and sets request status to ASSIGNED.
 *
 * @pathParams ServiceIdParams
 * @body AssignServiceBody
 * @response 200:ServiceActionSuccessResponse:Service assigned
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Services
 * @openapi
 */
export const POST = withErrorHandler(async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authRequest = await requireAdmin(request)
  ServiceIdParams.parse(params)

  const serviceId = Number(params.id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  const body = await request.json()
  const data = await validateBody(body, AssignServiceBody)

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: { id: true, status: true },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  if (service.status === 'CANCELED' || service.status === 'RESOLVED') {
    return ApiResponse.badRequest('Cannot assign a completed/canceled service')
  }

  const staff = await prisma.user.findUnique({
    where: { id: data.staffId },
    select: { id: true, role: true, status: true },
  })

  if (!staff) {
    return ApiResponse.badRequest('Invalid staff id')
  }

  if (staff.role === 'CUSTOMER') {
    return ApiResponse.badRequest('Staff member must not be a CUSTOMER')
  }

  if (staff.status !== 'ACTIVE') {
    return ApiResponse.badRequest('Staff member must be ACTIVE')
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.serviceAssignment.create({
      data: {
        serviceId,
        staffId: data.staffId,
        assignedById: Number(authRequest.user.id),
        notes: data.notes ?? undefined,
        status: 'ASSIGNED',
      },
    })

    const updatedService = await tx.serviceRequest.update({
      where: { id: serviceId },
      data: { status: 'ASSIGNED' },
    })

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'STATUS_CHANGE',
        actorId: Number(authRequest.user.id),
        details: {
          from: service.status,
          to: 'ASSIGNED',
          staffId: data.staffId,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return updatedService
  })

  const detail = await prisma.serviceRequest.findUnique({
    where: { id: updated.id },
    include: {
      photos: true,
      assignments: true,
    },
  })

  const payload = {
    success: true as const,
    data: detail!,
    message: 'Service assigned',
  }

  ServiceActionSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})
