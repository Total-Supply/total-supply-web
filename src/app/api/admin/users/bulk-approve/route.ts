import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildApprovalEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { bulkApproveSchema } from '@/src/lib/validations/user.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAdmin(request)
  const adminId = parseInt(authRequest.user.id)

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

  const ids = users.map((user) => user.id)

  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { status: 'ACTIVE' },
  })

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await prisma.auditLog.createMany({
    data: users.map((user) => ({
      entityType: 'USER',
      entityId: user.id,
      action: 'STATUS_CHANGE',
      actorId: adminId,
      ipAddress: ip,
      details: {
        from: user.status,
        to: 'ACTIVE',
        action: 'approved',
        bulk: true,
      },
    })),
  })

  await Promise.all(
    users.map(async (user) => {
      const { text, html } = buildApprovalEmail({ name: user.name })
      await sendEmail({
        to: user.email,
        subject: 'Your account has been approved',
        text,
        html,
      })
    }),
  )

  return ApiResponse.success(
    users.map((user) => ({ ...user, status: 'ACTIVE' })),
    'Users approved successfully',
  )
}

export const POST = withErrorHandler(handler)
