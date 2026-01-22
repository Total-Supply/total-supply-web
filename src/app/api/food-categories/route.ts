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
    },
    orderBy: {
      name: 'asc',
    },
  })

  const items = await prisma.foodItem.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      categoryId: true,
      categoryLinks: {
        select: {
          categoryId: true,
        },
      },
    },
  })

  const countMap = new Map<number, number>()
  for (const item of items) {
    const categoryIds = new Set([
      item.categoryId,
      ...item.categoryLinks.map((link) => link.categoryId),
    ])
    categoryIds.forEach((categoryId) => {
      countMap.set(categoryId, (countMap.get(categoryId) || 0) + 1)
    })
  }

  return ApiResponse.success(
    categories.map((category) => ({
      ...category,
      itemCount: countMap.get(category.id) || 0,
    })),
  )
}

export const GET = withErrorHandler(handler)


