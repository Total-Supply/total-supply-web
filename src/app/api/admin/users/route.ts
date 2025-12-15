import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Require admin authentication
  await requireAdmin(request)

  const { searchParams } = request.nextUrl
  const status = searchParams.get('status') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Build where clause
  const where: any = {}
  if (status) where.status = status

  // Get total count
  const total = await prisma.user.count({ where })

  // Get users
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return ApiResponse.success(users, undefined, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  })
}

export const GET = withErrorHandler(handler)
