import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Test query: count users
  const userCount = await prisma.user.count()

  // Get database version
  const result = await prisma.$queryRaw<Array<{ version: string }>>`
    SELECT version();
  `

  return ApiResponse.success({
    userCount,
    database: result[0]?.version,
    timestamp: new Date().toISOString(),
  })
}

export const GET = withErrorHandler(handler)
