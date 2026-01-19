import prisma from '@/src/lib/prisma'

export async function anonymizeUser(userId: number) {
  const anonymizedEmail = `deleted-${userId}-${Date.now()}@totalsupply.local`
  const now = new Date()

  return prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.address.updateMany({
      where: { userId },
      data: {
        label: null,
        line1: 'REDACTED',
        line2: null,
        city: 'REDACTED',
        postalCode: 'REDACTED',
        isDefault: false,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        name: 'Deleted User',
        phone: null,
        profileImage: null,
        marketingOptIn: false,
        deletedAt: now,
        deletionRequestedAt: null,
        deletionScheduledAt: null,
      },
    }),
  ])
}

export async function purgeUserData(userId: number) {
  const now = new Date()

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.auditLog.deleteMany({ where: { actorId: userId } }),
    prisma.user.update({
      where: { id: userId },
      data: {
        dataPurgedAt: now,
      },
    }),
  ])

  return { purgedAt: now }
}


