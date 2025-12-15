import { ApiResponse } from '@/src/lib/api/response'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return ApiResponse.success([])
}

export async function POST(request: NextRequest) {
  return ApiResponse.success(null, 'Service created', undefined, 201)
}
