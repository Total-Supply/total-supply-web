import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const categoryId = searchParams.get('categoryId')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  // Build where clause
  const where: any = {
    isActive: true,
  }

  if (categoryId) {
    where.categoryId = parseInt(categoryId)
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
    skip: (page - 1) * limit,
    take: limit,
  })

  return ApiResponse.success(items, undefined, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
}

export const GET = withErrorHandler(handler)
