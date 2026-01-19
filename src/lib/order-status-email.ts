import { buildOrderStatusEmail, sendEmail } from '@/src/lib/email'
import prisma from '@/src/lib/prisma'

const sendWithRetry = async (attempts: number, task: () => Promise<void>) => {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      await task()
      return
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) throw lastError
}

const getEtaForStatus = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return '60-90 minutes'
    case 'PREPARING':
      return '45-60 minutes'
    case 'OUT_FOR_DELIVERY':
      return '15-30 minutes'
    default:
      return undefined
  }
}

export async function sendOrderStatusEmail(
  orderId: number,
  status: string,
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      totalPrice: true,
      customer: {
        select: {
          name: true,
          email: true,
          unsubscribeToken: true,
        },
      },
      driver: {
        select: {
          name: true,
          phone: true,
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

  if (!order?.customer.email) return

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const unsubscribeUrl = order.customer.unsubscribeToken
    ? `${appUrl}/unsubscribe?token=${order.customer.unsubscribeToken}`
    : undefined
  const eta = getEtaForStatus(status)
  const items = order.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    price: Number(item.unitPrice),
  }))

  const { html, text } = buildOrderStatusEmail({
    name: order.customer.name,
    orderNumber: order.orderNumber,
    status,
    items,
    total: Number(order.totalPrice),
    trackingUrl: `${appUrl}/orders/${order.orderNumber}`,
    eta,
    driverName: order.driver?.name,
    driverPhone: order.driver?.phone,
    unsubscribeUrl,
  })

  await sendWithRetry(3, () =>
    sendEmail({
      to: order.customer.email,
      subject: `Order ${order.orderNumber} status: ${status}`,
      html,
      text,
    }),
  )
}


