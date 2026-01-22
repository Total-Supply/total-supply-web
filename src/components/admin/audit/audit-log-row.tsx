'use client'

import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Eye, MapPin, Monitor, User } from 'lucide-react'

import { ActionBadge } from './action-badge'
import { EntityBadge } from './entity-badge'

type AuditLog = {
  id: number
  entityType: string
  entityId: number
  action: string
  actorId: number | null
  actor: {
    id: number
    name: string
    email: string
    role: string
  } | null
  ipAddress: string | null
  userAgent: string | null
  details: Record<string, unknown>
  createdAt: string
}

type AuditLogRowProps = {
  log: AuditLog
  onViewDetails: (log: AuditLog) => void
}

export function AuditLogRow({ log, onViewDetails }: AuditLogRowProps) {
  return (
    <tr className="border-t border-border/60 align-middle transition-colors duration-150 hover:bg-muted/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono text-xs text-muted-foreground">
            #{log.id}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-muted-foreground">
          {new Date(log.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </td>
      <td className="px-4 py-4">
        {log.actor ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {log.actor.name}
              </p>
              <p className="text-xs text-muted-foreground">{log.actor.email}</p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">System</span>
        )}
      </td>
      <td className="px-4 py-4">
        <ActionBadge action={log.action} showIcon={true} />
      </td>
      <td className="px-4 py-4">
        <EntityBadge entityType={log.entityType} showIcon={true} />
      </td>
      <td className="px-4 py-4">
        <span className="font-mono text-xs text-muted-foreground">
          {log.entityId}
        </span>
      </td>
      <td className="px-4 py-4">
        {log.ipAddress ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="font-mono">{log.ipAddress}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>
      <td className="px-4 py-4">
        <IconActionButton
          icon={Eye}
          label="View details"
          variant="view"
          onClick={() => onViewDetails(log)}
        />
      </td>
    </tr>
  )
}
