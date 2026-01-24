import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { UpdateItemBody } from '@/src/lib/schemas/catalog'
import { slugify } from '@/src/lib/utils'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * Get Food Item (Admin)
 *
 * @pathParams ItemIdParams
 * @response 200:GetItemSuccessResponse:Item details
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Items
 * @openapi
 */
export const GET = withErrorHandler(
  async (_request: NextRequest, { params }: Params) => {
    await requireAdmin(_request)

    const { id } = await params
    const itemId = Number(id)
    if (Number.isNaN(itemId)) {
      return ApiResponse.badRequest('Invalid item id')
    }

    const item = await prisma.foodItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        ingredients: true,
        nutritionInfo: true,
        price: true,
        sku: true,
        stock: true,
        isActive: true,
        mainImageUrl: true,
        category: { select: { id: true, name: true, slug: true } },
        categoryLinks: {
          select: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
        images: { select: { id: true, url: true, position: true } },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!item) {
      return ApiResponse.notFound('Item not found')
    }

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

    const { category, categoryLinks, ...rest } = item

    return ApiResponse.success({
      ...rest,
      categories: Array.from(categoryMap.values()),
    })
  },
)

/**
 * Update Food Item (Admin)
 *
 * @pathParams ItemIdParams
 * @body UpdateItemBody
 * @response 200:UpdateItemSuccessResponse:Item updated
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Items
 * @openapi
 */
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: Params) => {
    const authRequest = await requireAdmin(request)

    const { id } = await params
    const itemId = Number(id)
    if (Number.isNaN(itemId)) {
      return ApiResponse.badRequest('Invalid item id')
    }

    const body = await request.json()
    const data = await validateBody(body, UpdateItemBody)

    const slug = data.slug ? slugify(data.slug) : undefined

    if (slug) {
      const existing = await prisma.foodItem.findFirst({
        where: { slug, NOT: { id: itemId } },
        select: { id: true },
      })
      if (existing) {
        return ApiResponse.conflict('Item slug already exists')
      }
    }

    const nextCategoryId =
      data.categoryId ??
      (data.categoryIds?.length ? data.categoryIds[0] : undefined)

    if (nextCategoryId) {
      const categories = await prisma.foodCategory.findMany({
        where: {
          id: {
            in: Array.from(
              new Set([nextCategoryId, ...(data.categoryIds ?? [])]),
            ),
          },
        },
        select: { id: true },
      })
      if (categories.length === 0) {
        return ApiResponse.badRequest('Invalid category selection')
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const item = await tx.foodItem.update({
        where: { id: itemId },
        data: {
          ...(data.name && { name: data.name }),
          ...(slug && { slug }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.ingredients !== undefined && {
            ingredients: data.ingredients,
          }),
          ...(data.nutritionInfo !== undefined && {
            nutritionInfo: data.nutritionInfo,
          }),
          ...(data.price !== undefined && {
            price: new Prisma.Decimal(data.price),
          }),
          ...(data.sku !== undefined && { sku: data.sku }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.mainImageUrl !== undefined && {
            mainImageUrl: data.mainImageUrl,
          }),
          ...(nextCategoryId && { categoryId: nextCategoryId }),
        },
      })

      if (data.categoryIds || data.categoryId) {
        const categoryIds = Array.from(
          new Set(
            [nextCategoryId, ...(data.categoryIds ?? [])].filter(Boolean),
          ),
        ) as number[]

        await tx.foodItemCategory.deleteMany({
          where: { foodItemId: itemId },
        })

        const extraCategoryIds = categoryIds.filter(
          (categoryId) => categoryId !== item.categoryId,
        )

        if (extraCategoryIds.length) {
          await tx.foodItemCategory.createMany({
            data: extraCategoryIds.map((categoryId) => ({
              foodItemId: itemId,
              categoryId,
            })),
          })
        }
      }

      if (data.imageUrls) {
        await tx.foodImage.deleteMany({ where: { foodItemId: itemId } })

        if (data.imageUrls.length) {
          await tx.foodImage.createMany({
            data: data.imageUrls.map((url, index) => ({
              foodItemId: itemId,
              url,
              position: index,
            })),
          })
        }
      }

      await tx.auditLog.create({
        data: {
          entityType: 'FOOD_ITEM',
          entityId: item.id,
          action: 'UPDATE',
          actorId: Number(authRequest.user.id),
          details: {
            name: item.name,
            slug: item.slug,
            result: 'SUCCESS',
            actorName: authRequest.user.name,
          },
        },
      })

      return item
    })

    return ApiResponse.success(updated, 'Item updated')
  },
)

/**
 * Delete Food Item (Admin)
 *
 * @pathParams ItemIdParams
 * @response 200:DeleteItemSuccessResponse:Item deleted
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Items
 * @openapi
 */
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: Params) => {
    const authRequest = await requireAdmin(request)

    const { id } = await params
    const itemId = Number(id)
    if (Number.isNaN(itemId)) {
      return ApiResponse.badRequest('Invalid item id')
    }

    await prisma.$transaction(async (tx) => {
      await tx.foodImage.deleteMany({ where: { foodItemId: itemId } })
      await tx.foodItemCategory.deleteMany({ where: { foodItemId: itemId } })
      await tx.foodItem.delete({ where: { id: itemId } })

      await tx.auditLog.create({
        data: {
          entityType: 'FOOD_ITEM',
          entityId: itemId,
          action: 'DELETE',
          actorId: Number(authRequest.user.id),
          details: {
            result: 'SUCCESS',
            actorName: authRequest.user.name,
          },
        },
      })
    })

    return ApiResponse.success({ id: itemId }, 'Item deleted')
  },
)
