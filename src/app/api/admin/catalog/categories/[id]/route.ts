import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { UpdateCategoryBody } from '@/src/lib/schemas/catalog'
import { slugify } from '@/src/lib/utils'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * Get Food Category (Admin)
 *
 * @pathParams CategoryIdParams
 * @response 200:GetCategorySuccessResponse:Category details
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Categories
 * @openapi
 */
export const GET = withErrorHandler(
  async (_request: NextRequest, { params }: Params) => {
    await requireAdmin(_request)

    const { id } = await params
    const categoryId = Number(id)
    if (Number.isNaN(categoryId)) {
      return ApiResponse.badRequest('Invalid category id')
    }

    const category = await prisma.foodCategory.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return ApiResponse.notFound('Category not found')
    }

    const itemCount = await prisma.foodItem.count({
      where: {
        OR: [{ categoryId }, { categoryLinks: { some: { categoryId } } }],
      },
    })

    return ApiResponse.success({ ...category, itemCount })
  },
)

/**
 * Update Food Category (Admin)
 *
 * @pathParams CategoryIdParams
 * @body UpdateCategoryBody
 * @response 200:UpdateCategorySuccessResponse:Category updated
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Categories
 * @openapi
 */
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: Params) => {
    const authRequest = await requireAdmin(request)

    const { id } = await params
    const categoryId = Number(id)
    if (Number.isNaN(categoryId)) {
      return ApiResponse.badRequest('Invalid category id')
    }

    const body = await request.json()
    const data = await validateBody(body, UpdateCategoryBody)

    const slug = data.slug ? slugify(data.slug) : undefined

    if (slug) {
      const existing = await prisma.foodCategory.findFirst({
        where: { slug, NOT: { id: categoryId } },
        select: { id: true },
      })
      if (existing) {
        return ApiResponse.conflict('Category slug already exists')
      }
    }

    const updated = await prisma.foodCategory.update({
      where: { id: categoryId },
      data: {
        ...(data.name && { name: data.name }),
        ...(slug && { slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      },
    })

    await prisma.auditLog.create({
      data: {
        entityType: 'FOOD_CATEGORY',
        entityId: updated.id,
        action: 'UPDATE',
        actorId: Number(authRequest.user.id),
        details: {
          name: updated.name,
          slug: updated.slug,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return ApiResponse.success(updated, 'Category updated')
  },
)

/**
 * Delete Food Category (Admin)
 *
 * @pathParams CategoryIdParams
 * @response 200:DeleteCategorySuccessResponse:Category deleted
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Catalog
 * @tag Categories
 * @openapi
 */
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: Params) => {
    const authRequest = await requireAdmin(request)

    const { id } = await params
    const categoryId = Number(id)
    if (Number.isNaN(categoryId)) {
      return ApiResponse.badRequest('Invalid category id')
    }

    const itemCount = await prisma.foodItem.count({
      where: {
        OR: [{ categoryId }, { categoryLinks: { some: { categoryId } } }],
      },
    })

    if (itemCount > 0) {
      return ApiResponse.conflict(
        'Category has assigned items and cannot be deleted',
      )
    }

    await prisma.foodCategory.delete({
      where: { id: categoryId },
    })

    await prisma.auditLog.create({
      data: {
        entityType: 'FOOD_CATEGORY',
        entityId: categoryId,
        action: 'DELETE',
        actorId: Number(authRequest.user.id),
        details: {
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return ApiResponse.success({ id: categoryId }, 'Category deleted')
  },
)
