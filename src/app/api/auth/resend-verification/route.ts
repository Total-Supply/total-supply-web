import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildVerificationEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { resendVerificationSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { randomBytes } from 'crypto'
import { NextRequest } from 'next/server'

/**
 * Resend Verification Email
 * @description Re-sends an email verification token if the user exists and is not yet verified.
 * @body ResendVerificationBody
 * @response ResendVerificationSuccessResponse
 * @responseSet public
 * @tag Auth
 * @openapi
 */
async function handler(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitKey = getRateLimitKey(undefined, ip, 'resend-verification')
  rateLimiters.verifyResend(rateLimitKey)

  const body = await request.json()
  const data = await validateBody(body, resendVerificationSchema)

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, email: true, name: true, emailVerified: true },
  })

  if (!user || user.emailVerified) {
    return ApiResponse.success(
      { email: data.email },
      'If your email exists, a verification link has been sent.',
    )
  }

  await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } })

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.emailVerificationToken.create({
    data: { token, userId: user.id, expiresAt },
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`
  const { text, html } = buildVerificationEmail({
    name: user.name,
    verificationUrl,
  })

  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    text,
    html,
  })

  return ApiResponse.success(
    { email: user.email },
    'Verification email sent. Please check your inbox.',
  )
}

export const POST = withErrorHandler(handler)
