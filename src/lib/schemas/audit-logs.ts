// src/lib/schemas/audit-logs.ts
import { z } from 'zod'

import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from './common'

// Enums from Prisma schema
export const AuditEntityTypeEnum = z
  .enum([
    'USER',
    'ORDER',
    'SERVICE_REQUEST',
    'CONTACT_MESSAGE',
    'FOOD_ITEM',
    'FOOD_CATEGORY',
  ])
  .describe('Type of entity that was affected by the action')

export const AuditActionEnum = z
  .enum(['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'LOGIN', 'LOGOUT'])
  .describe('Type of action performed')

// Query parameters
export const AuditLogsQuery = z
  .object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 1))
      .describe('Page number (default: 1)'),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 20))
      .describe('Number of logs per page (default: 20, max: 100)'),
    entityType: z
      .string()
      .optional()
      .describe(
        'Filter by entity type (USER, ORDER, SERVICE_REQUEST, CONTACT_MESSAGE, FOOD_ITEM, FOOD_CATEGORY) or "ALL"',
      ),
    action: z
      .string()
      .optional()
      .describe(
        'Filter by action (CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGOUT) or "ALL"',
      ),
    actorId: z
      .string()
      .optional()
      .describe('Filter by user ID who performed the action'),
    fromDate: z
      .string()
      .datetime()
      .optional()
      .describe('Start date in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")'),
    toDate: z
      .string()
      .datetime()
      .optional()
      .describe('End date in ISO 8601 format (e.g., "2024-12-31T23:59:59Z")'),
    search: z
      .string()
      .optional()
      .describe('Search by IP address, user agent, actor name, or actor email'),
  })
  .describe('Query parameters for filtering and paginating audit logs')

// Actor (user who performed action)
const AuditActor = z
  .object({
    id: z.number().int().describe('User ID'),
    name: z.string().describe('User name'),
    email: z.string().describe('User email'),
    role: z
      .string()
      .describe(
        'User role (CUSTOMER, ADMIN, SALESMAN, DRIVER, CLEANER, IT_STAFF)',
      ),
  })
  .describe('User who performed the action')

// Single audit log entry
const AuditLogEntry = z
  .object({
    id: z.number().int().describe('Audit log ID'),
    entityType: AuditEntityTypeEnum,
    entityId: z.number().int().describe('ID of the affected entity'),
    action: AuditActionEnum,
    actorId: z
      .number()
      .int()
      .nullable()
      .describe(
        'ID of user who performed the action (null for system actions)',
      ),
    ipAddress: z.string().nullable().describe('IP address of the actor'),
    userAgent: z.string().nullable().describe('User agent string'),
    details: z
      .any()
      .nullable()
      .describe('Additional JSON details about the action'),
    createdAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when action occurred'),
    actor: AuditActor.nullable().describe(
      'User who performed the action (null if actorId is null)',
    ),
  })
  .describe('Single audit log entry')

// Pagination metadata
const PaginationMeta = z
  .object({
    page: z.number().int().min(1).describe('Current page number'),
    limit: z.number().int().min(1).describe('Number of items per page'),
    total: z
      .number()
      .int()
      .min(0)
      .describe('Total number of audit logs matching filters'),
    totalPages: z.number().int().min(0).describe('Total number of pages'),
  })
  .describe('Pagination information')

// Success response
export const AuditLogsSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z
      .array(AuditLogEntry)
      .describe('Array of audit log entries for current page'),
    meta: PaginationMeta,
  })
  .describe('Successful audit logs response with pagination')

// Re-export common error responses
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
