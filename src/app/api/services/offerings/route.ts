import { ServiceType } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

// Adjust the import path if ServiceType is defined elsewhere

async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type')

  const offerings = await prisma.serviceOffering.findMany({
    where: {
      isActive: true,
      ...(type ? { type: type as ServiceType } : {}), // Replace 'any' with 'ServiceType' if imported
    },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      category: true,
      description: true,
      basePrice: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return ApiResponse.success(offerings)
}

export const GET = withErrorHandler(handler)
