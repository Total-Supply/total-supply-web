'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Activity, Download, RefreshCw } from 'lucide-react'

type AuditHeaderProps = {
  onRefresh: () => void
  onExport: () => void
  isRefreshing: boolean
}

export function AuditHeader({
  onRefresh,
  onExport,
  isRefreshing,
}: AuditHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Track all system activities and user actions
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={onExport}
        >
          Export
        </Button>
        <IconActionButton
          icon={RefreshCw}
          label="Refresh logs"
          variant="refresh"
          isLoading={isRefreshing}
          onClick={onRefresh}
        />
      </div>
    </MotionBox>
  )
}
