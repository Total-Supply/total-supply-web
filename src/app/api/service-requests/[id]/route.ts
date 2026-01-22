import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/src/lib/api/errors'
import { ApiResponse } from '@/src/lib/api/response'
import { validateBody } from '@/src/lib/api/validator'
import prisma from '@/src/lib/prisma'
import { updateServiceRequestSchema } from '@/src/lib/validations/service.schema'
import { rateServiceSchema } from '@/src/lib/validations/service.schema'
import { buildServiceAssignedEmail, sendEmail } from '@/src/lib/email'
import { requireAuth, requireStaff } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const { id } = await params
  const serviceId = parseInt(id, 10)

  if (!Number.isFinite(serviceId)) {
    throw new ValidationError('Invalid service request ID')
  }

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      requestNumber: true,
      type: true,
      category: true,
      status: true,
      priority: true,
      title: true,
      description: true,
      notes: true,
      createdAt: true,
      requestedDate: true,
      customerId: true,
      address: {
        select: {
          line1: true,
          line2: true,
          city: true,
          postalCode: true,
          country: true,
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
      assignments: {
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
          staff: {
            select: {
              id: true,
              name: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      },
      ratings: {
        select: {
          id: true,
          score: true,
          review: true,
          wouldRecommend: true,
          createdAt: true,
          customerId: true,
        },
      },
    },
  })

  if (!service) {
    throw new NotFoundError('Service request not found')
  }

  if (authRequest.user.role !== 'ADMIN' && service.customerId !== userId) {
    throw new ForbiddenError('Cannot access this service request')
  }

  const assignment = service.assignments[0] || null
  const staff = assignment?.staff || null

  const staffRating =
    staff &&
    (await prisma.serviceRating.aggregate({
      where: { staffId: staff.id },
      _avg: { score: true },
      _count: { _all: true },
    }))

  const beforePhotos = service.photos.filter((photo) => photo.type === 'BEFORE')
  const progressPhotos = service.photos.filter(
    (photo) => photo.type === 'PROGRESS',
  )
  const afterPhotos = service.photos.filter((photo) => photo.type === 'AFTER')

  const itHistory =
    service.type === 'IT_SUPPORT'
      ? await prisma.serviceRequest.findMany({
          where: {
            customerId: service.customerId,
            type: 'IT_SUPPORT',
            id: { not: service.id },
          },
          select: {
            id: true,
            requestNumber: true,
            status: true,
            createdAt: true,
            description: true,
            notes: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        })
      : []

  const timeline = [
    {
      status: 'RECEIVED',
      at: service.createdAt,
      by: 'System',
    },
    assignment?.assignedAt && {
      status: 'ASSIGNED',
      at: assignment.assignedAt,
      by: staff?.name || 'Staff assigned',
    },
    assignment?.startedAt && {
      status: 'IN_PROGRESS',
      at: assignment.startedAt,
      by: staff?.name || 'Staff',
    },
    assignment?.completedAt && {
      status: 'RESOLVED',
      at: assignment.completedAt,
      by: staff?.name || 'Staff',
    },
  ].filter(Boolean)

  return ApiResponse.success({
    id: service.id,
    requestNumber: service.requestNumber,
    type: service.type,
    category: service.category,
    status: service.status,
    priority: service.priority,
    title: service.title,
    description: service.description,
    notes: service.notes,
    createdAt: service.createdAt,
    requestedDate: service.requestedDate,
    address: service.address,
    beforePhotos,
    progressPhotos,
    afterPhotos,
    itHistory,
    timeline,
    staff: staff
      ? {
          id: staff.id,
          name: staff.name,
          phone: staff.phone,
          profileImage: staff.profileImage,
          rating: staffRating?._avg.score || null,
          ratingCount: staffRating?._count._all || 0,
          assignedAt: assignment?.assignedAt,
          startedAt: assignment?.startedAt,
          completedAt: assignment?.completedAt,
          notes: assignment?.notes,
          timeSpentMinutes: assignment?.timeSpentMinutes ?? null,
          completionNotes: assignment?.completionNotes,
          solutionSummary: assignment?.solutionSummary,
          followUpRecommendations: assignment?.followUpRecommendations,
        }
      : null,
    rating:
      service.ratings.find((rating) => rating.customerId === userId) || null,
  })
}

async function postHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)
  const { id } = await params
  const serviceId = parseInt(id, 10)

  if (!Number.isFinite(serviceId)) {
    throw new ValidationError('Invalid service request ID')
  }

  const body = await request.json()
  const data = await validateBody(body, rateServiceSchema)

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      customerId: true,
      status: true,
      assignments: {
        take: 1,
        orderBy: { assignedAt: 'desc' },
        select: {
          staffId: true,
        },
      },
    },
  })

  if (!service) {
    throw new NotFoundError('Service request not found')
  }

  if (service.customerId !== userId) {
    throw new ForbiddenError('Cannot rate this service')
  }

  if (service.status !== 'RESOLVED') {
    throw new ValidationError('Service must be resolved before rating')
  }

  const existing = await prisma.serviceRating.findFirst({
    where: { serviceId, customerId: userId },
    select: { id: true },
  })

  if (existing) {
    throw new ConflictError('Service already rated')
  }

  const staffId = service.assignments[0]?.staffId || data.staffId || undefined

  const rating = await prisma.serviceRating.create({
    data: {
      serviceId,
      customerId: userId,
      staffId,
      score: data.score,
      review: data.review,
      wouldRecommend: data.wouldRecommend,
    },
  })

    await prisma.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'UPDATE',
        actorId: userId,
        details: {
          ratingId: rating.id,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

  return ApiResponse.success(rating, 'Rating submitted')
}

export const GET = withErrorHandler(getHandler)

async function patchHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authRequest = await requireStaff(request)
  const userId = parseInt(authRequest.user.id)
  const { id } = await params
  const serviceId = parseInt(id, 10)

  if (!Number.isFinite(serviceId)) {
    throw new ValidationError('Invalid service request ID')
  }

  const body = await request.json()
  const data = await validateBody(body, updateServiceRequestSchema)

  const service = await prisma.serviceRequest.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      status: true,
      requestNumber: true,
      customerId: true,
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

  const updated = await prisma.$transaction(async (tx) => {
    let assignmentId = assignment?.id

    if (data.afterPhotos?.length && data.status !== 'RESOLVED' && service.status !== 'RESOLVED') {
      throw new ValidationError('After photos require resolved status')
    }

    if (data.status === 'ASSIGNED' && !data.staffId && !assignmentId) {
      throw new ValidationError('Staff must be assigned before marking assigned')
    }

    if (data.staffId && (!assignmentId || assignment?.staffId !== data.staffId)) {
      const created = await tx.serviceAssignment.create({
        data: {
          serviceId,
          staffId: data.staffId,
          assignedById: userId,
          assignedAt: new Date(),
          notes: data.notes,
        },
        select: { id: true },
      })
      assignmentId = created.id
    }

    if (data.status === 'IN_PROGRESS' && assignmentId) {
      await tx.serviceAssignment.update({
        where: { id: assignmentId },
        data: {
          startedAt: new Date(),
        },
      })
    }

    if (data.status === 'IN_PROGRESS' && !assignmentId) {
      throw new ValidationError('Assignment required to start service')
    }

    if (data.status === 'RESOLVED' && assignmentId) {
      await tx.serviceAssignment.update({
        where: { id: assignmentId },
        data: {
          completedAt: new Date(),
          notes: data.notes,
        },
      })
    }

    if (data.status === 'RESOLVED' && !assignmentId) {
      throw new ValidationError('Assignment required to resolve service')
    }

    if (data.notes && assignmentId) {
      await tx.serviceAssignment.update({
        where: { id: assignmentId },
        data: { notes: data.notes },
      })
    }

    if (data.afterPhotos?.length) {
      await tx.servicePhoto.createMany({
        data: data.afterPhotos.map((url) => ({
          serviceId,
          url,
          type: 'AFTER',
        })),
      })
    }

    const request = await tx.serviceRequest.update({
      where: { id: serviceId },
      data: {
        status: data.status ?? undefined,
        priority: data.priority ?? undefined,
        category: data.category ?? undefined,
        notes: data.notes ?? undefined,
      },
    })

    await tx.auditLog.create({
      data: {
        entityType: 'SERVICE_REQUEST',
        entityId: serviceId,
        action: 'UPDATE',
        actorId: userId,
        details: {
          status: data.status,
          staffId: data.staffId,
          category: data.category,
          result: 'SUCCESS',
          actorName: authRequest.user.name,
        },
      },
    })

    return request
  })

  if (data.status === 'ASSIGNED' && data.staffId) {
    const [customer, staff] = await Promise.all([
      prisma.user.findUnique({
        where: { id: service.customerId },
        select: { email: true, name: true, unsubscribeToken: true },
      }),
      prisma.user.findUnique({
        where: { id: data.staffId },
        select: { name: true },
      }),
    ])
    if (customer?.email && staff?.name) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const unsubscribeUrl = customer.unsubscribeToken
        ? `${appUrl}/unsubscribe?token=${customer.unsubscribeToken}`
        : undefined
      const etaMinutes = 120
      const eta = new Date(Date.now() + etaMinutes * 60 * 1000).toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' },
      )
      const { html, text } = buildServiceAssignedEmail({
        name: customer.name,
        requestNumber: service.requestNumber,
        staffName: staff.name,
        eta,
        unsubscribeUrl,
      })
      try {
        await sendEmail({
          to: customer.email,
          subject: `Service request assigned`,
          html,
          text,
        })
      } catch (error) {
        console.error('Service assignment email failed', error)
      }
    }
  }

  return ApiResponse.success(updated, 'Service request updated')
}

export const POST = withErrorHandler(postHandler)
export const PATCH = withErrorHandler(patchHandler)


