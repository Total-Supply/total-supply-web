import { UserApprovalTable } from '@/src/components/admin/user-approval-table'

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">User approvals</h1>
        <p className="text-sm text-slate-500">
          Review new registrations and approve access to the platform.
        </p>
      </div>
      <UserApprovalTable />
    </div>
  )
}
