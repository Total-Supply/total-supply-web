import nodemailer from 'nodemailer'

type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
}

const useMockEmail = process.env.USE_MOCK_EMAIL === 'true'

const smtpPort = Number(process.env.SMTP_PORT || 587)
const smtpFrom = process.env.SMTP_FROM || 'noreply@totalsupply.com'

function appendUnsubscribeFooter({
  text,
  html,
  unsubscribeUrl,
}: {
  text: string
  html: string
  unsubscribeUrl?: string
}) {
  if (!unsubscribeUrl) {
    return { text, html }
  }

  return {
    text: `${text}\n\nUnsubscribe from marketing emails: ${unsubscribeUrl}`,
    html: `${html}
      <p style="font-size: 12px; color: #64748b;">
        <a href="${unsubscribeUrl}" style="color: #2563eb;">Unsubscribe</a> from marketing emails.
      </p>
    `,
  }
}

const transporter = useMockEmail
  ? null
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    })

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  if (useMockEmail) {
    console.log('[Mock Email]', { to, subject, text })
    return
  }

  if (!transporter) {
    throw new Error('Email transporter not configured')
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject,
    html,
    text,
  })
}

export function buildVerificationEmail({
  name,
  verificationUrl,
}: {
  name: string
  verificationUrl: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    'Please verify your email to complete your registration.',
    `Verify your email: ${verificationUrl}`,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Please verify your email to complete your registration.</p>
      <p>
        <a href="${verificationUrl}" style="color: #2563eb; font-weight: 600;">
          Verify your email
        </a>
      </p>
      <p style="color: #64748b; font-size: 12px;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `

  return { text, html }
}

export function buildApprovalEmail({ name }: { name: string }) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    'Your account has been approved. You can now log in.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your account has been approved. You can now log in.</p>
    </div>
  `

  return { text, html }
}

export function buildRejectionEmail({
  name,
  reason,
}: {
  name: string
  reason: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    'Your account registration was rejected.',
    `Reason: ${reason}`,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your account registration was rejected.</p>
      <p><strong>Reason:</strong> ${reason}</p>
    </div>
  `

  return { text, html }
}

export function buildPasswordResetEmail({
  name,
  resetUrl,
}: {
  name: string
  resetUrl: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    'We received a request to reset your password.',
    `Reset your password: ${resetUrl}`,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetUrl}" style="color: #2563eb; font-weight: 600;">
          Reset your password
        </a>
      </p>
      <p style="color: #64748b; font-size: 12px;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `

  return { text, html }
}

export function buildPasswordResetConfirmation({ name }: { name: string }) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    'Your password was reset successfully.',
    'If this was not you, please contact support immediately.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your password was reset successfully.</p>
      <p style="color: #64748b; font-size: 12px;">
        If this was not you, please contact support immediately.
      </p>
    </div>
  `

  return { text, html }
}

export function buildOrderConfirmationEmail({
  name,
  orderNumber,
  placedAt,
  items,
  address,
  totalPrice,
  trackingUrl,
  supportPhone,
  eta,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  placedAt: string
  items: { name: string; quantity: number; price: number }[]
  address: string
  totalPrice: number
  trackingUrl: string
  supportPhone: string
  eta: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const itemLines = items
    .map(
      (item) =>
        `${item.quantity} x ${item.name} - LKR ${item.price.toFixed(2)}`,
    )
    .join('\n')

  const text = [
    `Hi ${safeName},`,
    '',
    `Your order ${orderNumber} is confirmed.`,
    `Placed at: ${placedAt}`,
    '',
    'Items:',
    itemLines,
    '',
    `Delivery address: ${address}`,
    `Total: LKR ${totalPrice.toFixed(2)}`,
    `Estimated delivery: ${eta}`,
    '',
    `Track your order: ${trackingUrl}`,
    `Support: ${supportPhone}`,
  ].join('\n')

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">LKR ${item.price.toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">Order ${orderNumber} confirmed</h2>
      <p>Hi ${safeName},</p>
      <p>Your order is confirmed. We are preparing your delivery.</p>
      <p style="font-size: 14px; color: #64748b;">Placed at: ${placedAt}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr>
            <th style="text-align: left; padding-bottom: 8px;">Item</th>
            <th style="text-align: center; padding-bottom: 8px;">Qty</th>
            <th style="text-align: right; padding-bottom: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p><strong>Total:</strong> LKR ${totalPrice.toFixed(2)}</p>
      <p><strong>Delivery address:</strong> ${address}</p>
      <p><strong>Estimated delivery:</strong> ${eta}</p>
      <p>
        <a href="${trackingUrl}" style="color: #2563eb; font-weight: 600;">
          Track your order
        </a>
      </p>
      <p style="font-size: 12px; color: #64748b;">
        Need help? Contact support at ${supportPhone}.
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildOrderNotificationEmail({
  orderNumber,
  customerName,
  totalPrice,
  items,
}: {
  orderNumber: string
  customerName: string
  totalPrice: number
  items: { name: string; quantity: number; price: number }[]
}) {
  const itemLines = items
    .map(
      (item) =>
        `${item.quantity} x ${item.name} - LKR ${item.price.toFixed(2)}`,
    )
    .join('\n')

  const text = [
    `New order ${orderNumber}`,
    `Customer: ${customerName}`,
    '',
    'Items:',
    itemLines,
    '',
    `Total: LKR ${totalPrice.toFixed(2)}`,
  ].join('\n')

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 6px 0;">${item.name}</td>
          <td style="padding: 6px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 6px 0; text-align: right;">LKR ${item.price.toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h3 style="margin: 0 0 8px;">New order ${orderNumber}</h3>
      <p><strong>Customer:</strong> ${customerName}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <thead>
          <tr>
            <th style="text-align: left;">Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p><strong>Total:</strong> LKR ${totalPrice.toFixed(2)}</p>
    </div>
  `

  return { text, html }
}

export function buildOrderCancellationEmail({
  name,
  orderNumber,
  reason,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  reason: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your order ${orderNumber} has been canceled.`,
    `Reason: ${reason}`,
    '',
    'If you have questions, contact support.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your order <strong>${orderNumber}</strong> has been canceled.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p style="font-size: 12px; color: #64748b;">
        If you have questions, contact support.
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildOrderPreparingEmail({
  name,
  orderNumber,
  salesmanName,
  trackingUrl,
  etaMinutes,
  stage,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  salesmanName: string
  trackingUrl: string
  etaMinutes?: number
  stage?: 'ACCEPTED' | 'PREPARING'
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const message =
    stage === 'PREPARING'
      ? `Your order ${orderNumber} is now being prepared.`
      : `Your order ${orderNumber} has been accepted and is now being prepared.`
  const etaLine = etaMinutes ? `Estimated arrival: ${etaMinutes} minutes` : ''
  const text = [
    `Hi ${safeName},`,
    '',
    message,
    `Salesman: ${salesmanName}`,
    etaLine,
    `Track your order: ${trackingUrl}`,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>${message}</p>
      <p><strong>Salesman:</strong> ${salesmanName}</p>
      ${etaMinutes ? `<p><strong>Estimated arrival:</strong> ${etaMinutes} minutes</p>` : ''}
      <p>
        <a href="${trackingUrl}" style="color: #2563eb; font-weight: 600;">
          Track your order
        </a>
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildOrderDeclinedAdminEmail({
  orderNumber,
  customerName,
  salesmanName,
  reason,
  notes,
  reassignedTo,
}: {
  orderNumber: string
  customerName: string
  salesmanName: string
  reason: string
  notes?: string
  reassignedTo?: string | null
}) {
  const text = [
    `Order ${orderNumber} was declined.`,
    `Customer: ${customerName}`,
    `Salesman: ${salesmanName}`,
    `Reason: ${reason}`,
    notes ? `Notes: ${notes}` : '',
    reassignedTo
      ? `Reassigned to: ${reassignedTo}`
      : 'No reassignment available.',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h3 style="margin: 0 0 8px;">Order ${orderNumber} declined</h3>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Salesman:</strong> ${salesmanName}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <p><strong>Reassigned to:</strong> ${reassignedTo || 'Not assigned'}</p>
    </div>
  `

  return { text, html }
}

export function buildOrderDelayEmail({
  name,
  orderNumber,
  reason,
  notes,
  trackingUrl,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  reason: string
  notes?: string
  trackingUrl: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your order ${orderNumber} needs a bit more time to prepare.`,
    `Reason: ${reason}`,
    notes ? `Notes: ${notes}` : '',
    `Track your order: ${trackingUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your order <strong>${orderNumber}</strong> needs a bit more time to prepare.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <p>
        <a href="${trackingUrl}" style="color: #2563eb; font-weight: 600;">
          Track your order
        </a>
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildOrderOutForDeliveryEmail({
  name,
  orderNumber,
  driverName,
  trackingUrl,
  etaMinutes,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  driverName: string
  trackingUrl: string
  etaMinutes?: number
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const etaLine = etaMinutes ? `Estimated arrival: ${etaMinutes} minutes` : ''
  const text = [
    `Hi ${safeName},`,
    '',
    `Your order ${orderNumber} is on the way.`,
    `Driver: ${driverName}`,
    etaLine,
    `Track your order: ${trackingUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your order <strong>${orderNumber}</strong> is on the way.</p>
      <p><strong>Driver:</strong> ${driverName}</p>
      ${etaMinutes ? `<p><strong>Estimated arrival:</strong> ${etaMinutes} minutes</p>` : ''}
      <p>
        <a href="${trackingUrl}" style="color: #2563eb; font-weight: 600;">
          Track your order
        </a>
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildOrderDeliveredEmail({
  name,
  orderNumber,
  trackingUrl,
  proofUrl,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  trackingUrl: string
  proofUrl: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your order ${orderNumber} has been delivered.`,
    `View delivery proof: ${proofUrl}`,
    `Track your order: ${trackingUrl}`,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your order <strong>${orderNumber}</strong> has been delivered.</p>
      <p>
        <a href="${proofUrl}" style="color: #2563eb; font-weight: 600;">
          View delivery proof
        </a>
      </p>
      <p>
        <a href="${trackingUrl}" style="color: #2563eb; font-weight: 600;">
          Track your order
        </a>
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildOrderStatusEmail({
  name,
  orderNumber,
  status,
  items,
  total,
  trackingUrl,
  eta,
  driverName,
  driverPhone,
  unsubscribeUrl,
}: {
  name: string
  orderNumber: string
  status: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  trackingUrl: string
  eta?: string
  driverName?: string | null
  driverPhone?: string | null
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const itemLines = items
    .map(
      (item) =>
        `${item.quantity} x ${item.name} - LKR ${item.price.toFixed(2)}`,
    )
    .join('\n')

  const nextStep = (() => {
    switch (status) {
      case 'ACCEPTED':
        return 'We are preparing your items.'
      case 'PREPARING':
        return 'Your order is being prepared.'
      case 'OUT_FOR_DELIVERY':
        return 'Your driver is on the way.'
      case 'DELIVERED':
        return 'Delivery completed. Thank you!'
      default:
        return 'We will keep you updated.'
    }
  })()

  const text = [
    `Hi ${safeName},`,
    '',
    `Order ${orderNumber} status update: ${status}`,
    nextStep,
    '',
    'Items:',
    itemLines,
    '',
    `Total: LKR ${total.toFixed(2)}`,
    eta ? `Estimated delivery: ${eta}` : '',
    driverName
      ? `Driver: ${driverName}${driverPhone ? ` (${driverPhone})` : ''}`
      : '',
    `Track your order: ${trackingUrl}`,
    '',
    'Manage notification preferences in your account settings.',
  ]
    .filter(Boolean)
    .join('\n')

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 6px 0;">${item.name}</td>
          <td style="padding: 6px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 6px 0; text-align: right;">LKR ${item.price.toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h3 style="margin: 0 0 8px;">Order ${orderNumber} status update</h3>
      <p>Hi ${safeName},</p>
      <p><strong>Status:</strong> ${status}</p>
      <p>${nextStep}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <thead>
          <tr>
            <th style="text-align: left;">Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p><strong>Total:</strong> LKR ${total.toFixed(2)}</p>
      ${eta ? `<p><strong>Estimated delivery:</strong> ${eta}</p>` : ''}
      ${
        driverName
          ? `<p><strong>Driver:</strong> ${driverName} ${driverPhone ? `(${driverPhone})` : ''}</p>`
          : ''
      }
      <p>
        <a href="${trackingUrl}" style="color: #2563eb; font-weight: 600;">
          Track your order
        </a>
      </p>
      <p style="font-size: 12px; color: #64748b;">
        Manage notification preferences in your account settings.
      </p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildServiceRequestEmail({
  name,
  requestNumber,
  type,
  requestedDate,
  priority,
  unsubscribeUrl,
}: {
  name: string
  requestNumber: string
  type: string
  requestedDate?: string
  priority: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your service request ${requestNumber} has been received.`,
    `Type: ${type}`,
    requestedDate ? `Preferred date: ${requestedDate}` : '',
    `Priority: ${priority}`,
    '',
    'We will contact you shortly to confirm the booking.',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your service request <strong>${requestNumber}</strong> has been received.</p>
      <p><strong>Type:</strong> ${type}</p>
      ${
        requestedDate
          ? `<p><strong>Preferred date:</strong> ${requestedDate}</p>`
          : ''
      }
      <p><strong>Priority:</strong> ${priority}</p>
      <p>We will contact you shortly to confirm the booking.</p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildServiceAssignedEmail({
  name,
  requestNumber,
  staffName,
  eta,
  unsubscribeUrl,
}: {
  name: string
  requestNumber: string
  staffName: string
  eta?: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your service request ${requestNumber} is assigned.`,
    `Staff: ${staffName}`,
    eta ? `Estimated arrival: ${eta}` : '',
    '',
    'We will notify you when the team starts the service.',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your service request <strong>${requestNumber}</strong> is assigned.</p>
      <p><strong>Staff:</strong> ${staffName}</p>
      ${eta ? `<p><strong>Estimated arrival:</strong> ${eta}</p>` : ''}
      <p>We will notify you when the team starts the service.</p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildServiceAcceptedEmail({
  name,
  requestNumber,
  staffName,
  eta,
  unsubscribeUrl,
}: {
  name: string
  requestNumber: string
  staffName: string
  eta?: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your service request ${requestNumber} has been accepted.`,
    `Cleaner: ${staffName}`,
    eta ? `Estimated arrival: ${eta}` : '',
    '',
    'We will notify you when the cleaner arrives.',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your service request <strong>${requestNumber}</strong> has been accepted.</p>
      <p><strong>Cleaner:</strong> ${staffName}</p>
      ${eta ? `<p><strong>Estimated arrival:</strong> ${eta}</p>` : ''}
      <p>We will notify you when the cleaner arrives.</p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildITServiceAcceptedEmail({
  name,
  requestNumber,
  staffName,
  eta,
  unsubscribeUrl,
}: {
  name: string
  requestNumber: string
  staffName: string
  eta?: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Your IT support request ${requestNumber} has been accepted.`,
    `Technician: ${staffName}`,
    eta ? `Estimated arrival: ${eta}` : '',
    '',
    'We will notify you when the technician is on the way.',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your IT support request <strong>${requestNumber}</strong> has been accepted.</p>
      <p><strong>Technician:</strong> ${staffName}</p>
      ${eta ? `<p><strong>Estimated arrival:</strong> ${eta}</p>` : ''}
      <p>We will notify you when the technician is on the way.</p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildServiceProgressEmail({
  name,
  requestNumber,
  staffName,
  notes,
  unsubscribeUrl,
}: {
  name: string
  requestNumber: string
  staffName: string
  notes?: string
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const text = [
    `Hi ${safeName},`,
    '',
    `Cleaning is in progress for request ${requestNumber}.`,
    `Cleaner: ${staffName}`,
    notes ? `Progress: ${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Cleaning is in progress for request <strong>${requestNumber}</strong>.</p>
      <p><strong>Cleaner:</strong> ${staffName}</p>
      ${notes ? `<p><strong>Progress:</strong> ${notes}</p>` : ''}
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}

export function buildServiceCompletedEmail({
  name,
  requestNumber,
  staffName,
  notes,
  photoUrls,
  unsubscribeUrl,
}: {
  name: string
  requestNumber: string
  staffName: string
  notes: string
  photoUrls: string[]
  unsubscribeUrl?: string
}) {
  const safeName = name || 'there'
  const photoList = photoUrls.map((url) => `- ${url}`).join('\n')
  const text = [
    `Hi ${safeName},`,
    '',
    `Your cleaning request ${requestNumber} is complete.`,
    `Cleaner: ${staffName}`,
    `Notes: ${notes}`,
    '',
    'After photos:',
    photoList,
  ].join('\n')

  const photosHtml = photoUrls
    .map(
      (url) =>
        `<a href="${url}" style="color: #2563eb; font-weight: 600;">View photo</a>`,
    )
    .join('<br />')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hi ${safeName},</p>
      <p>Your cleaning request <strong>${requestNumber}</strong> is complete.</p>
      <p><strong>Cleaner:</strong> ${staffName}</p>
      <p><strong>Notes:</strong> ${notes}</p>
      <p><strong>After photos:</strong><br />${photosHtml}</p>
    </div>
  `

  return appendUnsubscribeFooter({ text, html, unsubscribeUrl })
}
