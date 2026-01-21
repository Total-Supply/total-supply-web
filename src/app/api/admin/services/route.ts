import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  CreateServiceRequestBody,
  CreateServiceSuccessResponse,
  ListAdminServicesQuery,
  ListServicesSuccessResponse,
} from '@/src/lib/schemas/services'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * List Service Requests (Admin)
 *
 * @description Lists service requests with pagination + filters (Admin only).
 *
 * @params ListAdminServicesQuery
 * @response 200:ListServicesSuccessResponse:Service requests fetched
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Services
 * @openapi
 */
export const GET = withErrorHandler(async function GET(request: NextRequest) {
  await requireAdmin(request)

  const searchParams = request.nextUrl.searchParams

  const parsed = ListAdminServicesQuery.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    priority: searchParams.get('priority') ?? undefined,
    search: searchParams.get('search') ?? undefined,
  })

  if (!parsed.success) {
    return ApiResponse.badRequest('Invalid query parameters')
  }

  const { page, limit, status, type, priority, search } = parsed.data

  const where: Prisma.ServiceRequestWhereInput = {}

  if (status) where.status = status
  if (type) where.type = type
  if (priority) where.priority = priority

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { requestNumber: { contains: search, mode: 'insensitive' } },
    ]
  }

  const total = await prisma.serviceRequest.count({ where })

  const services = await prisma.serviceRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  const payload = {
    success: true as const,
    data: services,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }

  ListServicesSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, undefined, payload.meta)
})

/**
 * Create Service Request (Admin)
 *
 * @description Creates a service request (Admin only).
 * NOTE: For now this creates the request under the ADMIN user as customerId.
 * (You can later extend body to accept customerId if needed.)
 *
 * @body CreateServiceRequestBody
 * @response 201:CreateServiceSuccessResponse:Service request created
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Services
 * @openapi
 */
export const POST = withErrorHandler(async function POST(request: NextRequest) {
  const authRequest = await requireAdmin(request)

  const body = await request.json()
  const data = await validateBody(body, CreateServiceRequestBody)

  // Ensure DB-required fields
  const title = data.title ?? 'Service Request'
  const requestNumber = `SR-${Date.now()}`

  const created = await prisma.serviceRequest.create({
    data: {
      requestNumber,
      customerId: Number(authRequest.user.id),
      type: data.type,
      category: data.category ?? undefined,
      serviceOfferingId: data.serviceOfferingId ?? undefined,
      title,
      description: data.description,
      addressId: data.addressId ?? undefined,
      requestedDate: data.requestedDate ?? undefined,
      priority: data.priority ?? 'MEDIUM',
      notes: data.notes ?? undefined,
    },
  })

  const payload = {
    success: true as const,
    data: created,
    message: 'Service created',
  }

  CreateServiceSuccessResponse.parse(payload)

  return ApiResponse.success(payload.data, payload.message, undefined, 201)
})
