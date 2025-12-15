import { NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Require admin authentication
  const authRequest = await requireAdmin(request)
  const adminId = parseInt(authRequest.user.id)
  const userId = parseInt(params.id)

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Update user status to ACTIVE
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  })

  // Create audit log
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: userId,
      action: 'STATUS_CHANGE',
      actorId: adminId,
      ipAddress: ip,
      details: {
        from: user.status,
        to: 'ACTIVE',
        action: 'approved',
      },
    },
  })

  return ApiResponse.success(updatedUser, 'User approved successfully')
}

export const POST = withErrorHandler(handler)
