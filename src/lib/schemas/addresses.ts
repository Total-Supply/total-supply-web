// src/lib/schemas/addresses.ts
import { z } from 'zod'

import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from './common'

// Single address object
export const AddressResponse = z
  .object({
    id: z.number().int().positive().describe('Unique address identifier'),
    label: z
      .string()
      .nullable()
      .describe('Address label (e.g., "Home", "Office") or null'),
    line1: z.string().describe('Primary address line (street address)'),
    line2: z
      .string()
      .nullable()
      .describe('Secondary address line (apartment, suite, etc.) or null'),
    city: z.string().describe('City or town name'),
    postalCode: z.string().describe('Postal or ZIP code'),
    country: z.string().describe('Country name (e.g., "Sri Lanka")'),
    isDefault: z
      .boolean()
      .describe('Whether this is the default delivery address'),
    createdAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when address was created'),
  })
  .describe('Single address object')

// List of addresses
export const AddressesListData = z
  .array(AddressResponse)
  .describe('Array of user addresses, sorted by default first, then newest')

// Success response for GET /api/customer/addresses
export const ListAddressesSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AddressesListData,
    total: z.number().int().min(0).describe('Total number of addresses'),
  })
  .describe('Successful addresses list response')

// Query parameters for GET /api/customer/addresses
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
        'Sort order: "default" (isDefault first, then newest), "newest", or "oldest"',
      ),
  })
  .describe('Query parameters for listing addresses')

// Re-export common error responses
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
