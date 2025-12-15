import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { generateSignedUploadUrl } from '@/src/lib/gcs'
import { uploadSchema } from '@/src/lib/validations/upload.schema'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { getRateLimitKey, rateLimiters } from '@/src/middleware/rate-limit'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  // Require authentication
  const authRequest = await requireAuth(request)
  const userId = authRequest.user.id

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitKey = getRateLimitKey(userId, ip, 'upload')
  rateLimiters.upload(rateLimitKey)

  // Validate request body
  const body = await request.json()
  const data = await validateBody(body, uploadSchema)

  // Generate signed URL
  const { url, publicUrl } = await generateSignedUploadUrl(
    data.filename,
    data.contentType,
  )

  return ApiResponse.success({
    uploadUrl: url,
    publicUrl,
    expiresIn: 900, // 15 minutes
  })
}

export const POST = withErrorHandler(handler)
