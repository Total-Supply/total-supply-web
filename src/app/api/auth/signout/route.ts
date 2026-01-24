import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Sign Out
 * @description Logs out the current user (audit log only).
 * @auth bearer
 * @response SignoutSuccessResponse
 * @responseSet auth
 * @tag Auth
 * @openapi
 */
async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = authRequest.user.id

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: parseInt(userId),
      action: 'LOGOUT',
      actorId: parseInt(userId),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      details: { result: 'SUCCESS', actorName: authRequest.user.name },
    },
  })

  return ApiResponse.success(null, 'Logged out successfully')
}

export const POST = withErrorHandler(handler)
