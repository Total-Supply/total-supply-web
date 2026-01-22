import { ApiResponse } from '@/src/lib/api/response'
import prisma from '@/src/lib/prisma'
import { requireRole } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'

const getStartOfDay = (date: Date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

const getDateKey = (date: Date) => date.toISOString().slice(0, 10)

async function handler(request: NextRequest) {
  const authRequest = await requireRole(request, ['IT_STAFF'])
  const userId = parseInt(authRequest.user.id)

  const now = new Date()
  const startOfToday = getStartOfDay(now)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 6)
  const startOfMonth = new Date(startOfToday)
  startOfMonth.setDate(startOfMonth.getDate() - 29)

  const [acceptedToday, inProgressCount, resolvedCount, assignedCount] =
    await Promise.all([
      prisma.serviceAssignment.count({
        where: {
          staffId: userId,
          acceptedAt: { gte: startOfToday },
          service: { type: 'IT_SUPPORT' },
        },
      }),
      prisma.serviceRequest.count({
        where: {
          type: 'IT_SUPPORT',
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
          assignments: { some: { staffId: userId } },
        },
      }),
      prisma.serviceAssignment.count({
        where: {
          staffId: userId,
          status: 'RESOLVED',
          completedAt: { gte: startOfMonth },
          service: { type: 'IT_SUPPORT' },
        },
      }),
      prisma.serviceAssignment.count({
        where: {
          staffId: userId,
          service: { type: 'IT_SUPPORT' },
        },
      }),
    ])

  const rating = await prisma.serviceRating.aggregate({
    where: { staffId: userId },
    _avg: { score: true },
    _count: { _all: true },
  })

  const averageTime = await prisma.serviceAssignment.aggregate({
    where: {
      staffId: userId,
      status: 'RESOLVED',
      service: { type: 'IT_SUPPORT' },
    },
    _avg: { timeSpentMinutes: true },
  })

  const completedHistory = await prisma.serviceAssignment.findMany({
    where: {
      staffId: userId,
      status: 'RESOLVED',
      completedAt: { gte: startOfWeek },
      service: { type: 'IT_SUPPORT' },
    },
    select: {
      completedAt: true,
    },
  })

  const completedByDay = new Map<string, number>()
  completedHistory.forEach((entry) => {
    if (!entry.completedAt) return
    const key = getDateKey(entry.completedAt)
    completedByDay.set(key, (completedByDay.get(key) || 0) + 1)
  })

  const chart = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const key = getDateKey(date)
    return {
      date: key,
      count: completedByDay.get(key) || 0,
    }
  })

  const completionRate = assignedCount
    ? Math.round((resolvedCount / assignedCount) * 100)
    : 0

  return ApiResponse.success({
    acceptedToday,
    inProgressCount,
    resolvedCount,
    completionRate,
    averageRating: rating._avg.score || null,
    averageDiagnosisMinutes: Math.round(averageTime._avg.timeSpentMinutes || 0),
    chart,
  })
}

export const GET = withErrorHandler(handler)


