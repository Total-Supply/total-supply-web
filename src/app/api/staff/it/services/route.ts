import { ServicePriority, ServiceStatus } from '@/generated/prisma'
import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const parseDate = (value: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const getStartOfDay = (value: Date) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

const getEndOfDay = (value: Date) => {
  const date = new Date(value)
  date.setHours(23, 59, 59, 999)
  return date
}

async function handler(request: NextRequest) {
  const authRequest = await requireRole(request, ['IT_STAFF'])
  const userId = parseInt(authRequest.user.id)
  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const dateParam = searchParams.get('date')

  const allowedStatuses: ServiceStatus[] = ['ASSIGNED', 'IN_PROGRESS']
  const selectedStatus = allowedStatuses.includes(status as ServiceStatus)
    ? (status as ServiceStatus)
    : undefined
  const selectedPriority =
    priority && Object.values(ServicePriority).includes(priority as ServicePriority)
      ? (priority as ServicePriority)
      : undefined

  const dateValue = parseDate(dateParam)
  const dateRange = dateValue
    ? {
        gte: getStartOfDay(dateValue),
        lte: getEndOfDay(dateValue),
      }
    : undefined

  const assignments = await prisma.serviceAssignment.findMany({
    where: {
      staffId: userId,
      service: {
        type: 'IT_SUPPORT',
        status: selectedStatus,
        priority: selectedPriority,
        requestedDate: dateRange,
      },
    },
    select: {
      id: true,
      status: true,
      assignedAt: true,
      acceptedAt: true,
      startedAt: true,
      notes: true,
      timeSpentMinutes: true,
      service: {
        select: {
          id: true,
          requestNumber: true,
          type: true,
          status: true,
          priority: true,
          requestedDate: true,
          description: true,
          notes: true,
          createdAt: true,
          address: {
            select: {
              line1: true,
              line2: true,
              city: true,
              postalCode: true,
              country: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          photos: {
            select: {
              id: true,
              url: true,
              type: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
    orderBy: [
      {
        service: {
          requestedDate: 'asc',
        },
      },
      {
        service: {
          createdAt: 'asc',
        },
      },
    ],
  })

  const customerIds = Array.from(
    new Set(assignments.map((entry) => entry.service.customer.id)),
  )

  const history = await prisma.serviceRequest.findMany({
    where: {
      type: 'IT_SUPPORT',
      customerId: { in: customerIds },
    },
    select: {
      id: true,
      requestNumber: true,
      status: true,
      createdAt: true,
      customerId: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const historyByCustomer = new Map<number, typeof history>()
  history.forEach((entry) => {
    if (!historyByCustomer.has(entry.customerId)) {
      historyByCustomer.set(entry.customerId, [])
    }
    historyByCustomer.get(entry.customerId)?.push(entry)
  })

  const payload = assignments.map((assignment) => {
    const customerHistory =
      historyByCustomer
        .get(assignment.service.customer.id)
        ?.filter((entry) => entry.id !== assignment.service.id)
        .slice(0, 3) || []
    return {
      id: assignment.id,
      status: assignment.service.status,
      assignedAt: assignment.assignedAt,
      acceptedAt: assignment.acceptedAt,
      startedAt: assignment.startedAt,
      notes: assignment.notes,
      timeSpentMinutes: assignment.timeSpentMinutes,
      request: {
        id: assignment.service.id,
        requestNumber: assignment.service.requestNumber,
        type: assignment.service.type,
        status: assignment.service.status,
        priority: assignment.service.priority,
        requestedDate: assignment.service.requestedDate,
        createdAt: assignment.service.createdAt,
        description: assignment.service.description,
        notes: assignment.service.notes,
        customer: assignment.service.customer,
        address: assignment.service.address,
        photos: assignment.service.photos,
        history: customerHistory,
      },
    }
  })

  return ApiResponse.success(payload)
}

export const GET = withErrorHandler(handler)


