import { ApiResponse } from '@/src/lib/api/response'
import { validateQuery } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { getUsersQuerySchema } from '@/src/lib/validations/user.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Require admin role
  await requireAdmin(request)

  // Validate query parameters
  const searchParams = request.nextUrl.searchParams
  const query = await validateQuery(searchParams, getUsersQuerySchema)

  // Build where clause
  const where: any = {}
  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: 'insensitive' } },
      { name: { contains: query.search, mode: 'insensitive' } },
    ]
  }
  if (query.role) where.role = query.role
  if (query.status) where.status = query.status

  // Get total count
  const total = await prisma.user.count({ where })

  // Get paginated users
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      profileImage: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { [query.sortBy]: query.sortOrder },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  })

  return ApiResponse.success(users, undefined, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  })
}

export const GET = withErrorHandler(handler)
