'use client'

import { MotionBox } from '@/src/components/motion/box'
import { CheckCircle2, UserCheck } from 'lucide-react'

export function ApprovalsEmptyState() {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-12 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">All caught up!</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        No pending user approvals at the moment. New registrations will appear
        here for review.
      </p>
    </MotionBox>
  )
}
