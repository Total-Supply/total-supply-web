import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildApprovalEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { bulkApproveSchema } from '@/src/lib/validations/user.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Bulk Approve Users
 *
 * @description Approves multiple eligible users (PENDING_APPROVAL + email verified). Admin only.
 *
 * @body BulkApproveBody
 * @response 200 - BulkApproveSuccessResponse - Users approved
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function handler(request: NextRequest) {
  const authRequest = await requireAdmin(request)
  const adminId = parseInt(authRequest.user.id, 10)

  const body = await request.json()
  const data = await validateBody(body, bulkApproveSchema)

  const users = await prisma.user.findMany({
    where: {
      id: { in: data.ids },
      status: 'PENDING_APPROVAL',
      emailVerified: { not: null },
    },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
    },
  })

  if (!users.length) {
    return ApiResponse.success([], 'No users eligible for approval')
  }

  const ids = users.map((u) => u.id)

  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { status: 'ACTIVE' },
  })

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  await prisma.auditLog.createMany({
    data: users.map((u) => ({
      entityType: 'USER',
      entityId: u.id,
      action: 'STATUS_CHANGE',
      actorId: adminId,
      ipAddress: ip,
      details: {
        from: u.status,
        to: 'ACTIVE',
        action: 'approved',
        bulk: true,
        result: 'SUCCESS',
        actorName: authRequest.user.name,
      },
    })),
  })

  await Promise.all(
    users.map(async (u) => {
      const { text, html } = buildApprovalEmail({ name: u.name })
      await sendEmail({
        to: u.email,
        subject: 'Your account has been approved',
        text,
        html,
      })
    }),
  )

  return ApiResponse.success(
    users.map((u) => ({ ...u, status: 'ACTIVE' })),
    'Users approved successfully',
  )
}

export const POST = withErrorHandler(handler)
