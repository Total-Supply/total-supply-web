import { ApiResponse } from '@/src/lib/api/response'
import { NotFoundError, ValidationError } from '@/src/lib/api/errors'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
      deletionRequestedAt: true,
      deletionScheduledAt: true,
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  if (!user.deletionRequestedAt || !user.deletionScheduledAt) {
    throw new ValidationError('No deletion request to restore')
  }

  if (new Date() > user.deletionScheduledAt) {
    throw new ValidationError('Restore window has expired')
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      status: 'ACTIVE',
      deletionRequestedAt: null,
      deletionScheduledAt: null,
    },
    select: {
      id: true,
      status: true,
      deletionRequestedAt: true,
      deletionScheduledAt: true,
    },
  })

  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: userId,
      action: 'UPDATE',
      actorId: userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      details: {
        restoredAt: new Date(),
        result: 'SUCCESS',
        actorName: authRequest.user.name,
      },
    },
  })

  return ApiResponse.success(updated, 'Account restored')
}

export const POST = withErrorHandler(handler)


