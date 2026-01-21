import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * Get My Service Timeline
 *
 * @description Returns a timeline built from AuditLog + ServiceAssignment changes
 * for the authenticated customer's service request.
 *
 * @pathParams ServiceIdParams
 * @response 200 - GetCustomerServiceTimelineSuccessResponse - Timeline
 * @responseSet auth,crud
 *
 * @auth bearer
 * @tag Customer
 * @tag Services
 * @openapi
 */
async function handler(request: NextRequest, { params }: Params) {
  const authRequest = await requireAuth(request)
  const customerId = Number(authRequest.user.id)

  const { id } = await params
  const serviceId = Number(id)
  if (Number.isNaN(serviceId)) {
    return ApiResponse.badRequest('Invalid service id')
  }

  const service = await prisma.serviceRequest.findFirst({
    where: { id: serviceId, customerId },
    select: { id: true, requestNumber: true },
  })

  if (!service) {
    return ApiResponse.notFound('Service request not found')
  }

  const [auditLogs, assignments] = await Promise.all([
    prisma.auditLog.findMany({
      where: { entityType: 'SERVICE_REQUEST', entityId: serviceId },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.serviceAssignment.findMany({
      where: { serviceId },
      orderBy: { assignedAt: 'asc' },
      select: {
        id: true,
        staffId: true,
        status: true,
        assignedAt: true,
        acceptedAt: true,
        startedAt: true,
        completedAt: true,
        notes: true,
      },
    }),
  ])

  const timeline: Array<{
    type: 'AUDIT' | 'ASSIGNMENT'
    createdAt: string
    title: string
    details?: Record<string, unknown> | null
  }> = []

  for (const a of auditLogs) {
    timeline.push({
      type: 'AUDIT',
      createdAt: a.createdAt.toISOString(),
      title: `Audit: ${a.action}`,
      details: Array.isArray(a.details)
        ? { value: a.details }
        : typeof a.details === 'object' && a.details !== null
          ? (a.details as Record<string, unknown>)
          : a.details != null
            ? { value: a.details }
            : null,
    })
  }

  for (const asg of assignments) {
    timeline.push({
      type: 'ASSIGNMENT',
      createdAt: asg.assignedAt.toISOString(),
      title: `Assigned to staff #${asg.staffId}`,
      details: {
        assignmentId: asg.id,
        status: asg.status,
        acceptedAt: asg.acceptedAt?.toISOString() ?? null,
        startedAt: asg.startedAt?.toISOString() ?? null,
        completedAt: asg.completedAt?.toISOString() ?? null,
        notes: asg.notes ?? null,
      },
    })
  }

  timeline.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  return ApiResponse.success({
    serviceId: service.id,
    requestNumber: service.requestNumber,
    timeline,
  })
}

export const GET = withErrorHandler(handler)
