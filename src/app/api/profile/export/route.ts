import prisma from '@/src/lib/prisma'
import { requireAuth } from '@/src/middleware/auth'
import { withErrorHandler } from '@/src/middleware/error-handler'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import JSZip from 'jszip'

async function handler(request: NextRequest) {
  const authRequest = await requireAuth(request)
  const userId = parseInt(authRequest.user.id)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      marketingOptIn: true,
      deletionRequestedAt: true,
      deletionScheduledAt: true,
      deletedAt: true,
      dataPurgedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const addresses = await prisma.address.findMany({
    where: { userId },
    select: {
      id: true,
      label: true,
      line1: true,
      line2: true,
      city: true,
      postalCode: true,
      country: true,
      isDefault: true,
      createdAt: true,
    },
  })

  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    select: {
      orderNumber: true,
      status: true,
      totalPrice: true,
      notes: true,
      createdAt: true,
      deliveryAddress: {
        select: {
          line1: true,
          line2: true,
          city: true,
          postalCode: true,
          country: true,
        },
      },
      items: {
        select: {
          quantity: true,
          unitPrice: true,
          foodItem: {
            select: { name: true },
          },
        },
      },
    },
  })

  const serviceRequests = await prisma.serviceRequest.findMany({
    where: { customerId: userId },
    select: {
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
      photos: {
        select: {
          url: true,
          type: true,
        },
      },
    },
  })

  const zip = new JSZip()
  zip.file('user.json', JSON.stringify(user, null, 2))
  zip.file('addresses.json', JSON.stringify(addresses, null, 2))
  zip.file('orders.json', JSON.stringify(orders, null, 2))
  zip.file('service-requests.json', JSON.stringify(serviceRequests, null, 2))

  const buffer = await zip.generateAsync({ type: 'nodebuffer' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="total-supply-data.zip"',
    },
  })
}

export const GET = withErrorHandler(handler)


