import { ApiError, NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import {
  buildPasswordResetConfirmation,
  sendEmail,
} from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { resetPasswordSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { hash } from 'bcryptjs'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const body = await request.json()
  const data = await validateBody(body, resetPasswordSchema)

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: data.token },
    include: { user: true },
  })

  if (!tokenRecord) {
    throw new NotFoundError('Invalid reset token')
  }

  if (tokenRecord.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id },
    })
    throw new ApiError('Reset token expired', 410, 'TOKEN_EXPIRED')
  }

  const passwordHash = await hash(data.password, 10)

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { passwordHash },
  })

  await prisma.passwordResetToken.delete({
    where: { id: tokenRecord.id },
  })

  const { text, html } = buildPasswordResetConfirmation({
    name: tokenRecord.user.name,
  })
  await sendEmail({
    to: tokenRecord.user.email,
    subject: 'Your password was reset',
    text,
    html,
  })

  return ApiResponse.success(
    { email: tokenRecord.user.email },
    'Password reset successfully. You can log in.',
  )
}

export const POST = withErrorHandler(handler)
