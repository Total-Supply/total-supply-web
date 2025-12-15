import { ApiResponse } from '@/src/lib/api/response'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return ApiResponse.success(null, 'Service updated')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return ApiResponse.success(null, 'Service deleted')
}
