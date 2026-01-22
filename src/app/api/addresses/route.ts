// src/app/api/customer/addresses/route.ts
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import {
  ListAddressesQuery,
  ListAddressesSuccessResponse,
} from '@/src/lib/schemas/addresses'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

/**
 * Get User Addresses
 *
 * @description Returns the list of addresses for the currently authenticated user,
 * sorted so the default address appears first, then newest entries. Requires authentication
 * via NextAuth session and active user status.
 *
 * @params ListAddressesQuery
 * @response 200:ListAddressesSuccessResponse:Successful response with addresses
 * @responseSet auth
 *
 * @auth bearer
 * @tag Customer
 * @tag Addresses
 * @openapi
 */
async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const queryParsed = ListAddressesQuery.safeParse({
    includeDefault:
      request.nextUrl.searchParams.get('includeDefault') ?? undefined,
    sortBy: request.nextUrl.searchParams.get('sortBy') ?? undefined,
  })

  const where: { userId: number; isDefault?: boolean } = { userId }

  if (queryParsed.success && queryParsed.data.includeDefault === 'true') {
    where.isDefault = true
  }

  const addresses = await prisma.address.findMany({
    where,
    select: {
      id: true,
      label: true,
      line1: true,
      line2: true,
      city: true,
      postalCode: true,
      country: true,
      isDefault: true,
      createdAt: true,
    },
    orderBy:
      queryParsed.success && queryParsed.data.sortBy === 'oldest'
        ? [{ isDefault: 'desc' }, { createdAt: 'asc' }]
        : [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  const payload = {
    success: true as const,
    data: addresses,
    total: addresses.length,
  }

  const validated = ListAddressesSuccessResponse.parse(payload)

  return ApiResponse.success(validated)
}

export const GET = withErrorHandler(handler)
