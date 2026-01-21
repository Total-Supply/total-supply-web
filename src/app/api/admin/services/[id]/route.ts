import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  DeleteServiceSuccessResponse,
  ServiceIdParams,
  UpdateServiceRequestBody,
  UpdateServiceSuccessResponse,
} from '@/src/lib/schemas/services'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Update Service Request (Admin)
 *
 * @description Updates a service request by ID (Admin only).
 *
 * @pathParams ServiceIdParams
 * @body UpdateServiceRequestBody
 * @response 200:UpdateServiceSuccessResponse:Service updated
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Services
 * @openapi
 */
export const PUT = withErrorHandler(async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAdmin(request)

  ServiceIdParams.parse(params)

  const serviceId = Number(params.id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  const body = await request.json()
  const data = await validateBody(body, UpdateServiceRequestBody)

  const updated = await prisma.serviceRequest.update({
    where: { id: serviceId },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  })

  const payload = {
    success: true as const,
    data: updated,
    message: 'Service updated',
  }

  UpdateServiceSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})

/**
 * Cancel Service Request (Admin)
 *
 * @description Cancels a service request by setting status = CANCELED.
 * (This is safer than deleting because ServiceRequest has related records.)
 *
 * @pathParams ServiceIdParams
 * @response 200:DeleteServiceSuccessResponse:Service deleted/canceled
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Services
 * @openapi
 */
export const DELETE = withErrorHandler(async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAdmin(request)

  ServiceIdParams.parse(params)

  const serviceId = Number(params.id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  await prisma.serviceRequest.update({
    where: { id: serviceId },
    data: {
      status: 'CANCELED',
    },
  })

  const payload = {
    success: true as const,
    data: { id: serviceId },
    message: 'Service deleted',
  }

  DeleteServiceSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})
