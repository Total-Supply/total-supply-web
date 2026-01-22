import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { CreateCategoryBody } from '@/src/lib/schemas/catalog'
import { slugify } from '@/src/lib/utils'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * List Food Categories (Admin)
 *
 * @description Returns paginated list of categories with itemCount.
 * @params ListCategoriesQuery
 * @response 200:ListCategoriesSuccessResponse:Categories list
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Categories
 * @openapi
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireAdmin(request)

  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const search = searchParams.get('search')

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const total = await prisma.foodCategory.count({ where })
  const categories = await prisma.foodCategory.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  const items = await prisma.foodItem.findMany({
    select: {
      id: true,
      categoryId: true,
      categoryLinks: { select: { categoryId: true } },
    },
  })

  const countMap = new Map<number, number>()
  items.forEach((item) => {
    const ids = new Set([
      item.categoryId,
      ...item.categoryLinks.map((link) => link.categoryId),
    ])
    ids.forEach((categoryId) => {
      countMap.set(categoryId, (countMap.get(categoryId) || 0) + 1)
    })
  })

  const data = categories.map((category) => ({
    ...category,
    itemCount: countMap.get(category.id) || 0,
  }))

  return ApiResponse.success(data, undefined, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
})

/**
 * Create Food Category (Admin)
 *
 * @description Creates a category (slug must be unique).
 * @body CreateCategoryBody
 * @response 201:CreateCategorySuccessResponse:Category created
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Categories
 * @openapi
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const authRequest = await requireAdmin(request)

  const body = await request.json()
  const data = await validateBody(body, CreateCategoryBody)

  const slug = data.slug ? slugify(data.slug) : slugify(data.name)

  const existing = await prisma.foodCategory.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (existing) {
    return ApiResponse.conflict('Category slug already exists')
  }

  const category = await prisma.foodCategory.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
    },
  })

  await prisma.auditLog.create({
    data: {
      entityType: 'FOOD_CATEGORY',
      entityId: category.id,
      action: 'CREATE',
      actorId: Number(authRequest.user.id),
      details: {
        name: category.name,
        slug: category.slug,
        result: 'SUCCESS',
        actorName: authRequest.user.name,
      },
    },
  })

  return ApiResponse.created(category, 'Category created')
})
