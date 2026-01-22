import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { profileMarketingSchema } from '@/src/lib/validations/profile.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const body = await request.json()
  const data = await validateBody(body, profileMarketingSchema)

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      marketingOptIn: data.marketingOptIn,
    },
    select: {
      marketingOptIn: true,
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
        marketingOptIn: data.marketingOptIn,
        result: 'SUCCESS',
        actorName: authRequest.user.name,
      },
    },
  })

  return ApiResponse.success(updated, 'Marketing preferences updated')
}

export const PUT = withErrorHandler(handler)


