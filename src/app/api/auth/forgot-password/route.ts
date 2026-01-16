import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import {
  buildPasswordResetEmail,
  sendEmail,
} from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { forgotPasswordSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { randomBytes } from 'crypto'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitKey = getRateLimitKey(undefined, ip, 'forgot-password')
  rateLimiters.passwordReset(rateLimitKey)

  const body = await request.json()
  const data = await validateBody(body, forgotPasswordSchema)

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  if (!user) {
    return ApiResponse.success(
      { email: data.email },
      'If an account exists, a reset link has been sent.',
    )
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  })

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password?token=${token}`
  const { text, html } = buildPasswordResetEmail({
    name: user.name,
    resetUrl,
  })

  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text,
    html,
  })

  return ApiResponse.success(
    { email: user.email },
    'If an account exists, a reset link has been sent.',
  )
}

export const POST = withErrorHandler(handler)
