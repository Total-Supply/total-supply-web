import { z } from 'zod'

import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from './common'

/**
 * Query params for data retention route (cron support)
 */
export const DataRetentionQuery = z
  .object({
    token: z
      .string()
      .optional()
      .describe(
        'Optional cron token (alternative to x-cron-token header). Must match DATA_RETENTION_CRON_SECRET',
      ),
  })
  .describe('Query parameters for triggering data retention')

/**
 * Success response data
 */
export const DataRetentionJobResult = z
  .object({
    anonymizedCount: z
      .number()
      .int()
      .min(0)
      .describe('How many users were anonymized'),
    purgedCount: z.number().int().min(0).describe('How many users were purged'),
  })
  .describe('Data retention job result summary')

/**
 * 200 Success response
 */
export const DataRetentionSuccessResponse = z
  .object({
    success: z.literal(true),
    data: DataRetentionJobResult,
    message: z.string().optional().describe('Optional response message'),
  })
  .describe('Successful execution of data retention job')

// Re-export common error responses
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
