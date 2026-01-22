import { randomUUID } from 'crypto'

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { unsubscribeToken: null },
    select: { id: true },
  })

  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { unsubscribeToken: randomUUID() },
    })
  }

  console.log(`Backfilled ${users.length} users`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
