import { NextResponse } from 'next/server'

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    [key: string]: unknown
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export class ApiResponse {
  static success<T>(
    data: T,
    message?: string,
    meta?: ApiSuccessResponse['meta'],
    status: number = 200,
  ): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
        meta,
      },
      { status },
    )
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
  ): NextResponse<ApiSuccessResponse<T>> {
    return this.success(data, message, undefined, 201)
  }

  static error(
    message: string,
    code: string = 'ERROR',
    details?: unknown,
    status: number = 400,
  ): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
      },
      { status },
    )
  }

  static badRequest(
    message: string,
    details?: unknown,
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'BAD_REQUEST', details, 400)
  }

  static unauthorized(
    message: string = 'Unauthorized',
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'UNAUTHORIZED', undefined, 401)
  }

  static forbidden(
    message: string = 'Forbidden',
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'FORBIDDEN', undefined, 403)
  }

  static notFound(
    message: string = 'Resource not found',
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'NOT_FOUND', undefined, 404)
  }

  static conflict(
    message: string,
    details?: unknown,
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'CONFLICT', details, 409)
  }

  static tooManyRequests(
    message: string = 'Too many requests',
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'RATE_LIMIT_EXCEEDED', undefined, 429)
  }

  static internalError(
    message: string = 'Internal server error',
    details?: unknown,
  ): NextResponse<ApiErrorResponse> {
    return this.error(message, 'INTERNAL_ERROR', details, 500)
  }

  static validationError(errors: unknown): NextResponse<ApiErrorResponse> {
    return this.error('Validation failed', 'VALIDATION_ERROR', errors, 422)
  }
}
