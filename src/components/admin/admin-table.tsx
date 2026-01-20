import { MotionBox } from '@/src/components/motion/box'
import { Skeleton } from '@/src/components/ui/skeleton'
import { cn } from '@/src/lib/utils'

import * as React from 'react'

type AdminTableShellProps = {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AdminTableShell({
  title,
  description,
  actions,
  children,
  className,
}: AdminTableShellProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'space-y-6 rounded-sm border border-border/70 bg-card/80 p-6 shadow-[0_25px_80px_-40px_rgba(11,14,37,0.9)] backdrop-blur',
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? (
              <p className="text-lg font-semibold text-foreground">{title}</p>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : null}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </MotionBox>
  )
}

type AdminTableProps = {
  children: React.ReactNode
  className?: string
}

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-sm border border-border/60 bg-card/50 shadow-inner',
        className,
      )}
    >
      <table className="min-w-[720px] w-full text-left text-sm">
        {children}
      </table>
    </div>
  )
}

type AdminTableSkeletonProps = {
  columns?: number
  rows?: number
}

export function AdminTableSkeleton({
  columns = 5,
  rows = 3,
}: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} className="border-t border-border/60">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={`skeleton-${rowIndex}-${colIndex}`} className="px-4 py-3">
              <Skeleton className="h-4 w-full rounded-md" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
