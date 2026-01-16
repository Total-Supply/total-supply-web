import { NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildRejectionEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { rejectUserSchema } from '@/src/lib/validations/user.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authRequest = await requireAdmin(request)
  const adminId = parseInt(authRequest.user.id)
  const { id } = await params
  const userId = parseInt(id)

  const body = await request.json()
  const data = await validateBody(body, rejectUserSchema)

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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'REJECTED' },
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
        to: 'REJECTED',
        action: 'rejected',
        reason: data.reason,
      },
    },
  })

  const { text, html } = buildRejectionEmail({
    name: updatedUser.name,
    reason: data.reason,
  })
  await sendEmail({
    to: updatedUser.email,
    subject: 'Your account was rejected',
    text,
    html,
  })

  return ApiResponse.success(updatedUser, 'User rejected successfully')
}

export const POST = withErrorHandler(handler)
