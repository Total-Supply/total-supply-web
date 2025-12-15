import { ConflictError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { registerSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { hash } from 'bcryptjs'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = getRateLimitKey(undefined, ip, 'register')
    rateLimiters.auth(rateLimitKey)

    // Validate request body
    const body = await request.json()
    const data = await validateBody(body, registerSchema)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    // Check if this is the first user (make them admin and active)
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 0

    // Hash password
    const passwordHash = await hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone || null,
        role: isFirstUser ? 'ADMIN' : 'CUSTOMER',
        status: isFirstUser ? 'ACTIVE' : 'PENDING_APPROVAL',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'USER',
        entityId: user.id,
        action: 'CREATE',
        actorId: user.id,
        ipAddress: ip,
        details: {
          email: user.email,
          name: user.name,
          isFirstUser,
        },
      },
    })

    const message = isFirstUser
      ? 'Admin account created successfully. You can now log in.'
      : 'Account created successfully. Awaiting admin approval.'

    return ApiResponse.created(user, message)
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export const POST = withErrorHandler(handler)
