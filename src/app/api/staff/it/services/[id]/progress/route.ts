import { ForbiddenError, NotFoundError, ValidationError } from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import { buildServiceProgressEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'
import { itProgressSchema } from '@/src/lib/validations/service.schema'
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

const appendNotes = (existing: string | null | undefined, note: string) => {
  const stamp = new Date().toLocaleString()
  const entry = `[${stamp}] ${note}`
  if (!existing) return entry
  return `${existing}\n${entry}`
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

  const body = await request.json()
  const data = await validateBody(body, itProgressSchema)

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
        select: {
          id: true,
          staffId: true,
          notes: true,
          timeSpentMinutes: true,
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

  if (service.status !== 'IN_PROGRESS') {
    throw new ValidationError('Service must be in progress to update')
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const progressPhotos = data.photos || []
  const noteText = data.notes?.trim()

  const updated = await prisma.$transaction(async (tx) => {
    if (progressPhotos.length) {
      await tx.servicePhoto.createMany({
        data: progressPhotos.map((url) => ({
          serviceId,
          url,
          type: 'PROGRESS',
        })),
      })
    }

    await tx.serviceAssignment.update({
      where: { id: assignment.id },
      data: {
        notes: noteText
          ? appendNotes(assignment.notes, noteText)
          : assignment.notes ?? undefined,
        timeSpentMinutes: data.timeSpentMinutes
          ? {
              increment: data.timeSpentMinutes,
            }
          : assignment.timeSpentMinutes ?? undefined,
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
          notes: noteText ?? null,
          timeSpentMinutes: data.timeSpentMinutes ?? null,
          photoCount: progressPhotos.length,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return { id: serviceId }
  })

  if (service.customer.email && noteText) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const unsubscribeUrl = service.customer.unsubscribeToken
      ? `${appUrl}/unsubscribe?token=${service.customer.unsubscribeToken}`
      : undefined
    const { html, text } = buildServiceProgressEmail({
      name: service.customer.name,
      requestNumber: service.requestNumber,
      staffName: authRequest.user.name,
      notes: noteText,
      unsubscribeUrl,
    })
    try {
      await sendWithRetry(3, () =>
        sendEmail({
          to: service.customer.email,
          subject: `IT troubleshooting update`,
          html,
          text,
        }),
      )
    } catch (error) {
      console.error('IT progress email failed', error)
    }
  }

  return ApiResponse.success(updated, 'IT progress updated')
}

export const POST = withErrorHandler(handler)


