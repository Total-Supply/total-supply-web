import { UserApprovalTable } from '@/src/components/admin/users/approvals/user-approval-table'

export default function AdminUsersApprovalsPage() {
  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <UserApprovalTable />
    </div>
  )
}
