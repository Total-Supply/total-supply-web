import { UsersManagement } from '@/src/components/admin/users/users-management'

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <UsersManagement />
    </div>
  )
}
