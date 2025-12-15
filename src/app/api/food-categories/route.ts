import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const categories = await prisma.foodCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return ApiResponse.success(categories)
}

export const GET = withErrorHandler(handler)
