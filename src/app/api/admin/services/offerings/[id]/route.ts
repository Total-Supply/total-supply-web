import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  DeleteServiceOfferingSuccessResponse,
  GetServiceOfferingSuccessResponse,
  ServiceOfferingIdParams,
  UpdateServiceOfferingBody,
  UpdateServiceOfferingSuccessResponse,
} from '@/src/lib/schemas/service-offerings'
import { slugify } from '@/src/lib/utils'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Get Service Offering by ID
 *
 * @description Fetch a single service offering (ADMIN only).
 *
 * @pathParams ServiceOfferingIdParams
 * @response 200:GetServiceOfferingSuccessResponse:Offering fetched
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag ServiceOfferings
 * @openapi
 */
export const GET = withErrorHandler(async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAdmin(request)

  ServiceOfferingIdParams.parse(params)
  const offeringId = parseInt(params.id, 10)

  if (!Number.isFinite(offeringId)) {
    return ApiResponse.badRequest('Invalid service offering ID')
  }

  const offering = await prisma.serviceOffering.findUnique({
    where: { id: offeringId },
  })

  if (!offering) {
    return ApiResponse.notFound('Service offering not found')
  }

  const payload = { success: true as const, data: offering }
  GetServiceOfferingSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data)
})

/**
 * Update Service Offering
 *
 * @description Updates a service offering by ID (ADMIN only).
 *
 * @pathParams ServiceOfferingIdParams
 * @body UpdateServiceOfferingBody
 * @response 200:UpdateServiceOfferingSuccessResponse:Offering updated
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag ServiceOfferings
 * @openapi
 */
export const PATCH = withErrorHandler(async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAdmin(request)

  ServiceOfferingIdParams.parse(params)
  const offeringId = parseInt(params.id, 10)

  if (!Number.isFinite(offeringId)) {
    return ApiResponse.badRequest('Invalid service offering ID')
  }

  const body = await request.json()
  const data = await validateBody(body, UpdateServiceOfferingBody)

  const slug = data.slug ? slugify(data.slug) : undefined

  if (slug) {
    const existing = await prisma.serviceOffering.findFirst({
      where: { slug, NOT: { id: offeringId } },
      select: { id: true },
    })
    if (existing) {
      return ApiResponse.conflict('Service offering slug already exists')
    }
  }

  const offering = await prisma.serviceOffering.update({
    where: { id: offeringId },
    data: {
      ...(data.name && { name: data.name }),
      ...(slug && { slug }),
      ...(data.type && { type: data.type }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  })

  const payload = {
    success: true as const,
    data: offering,
    message: 'Service offering updated',
  }

  UpdateServiceOfferingSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})

/**
 * Delete Service Offering
 *
 * @description Deletes a service offering by ID (ADMIN only).
 *
 * @pathParams ServiceOfferingIdParams
 * @response 200:DeleteServiceOfferingSuccessResponse:Offering deleted
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag ServiceOfferings
 * @openapi
 */
export const DELETE = withErrorHandler(async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAdmin(request)

  ServiceOfferingIdParams.parse(params)
  const offeringId = parseInt(params.id, 10)

  if (!Number.isFinite(offeringId)) {
    return ApiResponse.badRequest('Invalid service offering ID')
  }

  await prisma.serviceOffering.delete({ where: { id: offeringId } })

  const payload = {
    success: true as const,
    data: { id: offeringId },
    message: 'Service offering deleted',
  }

  DeleteServiceOfferingSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message)
})
