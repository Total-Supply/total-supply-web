import prisma from '@/src/lib/prisma'
import { anonymizeUser, purgeUserData } from '@/src/lib/privacy'

export async function runDataRetention() {
  const now = new Date()
  const purgeCutoff = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000)

  const dueForAnonymize = await prisma.user.findMany({
    where: {
      deletionScheduledAt: { lte: now },
      deletedAt: null,
    },
    select: { id: true },
  })

  for (const user of dueForAnonymize) {
    await anonymizeUser(user.id)
  }

  const dueForPurge = await prisma.user.findMany({
    where: {
      deletedAt: { lte: purgeCutoff },
      dataPurgedAt: null,
    },
    select: { id: true },
  })

  for (const user of dueForPurge) {
    await purgeUserData(user.id)
  }

  return {
    anonymizedCount: dueForAnonymize.length,
    purgedCount: dueForPurge.length,
  }
}


