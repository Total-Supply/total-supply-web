import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { rateServiceSchema } from '@/src/lib/validations/service.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = {
  params: { id: string }
}

/**
 * Rate Service Request (Customer)
 *
 * @description Allows the customer to rate a completed service request.
 * Uses the same validation schema rateServiceSchema.
 *
 * @pathParams ServiceIdParams
 * @body RateServiceBody
 * @response 201 - RateServiceSuccessResponse - Rating created
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

  const serviceId = Number(params.id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  const body = await request.json()
  const data = await validateBody(body, rateServiceSchema)

  if (data.serviceId !== serviceId) {
    return ApiResponse.badRequest('serviceId must match the route id')
  }

  const service = await prisma.serviceRequest.findFirst({
    where: { id: serviceId, customerId },
    include: {
      assignments: { orderBy: { assignedAt: 'desc' }, take: 1 },
    },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  if (service.status !== 'RESOLVED') {
    return ApiResponse.badRequest('You can rate only completed services')
  }

  const staffId =
    data.staffId ??
    (service.assignments.length ? service.assignments[0].staffId : undefined)

  try {
    const rating = await prisma.serviceRating.create({
      data: {
        serviceId,
        customerId,
        staffId: staffId ?? undefined,
        score: data.score,
        review: data.review ?? undefined,
        wouldRecommend: data.wouldRecommend ?? false,
      },
    })

    await prisma.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'CREATE',
        actorId: customerId,
        details: {
          result: 'SUCCESS',
          actorName: authRequest.user.name,
          ratingScore: data.score,
          wouldRecommend: data.wouldRecommend ?? false,
        },
      },
    })

    return ApiResponse.success(
      {
        ...rating,
        createdAt: rating.createdAt.toISOString(),
      },
      'Rating submitted',
      undefined,
      201,
    )
  } catch (error: unknown) {
    // Prisma unique constraint: @@unique([serviceId, customerId])
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      return ApiResponse.conflict('You have already rated this service')
    }
    throw error
  }
}

export const POST = withErrorHandler(handler)
