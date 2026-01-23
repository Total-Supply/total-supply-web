'use client'

import { Button } from '@/src/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type OrdersPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function OrdersPagination({
  page,
  totalPages,
  onPageChange,
}: OrdersPaginationProps) {
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={!canPrev}
        leftIcon={<ChevronLeft className="h-4 w-4" />}
      >
        Previous
      </Button>
      <span className="text-sm font-medium text-muted-foreground">
        Page <span className="text-foreground">{page}</span> of{' '}
        <span className="text-foreground">{totalPages}</span>
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={!canNext}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      >
        Next
      </Button>
    </div>
  )
}
