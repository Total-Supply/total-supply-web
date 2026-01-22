import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const categoryId = searchParams.get('categoryId')
  const categories = searchParams.get('categories')
  const ids = searchParams.get('ids')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  // Build where clause
  const where: Prisma.FoodItemWhereInput = {
    isActive: true,
  }

  if (categoryId) {
    where.categoryId = parseInt(categoryId)
  }

  let parsedIds: number[] = []
  if (ids) {
    const parsed = ids
      .split(',')
      .map((value) => parseInt(value.trim(), 10))
      .filter((value) => Number.isFinite(value))
    if (parsed.length) {
      parsedIds = parsed
      where.id = { in: parsedIds }
    }
  }

  if (categories) {
    const categorySlugs = categories
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean)
    if (categorySlugs.length) {
      const andFilters = categorySlugs.map((slug) => ({
        OR: [
          {
            category: {
              slug,
            },
          },
          {
            categoryLinks: {
              some: {
                category: {
                  slug,
                },
              },
            },
          },
        ],
      }))
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        ...andFilters,
      ]
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  // Get total count
  const total = await prisma.foodItem.count({ where })
  const effectiveLimit = parsedIds.length ? parsedIds.length : limit

  // Get food items
  const items = await prisma.foodItem.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      mainImageUrl: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    skip: (page - 1) * effectiveLimit,
    take: effectiveLimit,
  })

  return ApiResponse.success(items, undefined, {
    page,
    limit: effectiveLimit,
    total,
    totalPages: Math.ceil(total / effectiveLimit),
  })
}

export const GET = withErrorHandler(handler)


