import { randomUUID } from 'crypto'
import prisma from '@/src/lib/prisma'

async function main() {
  const users = await prisma.$queryRaw<{ id: number }[]>`
    SELECT "id"
    FROM "User"
    WHERE "unsubscribeToken" IS NULL OR "unsubscribeToken" = ''
  `

  if (!users.length) {
    console.log('No users missing unsubscribeToken.')
    return
  }

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { unsubscribeToken: randomUUID() },
    })
  }

  console.log(`Backfilled unsubscribeToken for ${users.length} users.`)
}

main()
  .catch((error) => {
    console.error('Backfill failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
