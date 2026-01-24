'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { ClipboardList, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ServiceRequestsEmptyStateProps = {
  hasFilters: boolean
}

export function ServiceRequestsEmptyState({
  hasFilters,
}: ServiceRequestsEmptyStateProps) {
  const router = useRouter()

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-12 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasFilters ? 'No requests found' : 'No service requests yet'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : 'Submit your first service request to get started with our cleaning or IT support services.'}
      </p>
      {!hasFilters && (
        <Button
          className="mt-6"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => router.push('/services/new')}
        >
          New Service Request
        </Button>
      )}
    </MotionBox>
  )
}
