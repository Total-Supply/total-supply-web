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
  const authRequest = await requireRole(request, ['DRIVER'])
  const userId = parseInt(authRequest.user.id)

  const now = new Date()
  const startOfToday = getStartOfDay(now)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 6)
  const startOfMonth = new Date(startOfToday)
  startOfMonth.setDate(startOfMonth.getDate() - 29)

  const [deliveriesToday, pendingCount, deliveredCount, acceptedCount] =
    await Promise.all([
      prisma.orderStatusHistory.count({
        where: {
          order: { driverId: userId },
          to: 'OUT_FOR_DELIVERY',
          changedAt: { gte: startOfToday },
        },
      }),
      prisma.order.count({
        where: {
          driverId: userId,
          status: { in: ['PREPARING', 'OUT_FOR_DELIVERY'] },
        },
      }),
      prisma.order.count({
        where: {
          driverId: userId,
          status: 'DELIVERED',
        },
      }),
      prisma.orderStatusHistory.count({
        where: {
          order: { driverId: userId },
          to: 'OUT_FOR_DELIVERY',
        },
      }),
    ])

  const history = await prisma.orderStatusHistory.findMany({
    where: {
      order: { driverId: userId },
      to: { in: ['OUT_FOR_DELIVERY', 'DELIVERED'] },
      changedAt: { gte: startOfMonth },
    },
    select: {
      orderId: true,
      to: true,
      changedAt: true,
    },
    orderBy: { changedAt: 'asc' },
  })

  const deliveryTimes: number[] = []
  const byOrder = new Map<number, { outAt?: Date; deliveredAt?: Date }>()
  const completedByDay = new Map<string, number>()

  history.forEach((entry) => {
    if (!byOrder.has(entry.orderId)) {
      byOrder.set(entry.orderId, {})
    }
    const tracker = byOrder.get(entry.orderId)
    if (!tracker) return
    if (entry.to === 'OUT_FOR_DELIVERY') {
      tracker.outAt = entry.changedAt
    }
    if (entry.to === 'DELIVERED') {
      tracker.deliveredAt = entry.changedAt
      const key = getDateKey(entry.changedAt)
      completedByDay.set(key, (completedByDay.get(key) || 0) + 1)
    }
  })

  byOrder.forEach((tracker) => {
    if (tracker.outAt && tracker.deliveredAt) {
      const diff = tracker.deliveredAt.getTime() - tracker.outAt.getTime()
      if (diff > 0) {
        deliveryTimes.push(diff / 60000)
      }
    }
  })

  const averageDeliveryMinutes = deliveryTimes.length
    ? Math.round(
        deliveryTimes.reduce((sum, value) => sum + value, 0) /
          deliveryTimes.length,
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
    deliveriesToday,
    pendingCount,
    completedCount: deliveredCount,
    averageDeliveryMinutes,
    completionRate,
    averageRating: null,
    chart,
  })
}

export const GET = withErrorHandler(handler)


