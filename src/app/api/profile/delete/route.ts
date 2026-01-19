import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const now = new Date()
  const scheduledAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.update({
      where: { id: userId },
      data: {
        status: 'SUSPENDED',
        deletionRequestedAt: now,
        deletionScheduledAt: scheduledAt,
      },
    }),
    prisma.auditLog.create({
      data: {
        entityType: 'USER',
        entityId: userId,
        action: 'UPDATE',
        actorId: userId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        details: {
          deletionRequestedAt: now,
          deletionScheduledAt: scheduledAt,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    }),
  ])

  return ApiResponse.success(
    {
      id: userId,
      deletionRequestedAt: now,
      deletionScheduledAt: scheduledAt,
    },
    'Account deletion scheduled',
  )
}

export const POST = withErrorHandler(handler)


