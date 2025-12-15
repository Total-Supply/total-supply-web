import { ApiError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle custom API errors
  if (error instanceof ApiError) {
    return ApiResponse.error(
      error.message,
      error.code,
      error.details,
      error.statusCode,
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return ApiResponse.validationError(error.errors)
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Prisma Error Code:', error.code)
    console.error('Prisma Error Meta:', error.meta)

    switch (error.code) {
      case 'P2002':
        return ApiResponse.conflict('Resource already exists', {
          fields: error.meta?.target,
        })
      case 'P2025':
        return ApiResponse.notFound('Resource not found')
      case 'P2003':
        return ApiResponse.badRequest('Invalid reference', {
          field: error.meta?.field_name,
        })
      default:
        return ApiResponse.internalError('Database error', {
          code: error.code,
          message:
            process.env.NODE_ENV === 'development' ? error.message : undefined,
        })
    }
  }

  // Handle Prisma Client Initialization Error
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('Prisma Initialization Error:', error.message)
    return ApiResponse.internalError('Database connection failed', {
      message:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }

  // Handle unknown errors
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

export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
