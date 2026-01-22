import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  ProgressServiceBody,
  ServiceActionSuccessResponse,
  ServiceIdParams,
} from '@/src/lib/schemas/services'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Progress Service Request (Admin)
 *
 * @description Adds progress notes/photos and sets status to IN_PROGRESS.
 *
 * @pathParams ServiceIdParams
 * @body ProgressServiceBody
 * @response 200:ServiceActionSuccessResponse:Progress updated
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
  const data = await validateBody(body, ProgressServiceBody)

  const existing = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: { id: true, status: true },
  })

  if (!existing) {
    return ApiResponse.notFound('Service request not found')
  }

  if (existing.status === 'CANCELED' || existing.status === 'RESOLVED') {
    return ApiResponse.badRequest(
      'Cannot progress a completed/canceled service',
    )
  }

  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({
      where: { id: serviceId },
      data: {
        status: 'IN_PROGRESS',
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    })

    const latestAssignment = await tx.serviceAssignment.findFirst({
      where: { serviceId },
      orderBy: { assignedAt: 'desc' },
      select: { id: true, startedAt: true },
    })

    if (latestAssignment) {
      await tx.serviceAssignment.update({
        where: { id: latestAssignment.id },
        data: {
          ...(latestAssignment.startedAt ? {} : { startedAt: new Date() }),
          status: 'IN_PROGRESS',
          ...(data.notes !== undefined && { notes: data.notes }),
        },
      })
    }

    if (data.photos?.length) {
      await tx.servicePhoto.createMany({
        data: data.photos.map((url) => ({
          serviceId,
          url,
          type: 'PROGRESS',
        })),
      })
    }

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'UPDATE',
        actorId: Number(authRequest.user.id),
        details: {
          result: 'SUCCESS',
          actorName: authRequest.user.name,
          update: 'progress',
          photosAdded: data.photos?.length ?? 0,
        },
      },
    })
  })

  const detail = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    include: { photos: true, assignments: true },
  })

  const payload = {
    success: true as const,
    data: detail!,
    message: 'Progress updated',
  }

  ServiceActionSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})
