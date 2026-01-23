import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { updateUserSchema } from '@/src/lib/validations/user.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * Get User by ID (Admin)
 *
 * @description Returns a single user by ID. Admin only.
 *
 * @params UserIdParams
 * @response 200 - GetAdminUserSuccessResponse - User details
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function getHandler(request: NextRequest, { params }: Params) {
  await requireAdmin(request)

  const { id } = await params
  const userId = Number(id)
  if (Number.isNaN(userId)) {
    return ApiResponse.badRequest('Invalid user id')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return ApiResponse.notFound('User not found')
  }

  return ApiResponse.success(user)
}

/**
 * Update User (Admin)
 *
 * @description Updates a user (role/status/profile updates). Admin only.
 *
 * @params UserIdParams
 * @body UpdateAdminUserBody
 * @response 200 - UpdateAdminUserSuccessResponse - Updated user
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function patchHandler(request: NextRequest, { params }: Params) {
  const authRequest = await requireAdmin(request)
  const adminId = Number(authRequest.user.id)

  const { id } = await params
  const userId = Number(id)

  if (Number.isNaN(userId)) {
    return ApiResponse.badRequest('Invalid user id')
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true, role: true },
  })

  if (!existing) {
    return ApiResponse.notFound('User not found')
  }

  const body = await request.json()
  const data = await validateBody(body, updateUserSchema)

  if (existing.status === 'PENDING_APPROVAL' && data.status === 'ACTIVE') {
    return ApiResponse.badRequest(
      'Use approval route to activate PENDING_APPROVAL users',
    )
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.profileImage !== undefined && {
        profileImage: data.profileImage,
      }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.status !== undefined && { status: data.status }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: userId,
      action: data.status ? 'STATUS_CHANGE' : 'UPDATE',
      actorId: adminId,
      ipAddress: ip,
      details: {
        result: 'SUCCESS',
        actorName: authRequest.user.name,
        ...(data.role !== undefined && {
          role: { from: existing.role, to: data.role },
        }),
        ...(data.status !== undefined && {
          status: { from: existing.status, to: data.status },
        }),
      },
    },
  })

  return ApiResponse.success(updated, 'User updated successfully')
}

/**
 * Delete User (Admin)
 *
 * @description Soft deletes a user (sets deletedAt). Admin only.
 *
 * @params UserIdParams
 * @response 200 - DeleteAdminUserSuccessResponse - Deleted user id
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function deleteHandler(request: NextRequest, { params }: Params) {
  const authRequest = await requireAdmin(request)
  const adminId = Number(authRequest.user.id)

  const { id } = await params
  const userId = Number(id)
  if (Number.isNaN(userId)) {
    return ApiResponse.badRequest('Invalid user id')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, deletedAt: true },
  })

  if (!user) {
    return ApiResponse.notFound('User not found')
  }

  if (user.deletedAt) {
    return ApiResponse.conflict('User already deleted')
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      deletionRequestedAt: new Date(),
      status: 'SUSPENDED', // blocks further access
    },
  })

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: userId,
      action: 'DELETE',
      actorId: adminId,
      ipAddress: ip,
      details: {
        result: 'SUCCESS',
        actorName: authRequest.user.name,
        mode: 'soft_delete',
      },
    },
  })

  return ApiResponse.success({ id: userId }, 'User deleted successfully')
}

export const GET = withErrorHandler(getHandler)
export const PATCH = withErrorHandler(patchHandler)
export const DELETE = withErrorHandler(deleteHandler)
