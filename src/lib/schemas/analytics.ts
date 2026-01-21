// src/lib/schemas/analytics.ts
import { z } from 'zod'

import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from './common'

// Query parameters
export const AnalyticsQuery = z
  .object({
    fromDate: z
      .string()
      .datetime()
      .optional()
      .describe('Start date in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")'),
    toDate: z
      .string()
      .datetime()
      .optional()
      .describe('End date in ISO 8601 format (e.g., "2024-12-31T23:59:59Z")'),
  })
  .describe('Optional date range filter for analytics data')

// Overview section
const AnalyticsOverview = z
  .object({
    totalUsers: z.number().int().min(0).describe('Total count of all users'),
    activeUsers: z.number().int().min(0).describe('Users with ACTIVE status'),
    pendingUsers: z
      .number()
      .int()
      .min(0)
      .describe('Users with PENDING_APPROVAL status'),
    suspendedUsers: z
      .number()
      .int()
      .min(0)
      .describe('Users with SUSPENDED status'),
    customerCount: z.number().int().min(0).describe('Users with CUSTOMER role'),
    staffCount: z
      .number()
      .int()
      .min(0)
      .describe(
        'Users with staff roles (ADMIN, SALESMAN, DRIVER, CLEANER, IT_STAFF)',
      ),
    totalOrders: z.number().int().min(0).describe('Total orders in date range'),
    pendingOrders: z
      .number()
      .int()
      .min(0)
      .describe('Orders with PENDING status'),
    deliveredOrders: z
      .number()
      .int()
      .min(0)
      .describe('Orders with DELIVERED status'),
    canceledOrders: z
      .number()
      .int()
      .min(0)
      .describe('Orders with CANCELED status'),
    totalRevenue: z
      .number()
      .nonnegative()
      .describe('Total revenue from delivered orders (LKR)'),
    totalServiceRequests: z
      .number()
      .int()
      .min(0)
      .describe('Total service requests'),
    receivedServiceRequests: z
      .number()
      .int()
      .min(0)
      .describe('Service requests with RECEIVED status'),
    resolvedServiceRequests: z
      .number()
      .int()
      .min(0)
      .describe('Service requests with RESOLVED status'),
    canceledServiceRequests: z
      .number()
      .int()
      .min(0)
      .describe('Service requests with CANCELED status'),
    cleaningServices: z
      .number()
      .int()
      .min(0)
      .describe('Service requests with CLEANING type'),
    itServices: z
      .number()
      .int()
      .min(0)
      .describe('Service requests with IT_SUPPORT type'),
    totalMessages: z.number().int().min(0).describe('Total contact messages'),
    openMessages: z
      .number()
      .int()
      .min(0)
      .describe('Contact messages with OPEN status'),
    resolvedMessages: z
      .number()
      .int()
      .min(0)
      .describe('Contact messages with RESOLVED status'),
  })
  .describe('High-level overview metrics')

// Top products
const TopProduct = z
  .object({
    id: z.number().int().describe('Food item ID'),
    name: z.string().describe('Product name'),
    price: z.number().describe('Current product price (LKR)'),
    categoryId: z.number().int().describe('Category ID'),
    totalSold: z.number().int().min(0).describe('Total quantity sold'),
    orderCount: z
      .number()
      .int()
      .min(0)
      .describe('Number of orders containing this product'),
  })
  .describe('Top-selling product statistics')

// Orders by status
const OrderStatusStat = z
  .object({
    status: z
      .string()
      .describe(
        'Order status (PENDING, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELED)',
      ),
    count: z
      .number()
      .int()
      .min(0)
      .describe('Number of orders with this status'),
  })
  .describe('Order count grouped by status')

// Services by type
const ServiceTypeStat = z
  .object({
    type: z.string().describe('Service type (CLEANING, IT_SUPPORT)'),
    count: z
      .number()
      .int()
      .min(0)
      .describe('Number of service requests of this type'),
  })
  .describe('Service request count grouped by type')

// Daily revenue
const DailyRevenue = z
  .object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    revenue: z
      .number()
      .nonnegative()
      .describe('Total revenue for this date (LKR)'),
    orders: z
      .number()
      .int()
      .min(0)
      .describe('Number of delivered orders for this date'),
  })
  .describe('Daily revenue statistics')

// Daily user growth
const DailyUserGrowth = z
  .object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    count: z
      .number()
      .int()
      .min(0)
      .describe('Number of new users registered on this date'),
  })
  .describe('Daily user registration statistics')

// Recent activity (audit log)
const RecentActivity = z
  .object({
    id: z.number().int().describe('Audit log ID'),
    entityType: z
      .string()
      .describe(
        'Type of entity (USER, ORDER, SERVICE_REQUEST, CONTACT_MESSAGE, FOOD_ITEM, FOOD_CATEGORY)',
      ),
    entityId: z.number().int().describe('ID of the affected entity'),
    action: z
      .string()
      .describe(
        'Action performed (CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGOUT)',
      ),
    actorId: z
      .number()
      .int()
      .nullable()
      .describe('ID of user who performed the action'),
    ipAddress: z.string().nullable().describe('IP address of the actor'),
    userAgent: z.string().nullable().describe('User agent string'),
    details: z
      .any()
      .nullable()
      .describe('Additional JSON details about the action'),
    createdAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when action occurred'),
    actor: z
      .object({
        id: z.number().int().describe('Actor user ID'),
        name: z.string().describe('Actor user name'),
        email: z.string().describe('Actor user email'),
        role: z.string().describe('Actor user role'),
      })
      .nullable()
      .describe('User who performed the action'),
  })
  .describe('Audit log entry')

// Main response data
const AnalyticsData = z
  .object({
    overview: AnalyticsOverview.describe(
      'Summary metrics across users, orders, services, and messages',
    ),
    topProducts: z
      .array(TopProduct)
      .describe('Top 10 products by quantity sold'),
    ordersByStatus: z
      .array(OrderStatusStat)
      .describe('Order counts grouped by status'),
    servicesByType: z
      .array(ServiceTypeStat)
      .describe('Service request counts grouped by type'),
    dailyRevenue: z
      .array(DailyRevenue)
      .describe('Daily revenue for last 30 days'),
    dailyUsers: z
      .array(DailyUserGrowth)
      .describe('Daily new user registrations for last 30 days'),
    recentActivity: z
      .array(RecentActivity)
      .describe('10 most recent audit log entries'),
  })
  .describe('Complete analytics data')

// Success response
export const AnalyticsSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AnalyticsData,
  })
  .describe('Successful analytics response')

// Re-export common error responses
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
