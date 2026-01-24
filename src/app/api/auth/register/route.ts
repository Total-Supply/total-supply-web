import { ApiError, ConflictError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildVerificationEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { verifyRecaptcha } from '@/src/lib/recaptcha'
import { registerSchema } from '@/src/lib/validations/auth.schema'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'
import { NextRequest } from 'next/server'

/**
 * Register
 * @description Creates a new user account. First user becomes ADMIN + ACTIVE; others become CUSTOMER + PENDING_APPROVAL.
 * @body RegisterBody
 * @response 201:RegisterSuccessResponse
 * @responseSet public
 * @add 409:ConflictResponse
 * @tag Auth
 * @openapi
 */
async function handler(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = getRateLimitKey(undefined, ip, 'register')
    rateLimiters.auth(rateLimitKey)

    const body = await request.json()
    const data = await validateBody(body, registerSchema)

    if (data.recaptchaToken) {
      const recaptcha = await verifyRecaptcha(data.recaptchaToken, ip)
      if (!recaptcha.success) {
        throw new ValidationError('reCAPTCHA verification failed', recaptcha)
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) throw new ConflictError('Email already registered')

    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 0

    const passwordHash = await hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: isFirstUser ? 'ADMIN' : 'CUSTOMER',
        status: isFirstUser ? 'ACTIVE' : 'PENDING_APPROVAL',
        emailVerified: isFirstUser ? new Date() : null,
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
          result: 'SUCCESS',
          actorName: user.name,
        },
      },
    })

    if (!isFirstUser) {
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
    }

    const message = isFirstUser
      ? 'Admin account created successfully. You can now log in.'
      : 'Account created successfully. Check your email to verify your account, then wait for admin approval.'

    return ApiResponse.created(user, message)
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof ApiError) throw error
    throw error
  }
}

export const POST = withErrorHandler(handler)
