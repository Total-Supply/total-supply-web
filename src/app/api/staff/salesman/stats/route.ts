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

const getDateKey = (date: Date) =>
  date.toISOString().slice(0, 10)

async function handler(request: NextRequest) {
  const authRequest = await requireRole(request, ['SALESMAN'])
  const userId = parseInt(authRequest.user.id)

  const now = new Date()
  const startOfToday = getStartOfDay(now)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 6)
  const startOfMonth = new Date(startOfToday)
  startOfMonth.setDate(startOfMonth.getDate() - 29)

  const [acceptedToday, pendingCount, deliveredCount, acceptedCount] =
    await Promise.all([
      prisma.orderStatusHistory.count({
        where: {
          order: { salesmanId: userId },
          to: 'ACCEPTED',
          changedAt: { gte: startOfToday },
        },
      }),
      prisma.order.count({
        where: {
          salesmanId: userId,
          status: { in: ['PENDING', 'ACCEPTED', 'PREPARING'] },
        },
      }),
      prisma.order.count({
        where: {
          salesmanId: userId,
          status: 'DELIVERED',
        },
      }),
      prisma.orderStatusHistory.count({
        where: {
          order: { salesmanId: userId },
          to: 'ACCEPTED',
        },
      }),
    ])

  const history = await prisma.orderStatusHistory.findMany({
    where: {
      order: { salesmanId: userId },
      to: { in: ['ACCEPTED', 'PREPARING', 'DELIVERED'] },
      changedAt: { gte: startOfMonth },
    },
    select: {
      orderId: true,
      to: true,
      changedAt: true,
    },
    orderBy: { changedAt: 'asc' },
  })

  const prepTimes: number[] = []
  const byOrder = new Map<
    number,
    { acceptedAt?: Date; preparingAt?: Date }
  >()
  const completedByDay = new Map<string, number>()

  history.forEach((entry) => {
    if (!byOrder.has(entry.orderId)) {
      byOrder.set(entry.orderId, {})
    }
    const tracker = byOrder.get(entry.orderId)
    if (!tracker) return
    if (entry.to === 'ACCEPTED') {
      tracker.acceptedAt = entry.changedAt
    }
    if (entry.to === 'PREPARING') {
      tracker.preparingAt = entry.changedAt
    }
    if (entry.to === 'DELIVERED') {
      const key = getDateKey(entry.changedAt)
      completedByDay.set(key, (completedByDay.get(key) || 0) + 1)
    }
  })

  byOrder.forEach((tracker) => {
    if (tracker.acceptedAt && tracker.preparingAt) {
      const diff =
        tracker.preparingAt.getTime() - tracker.acceptedAt.getTime()
      if (diff > 0) {
        prepTimes.push(diff / 60000)
      }
    }
  })

  const averagePrepMinutes = prepTimes.length
    ? Math.round(
        prepTimes.reduce((sum, value) => sum + value, 0) / prepTimes.length,
      )
    : 0

  const completionRate = acceptedCount
    ? Math.round((deliveredCount / acceptedCount) * 100)
    : 0

  const chart = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const key = getDateKey(date)
    return {
      date: key,
      count: completedByDay.get(key) || 0,
    }
  })

  return ApiResponse.success({
    acceptedToday,
    pendingCount,
    completedCount: deliveredCount,
    averagePrepMinutes,
    completionRate,
    averageRating: null,
    chart,
  })
}

export const GET = withErrorHandler(handler)


