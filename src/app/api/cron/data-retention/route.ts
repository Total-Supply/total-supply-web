import { ApiResponse } from '@/src/lib/api/response'
import { runDataRetention } from '@/src/lib/data-retention'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const token = request.headers.get('x-cron-token')
  const queryToken = request.nextUrl.searchParams.get('token')
  const secret = process.env.DATA_RETENTION_CRON_SECRET
  if (!secret || (token !== secret && queryToken !== secret)) {
    return ApiResponse.unauthorized('Invalid cron token')
  }

  const { anonymizedCount, purgedCount } = await runDataRetention()

  await prisma.auditLog.create({
    data: {
      entityType: 'USER',
      entityId: 0,
      action: 'UPDATE',
      actorId: null,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      details: {
        anonymizedCount,
        purgedCount,
        result: 'SUCCESS',
        actorName: 'SYSTEM_CRON',
        trigger: 'cron',
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


