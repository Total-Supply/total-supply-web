import { authOptions } from '@/src/lib/auth'
import prisma from '@/src/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {}
    if (fromDate || toDate) {
      dateFilter.createdAt = {}
      if (fromDate) {
        dateFilter.createdAt.gte = new Date(fromDate)
      }
      if (toDate) {
        dateFilter.createdAt.lte = new Date(toDate)
      }
    }

    // Users Analytics
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      suspendedUsers,
      customerCount,
      staffCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({
        where: {
          role: { in: ['ADMIN', 'SALESMAN', 'DRIVER', 'CLEANER', 'IT_STAFF'] },
        },
      }),
    ])

    // Orders Analytics
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      canceledOrders,
      revenueData,
    ] = await Promise.all([
      prisma.order.count({ where: dateFilter }),
      prisma.order.count({ where: { status: 'PENDING', ...dateFilter } }),
      prisma.order.count({ where: { status: 'DELIVERED', ...dateFilter } }),
      prisma.order.count({ where: { status: 'CANCELED', ...dateFilter } }),
      prisma.order.aggregate({
        where: { status: 'DELIVERED', ...dateFilter },
        _sum: { totalPrice: true },
      }),
    ])

    const totalRevenue = revenueData._sum.totalPrice || 0

    // Service Requests Analytics
    const [
      totalServiceRequests,
      receivedServiceRequests,
      resolvedServiceRequests,
      canceledServiceRequests,
      cleaningServices,
      itServices,
    ] = await Promise.all([
      prisma.serviceRequest.count({ where: dateFilter }),
      prisma.serviceRequest.count({
        where: { status: 'RECEIVED', ...dateFilter },
      }),
      prisma.serviceRequest.count({
        where: { status: 'RESOLVED', ...dateFilter },
      }),
      prisma.serviceRequest.count({
        where: { status: 'CANCELED', ...dateFilter },
      }),
      prisma.serviceRequest.count({
        where: { type: 'CLEANING', ...dateFilter },
      }),
      prisma.serviceRequest.count({
        where: { type: 'IT_SUPPORT', ...dateFilter },
      }),
    ])

    // Contact Messages Analytics
    const [totalMessages, openMessages, resolvedMessages] = await Promise.all([
      prisma.contactMessage.count({ where: { ...dateFilter } }),
      prisma.contactMessage.count({ where: { status: 'OPEN', ...dateFilter } }),
      prisma.contactMessage.count({
        where: { status: 'RESOLVED', ...dateFilter },
      }),
    ])

    // Top Products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['foodItemId'],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    })

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.foodItem.findUnique({
          where: { id: item.foodItemId },
          select: { id: true, name: true, price: true, categoryId: true },
        })
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.id,
        }
      }),
    )

    // Orders by Status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
      where: dateFilter,
    })

    // Service Requests by Type
    const servicesByType = await prisma.serviceRequest.groupBy({
      by: ['type'],
      _count: { id: true },
      where: dateFilter,
    })

    // Revenue Trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyRevenue = await prisma.$queryRaw<
      Array<{ date: Date; revenue: number; orders: number }>
    >`
      SELECT 
        DATE(o."createdAt") as date,
        CAST(SUM(o."totalPrice") AS DECIMAL) as revenue,
        COUNT(o.id)::integer as orders
      FROM "Order" o
      WHERE o.status = 'DELIVERED'
        AND o."createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE(o."createdAt")
      ORDER BY date ASC
    `

    // User Growth (last 30 days)
    const dailyUsers = await prisma.$queryRaw<
      Array<{ date: Date; count: number }>
    >`
      SELECT 
        DATE(u."createdAt") as date,
        COUNT(u.id)::integer as count
      FROM "User" u
      WHERE u."createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE(u."createdAt")
      ORDER BY date ASC
    `

    // Recent Activity
    const recentActivity = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          pendingUsers,
          suspendedUsers,
          customerCount,
          staffCount,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          canceledOrders,
          totalRevenue: Number(totalRevenue),
          totalServiceRequests,
          receivedServiceRequests,
          resolvedServiceRequests,
          canceledServiceRequests,
          cleaningServices,
          itServices,
          totalMessages,
          openMessages,
          resolvedMessages,
        },
        topProducts: topProductsWithDetails,
        ordersByStatus: ordersByStatus.map((item) => ({
          status: item.status,
          count: item._count.id,
        })),
        servicesByType: servicesByType.map((item) => ({
          type: item.type,
          count: item._count.id,
        })),
        dailyRevenue: dailyRevenue.map((item) => ({
          date: item.date.toISOString().split('T')[0],
          revenue: Number(item.revenue),
          orders: item.orders,
        })),
        dailyUsers: dailyUsers.map((item) => ({
          date: item.date.toISOString().split('T')[0],
          count: item.count,
        })),
        recentActivity,
      },
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch analytics' },
      },
      { status: 500 },
    )
  }
}
