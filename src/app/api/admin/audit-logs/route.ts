// src/app/api/admin/audit-logs/route.ts
import type { AuditAction, AuditEntityType } from '@/generated/prisma'
import { Prisma } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { AuditLogsSuccessResponse } from '@/src/lib/schemas/audit-logs'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Get Audit Logs
 *
 * @description Retrieves paginated audit logs with advanced filtering capabilities. Supports
 * filtering by entity type, action, actor, date range, and full-text search across IP address,
 * user agent, and actor details. Only accessible to ADMIN users.
 *
 * @params AuditLogsQuery
 * @response 200:AuditLogsSuccessResponse:Successful response with audit logs
 * @responseSet auth
 *
 * @auth bearer
 * @tag Admin
 * @tag Audit
 * @openapi
 */
async function handler(request: NextRequest) {
  await requireAdmin(request)

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const entityType = searchParams.get('entityType')
  const action = searchParams.get('action')
  const actorId = searchParams.get('actorId')
  const fromDate = searchParams.get('fromDate')
  const toDate = searchParams.get('toDate')
  const search = searchParams.get('search')

  const where: Prisma.AuditLogWhereInput = {}

  if (entityType && entityType !== 'ALL') {
    where.entityType = entityType as AuditEntityType
  }

  if (action && action !== 'ALL') {
    where.action = action as AuditAction
  }

  if (actorId) {
    where.actorId = parseInt(actorId)
  }

  if (fromDate || toDate) {
    where.createdAt = {}
    if (fromDate) {
      where.createdAt.gte = new Date(fromDate)
    }
    if (toDate) {
      where.createdAt.lte = new Date(toDate)
    }
  }

  if (search) {
    where.OR = [
      { ipAddress: { contains: search } },
      { userAgent: { contains: search } },
      { actor: { name: { contains: search } } },
      { actor: { email: { contains: search } } },
    ]
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ])

  const responseData = {
    success: true as const,
    data: logs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }

  const validated = AuditLogsSuccessResponse.parse(responseData)

  return ApiResponse.success(validated)
}

export const GET = withErrorHandler(handler)
