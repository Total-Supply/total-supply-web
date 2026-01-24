import { NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { buildApprovalEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Approve User
 *
 * @description Approves a pending user (email must be verified). Admin only.
 *
 * @params UserIdParams
 * @response 200 - ApproveUserSuccessResponse - User approved
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authRequest = await requireAdmin(request)
  const adminId = parseInt(authRequest.user.id, 10)

  const { id } = await params
  const userId = parseInt(id, 10)

  if (!Number.isFinite(userId)) {
    return ApiResponse.badRequest('Invalid user id')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      emailVerified: true,
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  if (!user.emailVerified) {
    return ApiResponse.badRequest('User email not verified')
  }

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
        result: 'SUCCESS',
        actorName: authRequest.user.name,
      },
    },
  })

  const { text, html } = buildApprovalEmail({ name: updatedUser.name })
  await sendEmail({
    to: updatedUser.email,
    subject: 'Your account has been approved',
    text,
    html,
  })

  return ApiResponse.success(updatedUser, 'User approved successfully')
}

export const POST = withErrorHandler(handler)
