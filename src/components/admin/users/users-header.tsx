'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { RefreshCw, UserPlus, Users } from 'lucide-react'

type UsersHeaderProps = {
  onRefresh: () => void
  onAddUser: () => void
  isRefreshing: boolean
}

export function UsersHeader({
  onRefresh,
  onAddUser,
  isRefreshing,
}: UsersHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconActionButton
          icon={RefreshCw}
          label="Refresh users"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          colorPalette="blue"
          variant="solid"
          onClick={onAddUser}
        >
          Add User
        </Button>
      </div>
    </MotionBox>
  )
}
