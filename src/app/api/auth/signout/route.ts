import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Get authenticated user
  const authRequest = await requireAuth(request)
  const userId = authRequest.user.id

  // Create logout audit log
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: parseInt(userId),
      action: 'LOGOUT',
      actorId: parseInt(userId),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    },
  })

  return ApiResponse.success(null, 'Logged out successfully')
}

export const POST = withErrorHandler(handler)
