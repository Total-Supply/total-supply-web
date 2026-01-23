import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import {
  createUserSchema,
  getUsersQuerySchema,
} from '@/src/lib/validations/user.schema'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
// ✅ If bcryptjs is not installed: npm i bcryptjs
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

/**
 * List Users (Admin)
 *
 * @description Returns paginated users with filtering and sorting.
 *
 * @params GetUsersQuery
 * @response 200 - ListAdminUsersSuccessResponse - Users list
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function listHandler(request: NextRequest) {
  await requireAdmin(request)

  const searchParams = request.nextUrl.searchParams

  const parsed = getUsersQuerySchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    role: searchParams.get('role') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    sortBy: searchParams.get('sortBy') ?? undefined,
    sortOrder: searchParams.get('sortOrder') ?? undefined,
  })

  const query = parsed.success ? parsed.data : getUsersQuerySchema.parse({})

  const where: Prisma.UserWhereInput = {}

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { phone: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  if (query.role) where.role = query.role

  if (query.status) {
    where.status = query.status
    if (query.status === 'PENDING_APPROVAL') {
      where.emailVerified = { not: null }
    }
  }

  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  }

  const total = await prisma.user.count({ where })

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy,
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  })

  return ApiResponse.success(users, undefined, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  })
}

/**
 * Create User (Admin)
 *
 * @description Creates a new user directly from admin panel.
 * Sets status ACTIVE + emailVerified now by default (admin-created user).
 *
 * @body CreateAdminUserBody
 * @response 201 - CreateAdminUserSuccessResponse - Created user
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag Users
 * @openapi
 */
async function createHandler(request: NextRequest) {
  const authRequest = await requireAdmin(request)
  const adminId = Number(authRequest.user.id)

  const body = await request.json()
  const data = await validateBody(body, createUserSchema)

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  })

  if (existing) {
    return ApiResponse.conflict('Email already exists')
  }

  const passwordHash = await bcrypt.hash(data.password, 12)

  const created = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      phone: data.phone ?? undefined,
      role: data.role ?? 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: new Date(),
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
      entityId: created.id,
      action: 'CREATE',
      actorId: adminId,
      ipAddress: ip,
      details: {
        result: 'SUCCESS',
        actorName: authRequest.user.name,
        createdEmail: created.email,
      },
    },
  })

  return ApiResponse.created(created, 'User created successfully')
}

export const GET = withErrorHandler(listHandler)
export const POST = withErrorHandler(createHandler)
