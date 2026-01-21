import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  ItCompleteBody,
  ServiceActionSuccessResponse,
  ServiceIdParams,
} from '@/src/lib/schemas/services'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Complete Service Request (IT) - Admin
 *
 * @description Marks IT service request as RESOLVED and stores completion details.
 *
 * @pathParams ServiceIdParams
 * @body ItCompleteBody
 * @response 200:ServiceActionSuccessResponse:IT service completed
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
  const data = await validateBody(body, ItCompleteBody)

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: { id: true, status: true },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  if (service.status === 'CANCELED' || service.status === 'RESOLVED') {
    return ApiResponse.badRequest('Service is already closed')
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
      data: { status: 'RESOLVED' },
    })

    await tx.serviceAssignment.update({
      where: { id: latestAssignment.id },
      data: {
        status: 'RESOLVED',
        completedAt: new Date(),
        completionNotes: data.completionNotes,
        solutionSummary: data.solutionSummary,
        followUpRecommendations: data.followUpRecommendations ?? undefined,
      },
    })

    await tx.servicePhoto.createMany({
      data: data.photos.map((url) => ({
        serviceId,
        url,
        type: 'AFTER',
      })),
    })

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'STATUS_CHANGE',
        actorId: Number(authRequest.user.id),
        details: {
          from: service.status,
          to: 'RESOLVED',
          result: 'SUCCESS',
          actorName: authRequest.user.name,
          photosAdded: data.photos.length,
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
    message: 'IT service completed',
  }

  ServiceActionSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})
