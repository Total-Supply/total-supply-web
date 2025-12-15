import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { updateProfileSchema } from '@/src/lib/validations/auth.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Get authenticated user
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  // Validate request body
  const body = await request.json()
  const data = await validateBody(body, updateProfileSchema)

  // Update user profile
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone || null }),
      ...(data.profileImage && { profileImage: data.profileImage }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      profileImage: true,
      updatedAt: true,
    },
  })

  // Create audit log
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: userId,
      action: 'UPDATE',
      actorId: userId,
      ipAddress: ip,
      details: { updatedFields: Object.keys(data) },
    },
  })

  return ApiResponse.success(user, 'Profile updated successfully')
}

export const PUT = withErrorHandler(handler)
