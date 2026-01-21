// src/lib/schemas/common.ts
import { z } from 'zod'

/**
 * Standard error response structure used across all endpoints
 */
export const ErrorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string().describe('Human-readable error message'),
    code: z.string().optional().describe('Machine-readable error code'),
    details: z.unknown().optional().describe('Additional error context'),
  }),
})

/**
 * 400 Bad Request - Invalid request
 */
export const BadRequestResponse = ErrorResponse.describe(
  'Invalid request parameters or body',
)

/**
 * 401 Unauthorized - Authentication required
 */
export const UnauthorizedResponse = ErrorResponse.describe(
  'Authentication required - user is not logged in or session is invalid',
)

/**
 * 403 Forbidden - Insufficient permissions
 */
export const ForbiddenResponse = ErrorResponse.describe(
  'User does not have permission to access this resource (account may be suspended, rejected, or pending approval)',
)

/**
 * 404 Not Found - Resource not found
 */
export const NotFoundResponse = ErrorResponse.describe(
  'Requested resource was not found',
)

/**
 * 409 Conflict - Resource already exists
 */
export const ConflictResponse = ErrorResponse.describe(
  'Resource already exists (duplicate entry)',
)

/**
 * 422 Unprocessable Entity - Validation failed
 */
export const ValidationErrorResponse = z
  .object({
    success: z.literal(false),
    error: z.object({
      message: z.string().describe('Validation error message'),
      code: z.literal('VALIDATION_ERROR'),
      details: z
        .array(
          z.object({
            code: z.string().describe('Zod error code'),
            path: z
              .array(z.union([z.string(), z.number()]))
              .describe('Field path'),
            message: z.string().describe('Field-specific error message'),
          }),
        )
        .describe('Array of validation issues'),
    }),
  })
  .describe('Validation failed on request body or parameters')

/**
 * 500 Internal Server Error
 */
export const InternalServerErrorResponse = ErrorResponse.describe(
  'Unexpected server error occurred',
)
