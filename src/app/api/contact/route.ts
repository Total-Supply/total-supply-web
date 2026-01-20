import { ApiResponse } from '@/src/lib/api/response'
import { prisma } from '@/src/lib/prisma'
import { sendEmail } from '@/src/lib/email'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return ApiResponse.badRequest('Invalid payload')
  }

  const name =
    typeof body.name === 'string' ? body.name.trim() : ''
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const subject =
    typeof body.subject === 'string' ? body.subject.trim() : ''
  const message =
    typeof body.message === 'string' ? body.message.trim() : ''
  const phone =
    typeof body.phone === 'string' ? body.phone.trim() : undefined

  if (!name) {
    return ApiResponse.badRequest('Name is required')
  }

  if (!email) {
    return ApiResponse.badRequest('Email is required')
  }

  if (!subject) {
    return ApiResponse.badRequest('Subject is required')
  }

  if (!message) {
    return ApiResponse.badRequest('Message is required')
  }

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  try {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        phone: phone || null,
      },
    })

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.SMTP_FROM ||
      'support@totalsupply.com'

    if (!adminEmail) {
      throw new Error('Admin email not configured')
    }

    const emailSubject = `New contact request: ${subject}`
    const lines = [
      'You received a new contact form submission.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : undefined,
      `Subject: ${subject}`,
      '',
      'Message:',
      message,
    ].filter(Boolean)

    const textContent = lines.join('\n')
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeSubject = escapeHtml(subject)
    const safePhone = phone ? escapeHtml(phone) : null
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>You received a new contact form submission.</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `

    await sendEmail({
      to: adminEmail,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    })

    return ApiResponse.success(
      {
        id: contactMessage.id,
        name,
        email,
        subject,
      },
      'Contact form submitted successfully',
      undefined,
      201,
    )
  } catch (error) {
    console.error('Failed to process contact form', error)
    return ApiResponse.internalError(
      'Failed to submit contact form, please try again later.',
    )
  }
}


