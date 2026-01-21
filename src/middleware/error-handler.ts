import { ApiError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { authOptions } from '@/src/lib/auth'
import prisma from '@/src/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return ApiResponse.error(
      error.message,
      error.code,
      error.details,
      error.statusCode,
    )
  }

  // ✅ Zod v4 uses `issues`
  if (error instanceof ZodError) {
    return ApiResponse.validationError(error.issues)
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as {
      code: string
      meta?: Record<string, unknown>
      message: string
    }
    console.error('Prisma Error Code:', prismaError.code)
    console.error('Prisma Error Meta:', prismaError.meta)

    switch (prismaError.code) {
      case 'P2002':
        return ApiResponse.conflict('Resource already exists', {
          fields: prismaError.meta?.target,
        })
      case 'P2025':
        return ApiResponse.notFound('Resource not found')
      case 'P2003':
        return ApiResponse.badRequest('Invalid reference', {
          field: prismaError.meta?.field_name,
        })
      default:
        return ApiResponse.internalError('Database error', {
          code: prismaError.code,
          message:
            process.env.NODE_ENV === 'development'
              ? prismaError.message
              : undefined,
        })
    }
  }

  if (error instanceof Error) {
    return ApiResponse.internalError(
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Internal server error',
      {
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    )
  }

  return ApiResponse.internalError('An unexpected error occurred')
}

async function logFailureAudit({
  request,
  error,
  response,
}: {
  request?: NextRequest
  error: unknown
  response?: NextResponse
}) {
  if (!request) return

  const method = request.method?.toUpperCase()
  if (!method || method === 'GET') return

  try {
    const session = await getServerSession(authOptions)
    const actorIdRaw = session?.user?.id
    const actorId = actorIdRaw ? parseInt(actorIdRaw, 10) : null

    let errorCode: string | undefined
    let errorMessage: string | undefined
    let statusCode: number | undefined

    if (error instanceof ApiError) {
      errorCode = error.code
      errorMessage = error.message
      statusCode = error.statusCode
    } else if (error instanceof ZodError) {
      errorCode = 'VALIDATION_ERROR'
      errorMessage = 'Validation failed'
      statusCode = 422
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    if (!statusCode && response) {
      statusCode = response.status
    }

    await prisma.auditLog.create({
      data: {
        entityType: 'USER',
        entityId: actorId ?? 0,
        action: 'UPDATE',
        actorId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || undefined,
        details: {
          result: 'FAILURE',
          actorName: session?.user?.name ?? null,
          path: request.nextUrl?.pathname,
          method,
          errorCode,
          errorMessage,
          statusCode,
        },
      },
    })
  } catch (logError) {
    console.error('Audit failure log error:', logError)
  }
}

export function withErrorHandler<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const response = handleApiError(error)
      const request = args.find(
        (arg) => arg && typeof arg === 'object' && 'method' in arg,
      ) as NextRequest | undefined
      await logFailureAudit({ request, error, response })
      return response
    }
  }
}
