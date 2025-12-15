import { ApiResponse } from '@/src/lib/api/response'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, subject, message } = body

  // TODO: Implement contact form logic (e.g., send email, save to database)

  return ApiResponse.success(
    { name, email, subject },
    'Contact form submitted successfully',
    undefined,
    201,
  )
}
