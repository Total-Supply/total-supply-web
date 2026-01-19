import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { slugify } from '@/src/lib/utils'
import {
  serviceOfferingCreateSchema,
} from '@/src/lib/validations/service-offering.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  await requireAdmin(request)

  if (request.method === 'GET') {
    const offerings = await prisma.serviceOffering.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return ApiResponse.success(offerings)
  }

  const body = await request.json()
  const data = await validateBody(body, serviceOfferingCreateSchema)
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

  return ApiResponse.created(offering, 'Service offering created')
}

export const GET = withErrorHandler(handler)
export const POST = withErrorHandler(handler)


