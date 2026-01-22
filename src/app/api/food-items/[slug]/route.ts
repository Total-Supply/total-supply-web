import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const item = await prisma.foodItem.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      ingredients: true,
      nutritionInfo: true,
      price: true,
      stock: true,
      mainImageUrl: true,
      images: {
        select: {
          id: true,
          url: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      categoryLinks: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  if (!item) {
    return ApiResponse.notFound('Food item not found')
  }

  const { categoryLinks, ...rest } = item
  const categoryMap = new Map<number, { id: number; name: string; slug: string }>()
  if (rest.category) {
    categoryMap.set(rest.category.id, rest.category)
  }
  categoryLinks.forEach((link) => {
    categoryMap.set(link.category.id, link.category)
  })

  return ApiResponse.success({
    ...rest,
    categories: Array.from(categoryMap.values()),
  })
}

export const GET = withErrorHandler(handler)


