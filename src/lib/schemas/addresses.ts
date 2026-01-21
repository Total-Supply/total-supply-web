// src/lib/schemas/addresses.ts
import { z } from 'zod'

export const AddressResponse = z
  .object({
    id: z.number().int().positive().describe('Unique address identifier'),
    label: z.string().nullable().describe('Address label or null if not set'),
    line1: z.string().describe('Primary address line (street address)'),
    line2: z
      .string()
      .nullable()
      .describe('Secondary address line (apartment, suite, etc.)'),
    city: z.string().describe('City or town name'),
    postalCode: z.string().describe('Postal or ZIP code'),
    country: z.string().describe('Country name (e.g. Sri Lanka)'),
    isDefault: z
      .boolean()
      .describe('Whether this is the default delivery address'),
    createdAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when address was created'),
  })
  .describe('Single address object')

export const AddressesListData = z
  .array(AddressResponse)
  .describe('User addresses, sorted by default first, then newest')

export const ListAddressesSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AddressesListData,
    total: z.number().int().min(0).describe('Total number of addresses'),
  })
  .describe('Successful addresses list response')

export const ErrorResponse = z
  .object({
    success: z.literal(false),
    error: z.object({
      message: z.string().describe('Human-readable error message'),
    }),
  })
  .describe('Standard error response for this endpoint')

export const UnauthorizedErrorResponse = ErrorResponse.describe(
  'User is not authenticated or session is invalid',
)

export const ForbiddenErrorResponse = ErrorResponse.describe(
  'User account is suspended or not allowed to access this resource',
)

export const ServerErrorResponse = ErrorResponse.describe(
  'Unexpected server error while fetching addresses',
)

export const ListAddressesQuery = z
  .object({
    includeDefault: z
      .string()
      .optional()
      .describe('If "true", only return the default address'),
    sortBy: z
      .enum(['default', 'newest', 'oldest'])
      .optional()
      .describe(
        'Sort order: default (isDefault first, then newest), newest, or oldest',
      ),
  })
  .describe('Query parameters for listing addresses')
