import { ApiResponse } from '@/src/lib/api/response'
import { runDataRetention } from '@/src/lib/data-retention'
import prisma from '@/src/lib/prisma'
import {
  DataRetentionQuery,
  DataRetentionSuccessResponse,
} from '@/src/lib/schemas/data-retention'
import { requireAdmin } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Run Data Retention Job
 *
 * @description Runs your data retention process (anonymize + purge).
 * Can be triggered by:
 * 1) ADMIN session (Bearer auth)
 * 2) Cron trigger with secret token (header `x-cron-token` OR query param `token`)
 *
 * @params DataRetentionQuery
 * @response 200:DataRetentionSuccessResponse:Data retention completed
 * @responseSet adminCrud
 *
 * @auth bearer
 * @tag Admin
 * @tag DataRetention
 * @openapi
 */
export const POST = withErrorHandler(async function POST(request: NextRequest) {
  const cronToken = request.headers.get('x-cron-token')

  const parsedQuery = DataRetentionQuery.safeParse({
    token: request.nextUrl.searchParams.get('token') ?? undefined,
  })

  const queryToken = parsedQuery.success ? parsedQuery.data.token : undefined
  const secret = process.env.DATA_RETENTION_CRON_SECRET

  const isCron = Boolean(
    secret && (cronToken === secret || queryToken === secret),
  )

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

  const payload = {
    success: true as const,
    data: { anonymizedCount, purgedCount },
    message: 'Data retention job completed',
  }

  // optional: validate response structure
  const validated = DataRetentionSuccessResponse.parse(payload)

  return ApiResponse.success(validated.data, validated.message)
})
