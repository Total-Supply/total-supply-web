'use strict'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const prismaMock = {
  order: {
    count: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  orderStatusHistory: {
    create: vi.fn(),
  },
  deliveryProof: {
    upsert: vi.fn(),
  },
  foodItem: {
    update: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}

vi.mock('@/src/lib/prisma', () => ({ default: prismaMock }))
vi.mock('@/src/middleware/auth', () => ({
  requireAuth: vi.fn(async (req: any) => ({
    ...req,
    user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })),
  requireStaff: vi.fn(async (req: any) => ({
    ...req,
    user: {
      id: '2',
      email: 'staff@example.com',
      name: 'Staff',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })),
}))
vi.mock('@/src/lib/email', () => ({
  buildOrderConfirmationEmail: vi.fn(() => ({ text: '', html: '' })),
  buildOrderNotificationEmail: vi.fn(() => ({ text: '', html: '' })),
  buildOrderCancellationEmail: vi.fn(() => ({ text: '', html: '' })),
  sendEmail: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/orders', () => {
  it('returns paginated orders', async () => {
    prismaMock.order.count.mockResolvedValue(2)
    prismaMock.order.findMany.mockResolvedValue([
      {
        id: 1,
        orderNumber: 'TS-20250101-AAAA',
        status: 'PENDING',
        totalPrice: 5000,
        createdAt: new Date('2025-01-01T10:00:00Z'),
      },
      {
        id: 2,
        orderNumber: 'TS-20250101-BBBB',
        status: 'DELIVERED',
        totalPrice: 8000,
        createdAt: new Date('2025-01-02T10:00:00Z'),
      },
    ])

    const { GET } = await import('@/src/app/api/orders/route')
    const request = new NextRequest('http://localhost/api/orders?page=1&limit=10')
    const response = await GET(request)
    const json = await response.json()

    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(2)
    expect(json.meta.total).toBe(2)
  })
})

describe('POST /api/orders/[orderNumber]/cancel', () => {
  it('cancels an order when status allows', async () => {
    prismaMock.order.findUnique.mockResolvedValue({
      id: 10,
      customerId: 1,
      status: 'PENDING',
      orderNumber: 'TS-20250101-CCCC',
      items: [{ foodItemId: 5, quantity: 2 }],
      customer: { email: 'user@example.com', name: 'User' },
    })

    prismaMock.$transaction.mockImplementation(async (callback: any) =>
      callback({
        order: { update: vi.fn() },
        orderStatusHistory: { create: vi.fn() },
        foodItem: { update: vi.fn() },
        auditLog: { create: vi.fn() },
      }),
    )

    const { POST } = await import('@/src/app/api/orders/[orderNumber]/cancel/route')
    const request = new NextRequest('http://localhost/api/orders/TS-20250101-CCCC/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason: 'Changed mind' }),
    })
    const response = await POST(request, { params: Promise.resolve({ orderNumber: 'TS-20250101-CCCC' }) })
    const json = await response.json()

    expect(json.success).toBe(true)
    expect(json.data.orderNumber).toBe('TS-20250101-CCCC')
  })
})

describe('PATCH /api/orders/[orderNumber]', () => {
  it('updates order status and logs history', async () => {
    prismaMock.order.findUnique.mockResolvedValue({
      id: 20,
      status: 'PENDING',
    })

    const orderUpdate = vi.fn().mockResolvedValue({ id: 20, status: 'PREPARING' })
    const statusCreate = vi.fn()
    const auditCreate = vi.fn()
    const proofUpsert = vi.fn()

    prismaMock.$transaction.mockImplementation(async (callback: any) =>
      callback({
        order: { update: orderUpdate },
        orderStatusHistory: { create: statusCreate },
        auditLog: { create: auditCreate },
        deliveryProof: { upsert: proofUpsert },
      }),
    )

    const { PATCH } = await import('@/src/app/api/orders/[orderNumber]/route')
    const request = new NextRequest('http://localhost/api/orders/TS-20250101-DDDD', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'PREPARING', notes: 'Assigned' }),
    })
    const response = await PATCH(request, { params: Promise.resolve({ orderNumber: 'TS-20250101-DDDD' }) })
    const json = await response.json()

    expect(json.success).toBe(true)
    expect(orderUpdate).toHaveBeenCalled()
    expect(statusCreate).toHaveBeenCalled()
    expect(auditCreate).toHaveBeenCalled()
  })
})
