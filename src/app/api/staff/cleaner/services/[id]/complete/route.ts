import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildServiceCompletedEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { completeServiceSchema } from '@/src/lib/validations/service.schema'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

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
  const authRequest = await requireRole(request, ['CLEANER'])
  const userId = parseInt(authRequest.user.id)
  const { id } = await params
  const serviceId = parseInt(id, 10)

  if (!Number.isFinite(serviceId)) {
    throw new ValidationError('Invalid service request ID')
  }

  const body = await request.json()
  const data = await validateBody(body, completeServiceSchema)

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      status: true,
      requestNumber: true,
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
        select: { id: true, staffId: true },
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

  if (service.status !== 'IN_PROGRESS') {
    throw new ValidationError('Only in-progress services can be completed')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const updated = await prisma.$transaction(async (tx) => {
    await tx.servicePhoto.createMany({
      data: data.photos.map((url) => ({
        serviceId,
        url,
        type: 'AFTER',
      })),
    })

    await tx.serviceAssignment.update({
      where: { id: assignment.id },
      data: {
        completedAt: new Date(),
        status: 'RESOLVED',
        notes: data.notes,
      },
    })

    const requestUpdate = await tx.serviceRequest.update({
      where: { id: serviceId },
      data: {
        status: 'RESOLVED',
        notes: data.notes,
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
          status: 'RESOLVED',
          notes: data.notes,
          photoCount: data.photos.length,
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
    const { html, text } = buildServiceCompletedEmail({
      name: service.customer.name,
      requestNumber: service.requestNumber,
      staffName: authRequest.user.name,
      notes: data.notes,
      photoUrls: data.photos,
      unsubscribeUrl,
    })
    try {
      await sendWithRetry(3, () =>
        sendEmail({
          to: service.customer.email,
          subject: `Cleaning complete`,
          html,
          text,
        }),
      )
    } catch (error) {
      console.error('Service completion email failed', error)
    }
  }

  return ApiResponse.success(updated, 'Service completed')
}

export const POST = withErrorHandler(handler)


