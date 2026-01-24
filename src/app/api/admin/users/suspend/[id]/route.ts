import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * Suspend User (Admin)
 *
 * @description Suspends a user (status = SUSPENDED). Admin only.
 *
 * @params UserIdParams
 * @response 200 - SuspendUserSuccessResponse - Suspended user
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function handler(request: NextRequest, { params }: Params) {
  const authRequest = await requireAdmin(request)
  const adminId = Number(authRequest.user.id)

  const { id } = await params
  const userId = Number(id)

  if (Number.isNaN(userId)) {
    return ApiResponse.badRequest('Invalid user id')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
    },
  })

  if (!user) {
    return ApiResponse.notFound('User not found')
  }

  if (user.status === 'SUSPENDED') {
    return ApiResponse.conflict('User is already suspended')
  }

  if (user.status === 'PENDING_APPROVAL') {
    return ApiResponse.badRequest('Pending users cannot be suspended')
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: 'SUSPENDED' },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

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
        to: 'SUSPENDED',
        action: 'suspended',
        result: 'SUCCESS',
        actorName: authRequest.user.name,
      },
    },
  })

  return ApiResponse.success(updated, 'User suspended successfully')
}

export const POST = withErrorHandler(handler)
