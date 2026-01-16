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
