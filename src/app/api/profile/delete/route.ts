import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const anonymizedEmail = `deleted-${userId}@totalsupply.local`

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.address.deleteMany({ where: { userId } }),
    prisma.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        name: 'Deleted User',
        phone: null,
        profileImage: null,
        status: 'SUSPENDED',
      },
    }),
    prisma.auditLog.create({
      data: {
        entityType: 'USER',
        entityId: userId,
        action: 'DELETE',
        actorId: userId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        details: { anonymizedEmail },
      },
    }),
  ])

  return ApiResponse.success({ id: userId }, 'Account deleted')
}

export const POST = withErrorHandler(handler)
