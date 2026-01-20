import { Prisma } from '@/generated/prisma'
import type { AuditAction, AuditEntityType } from '@/generated/prisma'
import { authOptions } from '@/src/lib/auth'
import prisma from '@/src/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 },
      )
    }

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

    return NextResponse.json({
      success: true,
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Audit logs fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch audit logs' },
      },
      { status: 500 },
    )
  }
}
