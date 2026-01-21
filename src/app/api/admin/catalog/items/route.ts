import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { CreateItemBody } from '@/src/lib/schemas/catalog'
import { slugify } from '@/src/lib/utils'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * List Food Items (Admin)
 *
 * @description Returns paginated food items with merged categories.
 * @params ListItemsQuery
 * @response 200:ListItemsSuccessResponse:Items list
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Items
 * @openapi
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireAdmin(request)

  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const search = searchParams.get('search')
  const categoryId = searchParams.get('categoryId')
  const isActive = searchParams.get('isActive')

  const where: Prisma.FoodItemWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (isActive === 'true') where.isActive = true
  if (isActive === 'false') where.isActive = false

  if (categoryId) {
    const categoryIdNumber = Number(categoryId)
    if (!Number.isNaN(categoryIdNumber)) {
      where.AND = [
        ...(Array.isArray(where.AND)
          ? where.AND
          : where.AND
            ? [where.AND]
            : []),
        {
          OR: [
            { categoryId: categoryIdNumber },
            { categoryLinks: { some: { categoryId: categoryIdNumber } } },
          ],
        },
      ]
    }
  }

  const total = await prisma.foodItem.count({ where })

  const items = await prisma.foodItem.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stock: true,
      sku: true,
      isActive: true,
      mainImageUrl: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, name: true, slug: true } },
      categoryLinks: {
        select: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  const mapped = items.map((item) => {
    const categoryMap = new Map<
      number,
      { id: number; name: string; slug: string }
    >()

    if (item.category) {
      categoryMap.set(item.category.id, item.category)
    }
    item.categoryLinks.forEach((link) => {
      categoryMap.set(link.category.id, link.category)
    })

    // ✅ remove category + categoryLinks from response
    const { category, categoryLinks, ...rest } = item

    return {
      ...rest,
      categories: Array.from(categoryMap.values()),
    }
  })

  return ApiResponse.success(mapped, undefined, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
})

/**
 * Create Food Item (Admin)
 *
 * @description Creates a food item with optional extra categories + images.
 * @body CreateItemBody
 * @response 201:CreateItemSuccessResponse:Item created
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Items
 * @openapi
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const authRequest = await requireAdmin(request)

  const body = await request.json()
  const data = await validateBody(body, CreateItemBody)

  const slug = data.slug ? slugify(data.slug) : slugify(data.name)

  const existing = await prisma.foodItem.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (existing) {
    return ApiResponse.conflict('Item slug already exists')
  }

  const categoryIds = Array.from(
    new Set([data.categoryId, ...(data.categoryIds ?? [])]),
  )

  const categories = await prisma.foodCategory.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true },
  })

  if (categories.length !== categoryIds.length) {
    return ApiResponse.badRequest('Invalid category selection')
  }

  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.foodItem.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? undefined,
        ingredients: data.ingredients ?? undefined,
        nutritionInfo: data.nutritionInfo ?? undefined,
        price: new Prisma.Decimal(data.price),
        sku: data.sku ?? undefined,
        stock: data.stock ?? 0,
        isActive: data.isActive ?? true,
        categoryId: data.categoryId,
        mainImageUrl: data.mainImageUrl ?? undefined,
      },
    })

    const extraCategoryIds = categoryIds.filter((id) => id !== data.categoryId)
    if (extraCategoryIds.length) {
      await tx.foodItemCategory.createMany({
        data: extraCategoryIds.map((categoryId) => ({
          foodItemId: created.id,
          categoryId,
        })),
      })
    }

    if (data.imageUrls?.length) {
      await tx.foodImage.createMany({
        data: data.imageUrls.map((url, index) => ({
          foodItemId: created.id,
          url,
          position: index,
        })),
      })
    }

    await tx.auditLog.create({
      data: {
        entityType: 'FOOD_ITEM',
        entityId: created.id,
        action: 'CREATE',
        actorId: Number(authRequest.user.id),
        details: {
          name: created.name,
          slug: created.slug,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return created
  })

  return ApiResponse.created(item, 'Item created')
})
