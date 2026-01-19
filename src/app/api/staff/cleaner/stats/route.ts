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
  const authRequest = await requireRole(request, ['CLEANER'])
  const userId = parseInt(authRequest.user.id)

  const now = new Date()
  const startOfToday = getStartOfDay(now)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 6)
  const startOfMonth = new Date(startOfToday)
  startOfMonth.setDate(startOfMonth.getDate() - 29)

  const [completedToday, pendingCount, completedMonth, assignedCount] =
    await Promise.all([
      prisma.serviceAssignment.count({
        where: {
          staffId: userId,
          status: 'RESOLVED',
          completedAt: { gte: startOfToday },
        },
      }),
      prisma.serviceRequest.count({
        where: {
          type: 'CLEANING',
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
          assignments: { some: { staffId: userId } },
        },
      }),
      prisma.serviceAssignment.count({
        where: {
          staffId: userId,
          status: 'RESOLVED',
          completedAt: { gte: startOfMonth },
        },
      }),
      prisma.serviceAssignment.count({
        where: {
          staffId: userId,
        },
      }),
    ])

  const rating = await prisma.serviceRating.aggregate({
    where: { staffId: userId },
    _avg: { score: true },
    _count: { _all: true },
  })

  const completedHistory = await prisma.serviceAssignment.findMany({
    where: {
      staffId: userId,
      status: 'RESOLVED',
      completedAt: { gte: startOfWeek },
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

  const categories = await prisma.serviceRequest.groupBy({
    by: ['category'],
    where: {
      type: 'CLEANING',
      assignments: { some: { staffId: userId } },
    },
    _count: { _all: true },
  })

  const topCategories = categories
    .map((entry) => ({
      name: entry.category ?? 'UNCATEGORIZED',
      count: entry._count._all,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const completionRate = assignedCount
    ? Math.round((completedMonth / assignedCount) * 100)
    : 0

  return ApiResponse.success({
    completedToday,
    pendingCount,
    completedMonth,
    completionRate,
    averageRating: rating._avg.score || null,
    ratingCount: rating._count._all || 0,
    chart,
    topCategories,
  })
}

export const GET = withErrorHandler(handler)


