'use client'

import { Button } from '@/src/components/ui/button'
import { Dialog } from '@chakra-ui/react'
import {
  Calendar,
  FileText,
  Hash,
  MapPin,
  Monitor,
  User,
  X,
} from 'lucide-react'

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

type AuditDetailsModalProps = {
  log: AuditLog | null
  onClose: () => void
}

export function AuditDetailsModal({ log, onClose }: AuditDetailsModalProps) {
  if (!log) return null

  return (
    <Dialog.Root
      open={!!log}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop className="bg-black/50 backdrop-blur-sm" />
      <Dialog.Positioner>
        <Dialog.Content className="bg-card border border-border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 max-w-3xl">
          <Dialog.CloseTrigger className="transition-all duration-200 hover:rotate-90 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </Dialog.CloseTrigger>

          <Dialog.Header className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-card-foreground">
                  Audit Log Details
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Log ID: #{log.id}
                </p>
              </div>
            </div>
          </Dialog.Header>

          <Dialog.Body className="py-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    Timestamp
                  </label>
                  <p className="text-sm font-medium">
                    {new Date(log.createdAt).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'long',
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Action
                  </label>
                  <div>
                    <ActionBadge action={log.action} showIcon={true} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Entity Type
                  </label>
                  <div>
                    <EntityBadge entityType={log.entityType} showIcon={true} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3 w-3" />
                    Entity ID
                  </label>
                  <p className="text-sm font-mono">{log.entityId}</p>
                </div>
              </div>

              {/* Actor Information */}
              <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Actor Information
                </h4>
                {log.actor ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{log.actor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.actor.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">User ID:</span>{' '}
                        <span className="font-mono">{log.actor.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Role:</span>{' '}
                        <span className="font-medium">{log.actor.role}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    System action (no actor)
                  </p>
                )}
              </div>

              {/* Technical Information */}
              <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Technical Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">IP Address:</span>{' '}
                      <span className="font-mono">
                        {log.ipAddress || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">User Agent:</span>{' '}
                      <span className="text-xs break-all">
                        {log.userAgent || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details (JSON) */}
              {log.details && (
                <div className="rounded-lg border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4">
                  <h4 className="text-sm font-semibold mb-3">
                    Additional Details
                  </h4>
                  <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" colorPalette="gray" onClick={onClose}>
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
