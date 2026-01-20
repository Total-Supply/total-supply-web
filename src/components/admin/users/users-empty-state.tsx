'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { UserPlus, Users } from 'lucide-react'

type UsersEmptyStateProps = {
  hasFilters: boolean
  onAddUser: () => void
}

export function UsersEmptyState({
  hasFilters,
  onAddUser,
}: UsersEmptyStateProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-12 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasFilters ? 'No users found' : 'No users yet'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : 'Get started by adding your first user to the platform.'}
      </p>
      {!hasFilters && (
        <Button
          className="mt-6"
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={onAddUser}
        >
          Add First User
        </Button>
      )}
    </MotionBox>
  )
}
