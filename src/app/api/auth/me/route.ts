import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Get authenticated user
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  // Fetch full user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      _count: {
        select: {
          orders: true,
          serviceRequests: true,
          addresses: true,
        },
      },
    },
  })

  return ApiResponse.success(user)
}

export const GET = withErrorHandler(handler)
