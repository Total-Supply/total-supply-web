import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const addresses = await prisma.address.findMany({
    where: { userId },
    select: {
      id: true,
      label: true,
      line1: true,
      line2: true,
      city: true,
      postalCode: true,
      country: true,
      isDefault: true,
      createdAt: true,
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return ApiResponse.success(addresses)
}

export const GET = withErrorHandler(handler)


