import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { slugify } from '@/src/lib/utils'
import {
  serviceOfferingUpdateSchema,
} from '@/src/lib/validations/service-offering.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin(request)
  const { id } = await params
  const offeringId = parseInt(id, 10)

  if (!Number.isFinite(offeringId)) {
    return ApiResponse.badRequest('Invalid service offering ID')
  }

  if (request.method === 'GET') {
    const offering = await prisma.serviceOffering.findUnique({
      where: { id: offeringId },
    })
    if (!offering) {
      return ApiResponse.notFound('Service offering not found')
    }
    return ApiResponse.success(offering)
  }

  if (request.method === 'DELETE') {
    await prisma.serviceOffering.delete({ where: { id: offeringId } })
    return ApiResponse.success({ id: offeringId }, 'Service offering deleted')
  }

  const body = await request.json()
  const data = await validateBody(body, serviceOfferingUpdateSchema)
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

  return ApiResponse.success(offering, 'Service offering updated')
}

export const GET = withErrorHandler(handler)
export const PATCH = withErrorHandler(handler)
export const DELETE = withErrorHandler(handler)


