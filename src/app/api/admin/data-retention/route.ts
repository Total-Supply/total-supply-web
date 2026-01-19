import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { runDataRetention } from '@/src/lib/data-retention'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const cronToken = request.headers.get('x-cron-token')
  const queryToken = request.nextUrl.searchParams.get('token')
  const secret = process.env.DATA_RETENTION_CRON_SECRET
  const isCron = secret && (cronToken === secret || queryToken === secret)

  const authRequest = isCron ? null : await requireAdmin(request)
  const { anonymizedCount, purgedCount } = await runDataRetention()

  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: authRequest?.user.id ? Number(authRequest.user.id) : 0,
      action: 'UPDATE',
      actorId: authRequest?.user.id ? Number(authRequest.user.id) : null,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      details: {
        anonymizedCount,
        purgedCount,
        result: 'SUCCESS',
        actorName: authRequest?.user.name ?? 'SYSTEM_CRON',
        trigger: isCron ? 'cron' : 'admin',
      },
    },
  })

  return ApiResponse.success(
    {
      anonymizedCount,
      purgedCount,
    },
    'Data retention job completed',
  )
}

export const POST = withErrorHandler(handler)


