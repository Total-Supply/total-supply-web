import { UserRole, UserStatus } from '@/generated/prisma'
import { ForbiddenError, UnauthorizedError } from '@/src/lib/api/errors'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
  }
}

export async function requireAuth(
  request: NextRequest,
): Promise<AuthenticatedRequest> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new UnauthorizedError('Authentication required')
  }

  const user = session.user as any

  if (user.status === 'SUSPENDED') {
    throw new ForbiddenError('Account suspended')
  }

  if (user.status === 'REJECTED') {
    throw new ForbiddenError('Account rejected')
  }

  if (user.status === 'PENDING_APPROVAL') {
    throw new ForbiddenError('Account pending approval')
  }

  return Object.assign(request, { user }) as AuthenticatedRequest
}

export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[],
): Promise<AuthenticatedRequest> {
  const authRequest = await requireAuth(request)

  if (!allowedRoles.includes(authRequest.user.role)) {
    throw new ForbiddenError('Insufficient permissions')
  }

  return authRequest
}

export async function requireAdmin(
  request: NextRequest,
): Promise<AuthenticatedRequest> {
  return requireRole(request, ['ADMIN'])
}

export async function requireStaff(
  request: NextRequest,
): Promise<AuthenticatedRequest> {
  return requireRole(request, [
    'ADMIN',
    'SALESMAN',
    'DRIVER',
    'CLEANER',
    'IT_STAFF',
  ])
}
