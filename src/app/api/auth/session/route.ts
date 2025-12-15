import { ApiResponse } from '@/src/lib/api/response'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)

  return ApiResponse.success({
    user: authRequest.user,
  })
}

export const GET = withErrorHandler(handler)
