import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { buildITServiceAcceptedEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const MAX_ACTIVE_ASSIGNMENTS = Number(process.env.IT_MAX_ACTIVE || 4)

const sendWithRetry = async (attempts: number, task: () => Promise<void>) => {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      await task()
      return
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) throw lastError
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authRequest = await requireRole(request, ['IT_STAFF'])
  const userId = parseInt(authRequest.user.id)
  const { id } = await params
  const serviceId = parseInt(id, 10)

  if (!Number.isFinite(serviceId)) {
    throw new ValidationError('Invalid service request ID')
  }

  const activeCount = await prisma.serviceRequest.count({
    where: {
      status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
      assignments: { some: { staffId: userId } },
    },
  })

  if (activeCount >= MAX_ACTIVE_ASSIGNMENTS) {
    throw new ValidationError('Capacity reached. Resolve current services first.')
  }

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      status: true,
      requestNumber: true,
      requestedDate: true,
      customer: {
        select: {
          name: true,
          email: true,
          unsubscribeToken: true,
        },
      },
      assignments: {
        orderBy: { assignedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          staffId: true,
          acceptedAt: true,
        },
      },
    },
  })

  if (!service) {
    throw new NotFoundError('Service request not found')
  }

  const assignment = service.assignments[0]

  if (!assignment || assignment.staffId !== userId) {
    throw new ForbiddenError('Service not assigned to you')
  }

  if (service.status !== 'ASSIGNED') {
    throw new ValidationError('Only assigned services can be accepted')
  }

  if (assignment.acceptedAt) {
    throw new ValidationError('Service already accepted')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const updated = await prisma.$transaction(async (tx) => {
    await tx.serviceAssignment.update({
      where: { id: assignment.id },
      data: {
        acceptedAt: new Date(),
        startedAt: new Date(),
        status: 'IN_PROGRESS',
      },
    })

    const requestUpdate = await tx.serviceRequest.update({
      where: { id: serviceId },
      data: {
        status: 'IN_PROGRESS',
      },
    })

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'UPDATE',
        actorId: userId,
        ipAddress: ip,
        details: {
          status: 'IN_PROGRESS',
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return requestUpdate
  })

  if (service.customer.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const unsubscribeUrl = service.customer.unsubscribeToken
      ? `${appUrl}/unsubscribe?token=${service.customer.unsubscribeToken}`
      : undefined
    const etaBase = service.requestedDate
      ? new Date(service.requestedDate)
      : new Date(Date.now() + 60 * 60 * 1000)
    const eta = etaBase.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const { html, text } = buildITServiceAcceptedEmail({
      name: service.customer.name,
      requestNumber: service.requestNumber,
      staffName: authRequest.user.name,
      eta,
      unsubscribeUrl,
    })
    try {
      await sendWithRetry(3, () =>
        sendEmail({
          to: service.customer.email,
          subject: `IT technician accepted your request`,
          html,
          text,
        }),
      )
    } catch (error) {
      console.error('IT service accepted email failed', error)
    }
  }

  return ApiResponse.success(updated, 'IT service accepted')
}

export const POST = withErrorHandler(handler)


