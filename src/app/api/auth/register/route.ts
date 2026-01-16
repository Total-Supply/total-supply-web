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
import { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'

async function handler(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = getRateLimitKey(undefined, ip, 'register')
    rateLimiters.auth(rateLimitKey)

    // Validate request body
    const body = await request.json()
    const data = await validateBody(body, registerSchema)

    // Optional reCAPTCHA v3 verification
    if (data.recaptchaToken) {
      const recaptcha = await verifyRecaptcha(data.recaptchaToken, ip)
      if (!recaptcha.success) {
        throw new ValidationError('reCAPTCHA verification failed', recaptcha)
      }
    }

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
    const passwordHash = await hash(data.password, 10)

    // Create user
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

    if (!isFirstUser) {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await prisma.emailVerificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
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
    if (error instanceof ApiError) {
      throw error
    }
    throw error
  }
}

export const POST = withErrorHandler(handler)
