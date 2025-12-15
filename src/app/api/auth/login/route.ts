import { ForbiddenError, UnauthorizedError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { loginSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { compare } from 'bcryptjs'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitKey = getRateLimitKey(undefined, ip, 'login')
  rateLimiters.auth(rateLimitKey)

  // Validate request body
  const body = await request.json()
  const data = await validateBody(body, loginSchema)

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      role: true,
      status: true,
      profileImage: true,
    },
  })

  if (!user) {
    throw new UnauthorizedError('Invalid email or password')
  }

  // Verify password
  const isPasswordValid = await compare(data.password, user.passwordHash)

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  // Check account status
  if (user.status === 'SUSPENDED') {
    throw new ForbiddenError('Your account has been suspended')
  }

  if (user.status === 'REJECTED') {
    throw new ForbiddenError('Your account has been rejected')
  }

  if (user.status === 'PENDING_APPROVAL') {
    throw new ForbiddenError('Your account is pending admin approval')
  }

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: user.id,
      action: 'LOGIN',
      actorId: user.id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    },
  })

  // Return user data (NextAuth will handle session creation)
  const { passwordHash, ...userWithoutPassword } = user

  return ApiResponse.success({ user: userWithoutPassword }, 'Login successful')
}

export const POST = withErrorHandler(handler)
