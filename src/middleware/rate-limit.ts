import { RateLimitError } from '@/src/lib/api/errors'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

export function createRateLimiter(config: RateLimitConfig) {
  return (identifier: string): void => {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetAt: now + config.windowMs,
      })
      return
    }

    if (entry.count >= config.maxRequests) {
      const resetIn = Math.ceil((entry.resetAt - now) / 1000)
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${resetIn} seconds`,
      )
    }

    entry.count++
  }
}

// Preset rate limiters
export const rateLimiters = {
  upload: createRateLimiter({ maxRequests: 10, windowMs: 60 * 60 * 1000 }), // 10/hour
  auth: createRateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 }), // 5/15min
  api: createRateLimiter({ maxRequests: 100, windowMs: 60 * 1000 }), // 100/min
}

export function getRateLimitKey(
  userId: string | undefined,
  ip: string,
  endpoint: string,
): string {
  return userId ? `user:${userId}:${endpoint}` : `ip:${ip}:${endpoint}`
}
