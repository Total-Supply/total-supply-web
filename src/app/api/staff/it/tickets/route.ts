import { ServicePriority, ServiceStatus } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
  const authRequest = await requireRole(request, ['IT_STAFF'])
  const userId = parseInt(authRequest.user.id)
  const { searchParams } = request.nextUrl

  const statusParam = searchParams.get('status')
  const query = searchParams.get('query')?.trim()

  const statusFilter: ServiceStatus[] | undefined =
    statusParam && statusParam !== 'ALL'
      ? [statusParam as ServiceStatus]
      : undefined

  const tickets = await prisma.serviceRequest.findMany({
    where: {
      type: 'IT_SUPPORT',
      status: statusFilter ? { in: statusFilter } : undefined,
      assignments: {
        some: { staffId: userId },
      },
      OR: query
        ? [
            { requestNumber: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { customer: { name: { contains: query, mode: 'insensitive' } } },
          ]
        : undefined,
    },
    select: {
      id: true,
      requestNumber: true,
      status: true,
      priority: true,
      description: true,
      notes: true,
      createdAt: true,
      requestedDate: true,
      customer: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      address: {
        select: {
          line1: true,
          line2: true,
          city: true,
          postalCode: true,
        },
      },
      assignments: {
        where: { staffId: userId },
        orderBy: { assignedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          assignedAt: true,
          acceptedAt: true,
          startedAt: true,
          completedAt: true,
          notes: true,
          timeSpentMinutes: true,
          completionNotes: true,
          solutionSummary: true,
          followUpRecommendations: true,
        },
      },
      photos: {
        select: {
          id: true,
          url: true,
          type: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: {
          photos: true,
        },
      },
    },
    orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    take: 100,
  })

  const payload = tickets.map((ticket) => ({
    id: ticket.id,
    requestNumber: ticket.requestNumber,
    status: ticket.status,
    priority: ticket.priority,
    description: ticket.description,
    notes: ticket.notes,
    createdAt: ticket.createdAt,
    requestedDate: ticket.requestedDate,
    customer: ticket.customer,
    address: ticket.address,
    assignment: ticket.assignments[0] || null,
    photos: ticket.photos,
    _count: ticket._count,
  }))

  return ApiResponse.success(payload)
}

export const GET = withErrorHandler(handler)
