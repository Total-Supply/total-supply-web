import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const roleRedirects: Record<string, string> = {
  ADMIN: '/dashboard/admin',
  SALESMAN: '/dashboard/salesman',
  DRIVER: '/dashboard/driver',
  CLEANER: '/dashboard/cleaner',
  IT_STAFF: '/dashboard/it',
  CUSTOMER: '/dashboard/profile',
}

type UserWithRole = {
  role?: keyof typeof roleRedirects | string
  [key: string]: unknown
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user as UserWithRole
  const role = user.role || 'CUSTOMER'

  if (role !== 'ADMIN') {
    redirect(roleRedirects[role] || '/dashboard/profile')
  }

  redirect('/dashboard/admin')
}
