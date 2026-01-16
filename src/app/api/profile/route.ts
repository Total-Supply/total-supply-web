import { ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { isCityServiceable } from '@/src/lib/service-area'
import { profileUpdateSchema } from '@/src/lib/validations/profile.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function getHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profileImage: true,
    },
  })

  const address = await prisma.address.findFirst({
    where: { userId, isDefault: true },
    select: {
      id: true,
      line1: true,
      city: true,
      postalCode: true,
    },
  })

  return ApiResponse.success({
    ...user,
    addressLine1: address?.line1 || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
  })
}

async function putHandler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const body = await request.json()
  const data = await validateBody(body, profileUpdateSchema)

  if (!isCityServiceable(data.city)) {
    throw new ValidationError('Address is outside service area', {
      city: data.city,
    })
  }

  const existingAddress = await prisma.address.findFirst({
    where: { userId, isDefault: true },
    select: { id: true },
  })

  const [user, address] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        ...(data.profileImage && { profileImage: data.profileImage }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
        updatedAt: true,
      },
    }),
    existingAddress
      ? prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            line1: data.addressLine1,
            city: data.city,
            postalCode: data.postalCode,
          },
          select: {
            id: true,
            line1: true,
            city: true,
            postalCode: true,
          },
        })
      : prisma.address.create({
          data: {
            userId,
            line1: data.addressLine1,
            city: data.city,
            postalCode: data.postalCode,
            country: 'Sri Lanka',
            isDefault: true,
          },
          select: {
            id: true,
            line1: true,
            city: true,
            postalCode: true,
          },
        }),
  ])

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: userId,
      action: 'UPDATE',
      actorId: userId,
      ipAddress: ip,
      details: {
        updatedFields: ['name', 'phone', 'profileImage', 'addressLine1', 'city', 'postalCode'],
      },
    },
  })

  return ApiResponse.success({
    ...user,
    addressLine1: address.line1,
    city: address.city,
    postalCode: address.postalCode,
  }, 'Profile updated')
}

export const GET = withErrorHandler(getHandler)
export const PUT = withErrorHandler(putHandler)
