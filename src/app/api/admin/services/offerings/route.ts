import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  CreateServiceOfferingBody,
  CreateServiceOfferingSuccessResponse,
  ListServiceOfferingsSuccessResponse,
} from '@/src/lib/schemas/service-offerings'
import { slugify } from '@/src/lib/utils'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * List Service Offerings
 *
 * @description Returns all service offerings (ADMIN only).
 *
 * @response 200:ListServiceOfferingsSuccessResponse:Offerings fetched
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag ServiceOfferings
 * @openapi
 */
export const GET = withErrorHandler(async function GET(request: NextRequest) {
  await requireAdmin(request)

  const offerings = await prisma.serviceOffering.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const payload = {
    success: true as const,
    data: offerings,
  }

  ListServiceOfferingsSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data)
})

/**
 * Create Service Offering
 *
 * @description Creates a new service offering (ADMIN only).
 *
 * @body CreateServiceOfferingBody
 * @response 201:CreateServiceOfferingSuccessResponse:Offering created
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag ServiceOfferings
 * @openapi
 */
export const POST = withErrorHandler(async function POST(request: NextRequest) {
  await requireAdmin(request)

  const body = await request.json()
  const data = await validateBody(body, CreateServiceOfferingBody)

  const slug = data.slug ? slugify(data.slug) : slugify(data.name)

  const existing = await prisma.serviceOffering.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (existing) {
    return ApiResponse.conflict('Service offering slug already exists')
  }

  const offering = await prisma.serviceOffering.create({
    data: {
      name: data.name,
      slug,
      type: data.type,
      category: data.category ?? undefined,
      description: data.description ?? undefined,
      basePrice:
        typeof data.basePrice === 'number' ? data.basePrice : undefined,
      isActive: data.isActive ?? true,
    },
  })

  const payload = {
    success: true as const,
    data: offering,
    message: 'Service offering created',
  }

  CreateServiceOfferingSuccessResponse.parse(payload)

  return ApiResponse.created(payload.data, payload.message)
})
