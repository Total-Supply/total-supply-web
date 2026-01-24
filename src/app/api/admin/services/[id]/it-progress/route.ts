import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  ItProgressBody,
  ServiceActionSuccessResponse,
  ServiceIdParams,
} from '@/src/lib/schemas/services'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * IT Progress Update (Admin)
 *
 * @description Adds IT progress update including time spent and photos.
 *
 * @pathParams ServiceIdParams
 * @body ItProgressBody
 * @response 200:ServiceActionSuccessResponse:IT progress updated
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Services
 * @openapi
 */
export const POST = withErrorHandler(async function POST(
  request: NextRequest,
  { params }: Params,
) {
  const authRequest = await requireAdmin(request)
  const { id } = await params
  ServiceIdParams.parse({ id })

  const serviceId = Number(id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  const body = await request.json()
  const data = await validateBody(body, ItProgressBody)

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: { id: true, status: true },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  if (service.status === 'CANCELED' || service.status === 'RESOLVED') {
    return ApiResponse.badRequest(
      'Cannot update IT progress for closed service',
    )
  }

  await prisma.$transaction(async (tx) => {
    const latestAssignment = await tx.serviceAssignment.findFirst({
      where: { serviceId },
      orderBy: { assignedAt: 'desc' },
    })

    if (!latestAssignment) {
      throw new Error('Service is not assigned yet')
    }

    await tx.serviceRequest.update({
      where: { id: serviceId },
      data: {
        status: 'IN_PROGRESS',
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    })

    await tx.serviceAssignment.update({
      where: { id: latestAssignment.id },
      data: {
        status: 'IN_PROGRESS',
        ...(latestAssignment.startedAt ? {} : { startedAt: new Date() }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.timeSpentMinutes !== undefined && {
          timeSpentMinutes:
            (latestAssignment.timeSpentMinutes ?? 0) + data.timeSpentMinutes,
        }),
      },
    })

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
          update: 'it-progress',
          timeSpentMinutes: data.timeSpentMinutes ?? 0,
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
    message: 'IT progress updated',
  }

  ServiceActionSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})
