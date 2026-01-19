import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return ApiResponse.badRequest('Token is required')
  }

  const user = await prisma.user.findUnique({
    where: { unsubscribeToken: token },
    select: { id: true },
  })

  if (!user) {
    return ApiResponse.notFound('Invalid token')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      marketingOptIn: false,
    },
  })

  return ApiResponse.success({ success: true }, 'Unsubscribed successfully')
}

export const GET = withErrorHandler(handler)


