import { ApiError, NotFoundError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { verifyEmailSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Verify Email
 * @description Verifies the user's email using a token.
 * @body VerifyEmailBody
 * @response VerifyEmailSuccessResponse
 * @responseSet public
 * @add 404:NotFoundResponse
 * @tag Auth
 * @openapi
 */
async function handler(request: NextRequest) {
  const body = await request.json()
  const data = await validateBody(body, verifyEmailSchema)

  const tokenRecord = await prisma.emailVerificationToken.findUnique({
    where: { token: data.token },
    include: { user: true },
  })

  if (!tokenRecord) throw new NotFoundError('Invalid verification token')

  if (tokenRecord.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({
      where: { id: tokenRecord.id },
    })
    throw new ApiError('Verification token expired', 410, 'TOKEN_EXPIRED', {
      email: tokenRecord.user.email,
    })
  }

  if (tokenRecord.user.emailVerified) {
    await prisma.emailVerificationToken.delete({
      where: { id: tokenRecord.id },
    })
    return ApiResponse.success(
      { email: tokenRecord.user.email, alreadyVerified: true },
      'Email already verified. You can log in.',
    )
  }

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { emailVerified: new Date() },
  })

  await prisma.emailVerificationToken.delete({ where: { id: tokenRecord.id } })

  return ApiResponse.success(
    { email: tokenRecord.user.email },
    'Email verified. Waiting for admin approval.',
  )
}

export const POST = withErrorHandler(handler)
