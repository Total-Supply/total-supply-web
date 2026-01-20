import { PrismaClient } from '../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
if (!connectionString) {
  throw new Error(
    'DATABASE_URL or DIRECT_URL must be set before instantiating PrismaClient',
  )
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaNeon({
      connectionString,
    }),
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
