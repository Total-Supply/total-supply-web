import { ForbiddenError, UnauthorizedError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { loginSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { compare } from 'bcryptjs'
import { NextRequest } from 'next/server'

/**
 * Login
 * @description Authenticates a user with email/password and returns the user profile.
 * @body LoginBody
 * @response LoginSuccessResponse
 * @responseSet public
 * @add 401:UnauthorizedResponse
 * @add 403:ForbiddenResponse
 * @tag Auth
 * @openapi
 */
async function handler(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitKey = getRateLimitKey(undefined, ip, 'login')
  rateLimiters.auth(rateLimitKey)

  const body = await request.json()
  const data = await validateBody(body, loginSchema)

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
    },
  })

  if (!user) throw new UnauthorizedError('Invalid email or password')

  const isPasswordValid = await compare(data.password, user.passwordHash)
  if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password')

  if (!user.emailVerified) throw new ForbiddenError('Email not verified')
  if (user.status === 'SUSPENDED')
    throw new ForbiddenError('Your account has been suspended')
  if (user.status === 'REJECTED')
    throw new ForbiddenError('Your account has been rejected')
  if (user.status === 'PENDING_APPROVAL')
    throw new ForbiddenError('Your account is pending admin approval')

  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: user.id,
      action: 'LOGIN',
      actorId: user.id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      details: { result: 'SUCCESS', actorName: user.name },
    },
  })

  const { passwordHash, ...userWithoutPassword } = user
  return ApiResponse.success({ user: userWithoutPassword }, 'Login successful')
}

export const POST = withErrorHandler(handler)
