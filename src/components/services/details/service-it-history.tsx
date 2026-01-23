import { MotionBox } from '@/src/components/motion/box'
import { Calendar, FileText, History, StickyNote } from 'lucide-react'

type ITHistoryEntry = {
  id: number
  requestNumber: string
  status: string
  createdAt: string
  description?: string | null
  notes?: string | null
}

type ServiceITHistoryProps = {
  currentDescription: string
  currentNotes?: string | null
  history: ITHistoryEntry[]
}

const STATUS_COLORS = {
  RECEIVED: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  ASSIGNED: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  RESOLVED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  CANCELLED: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

export function ServiceITHistory({
  currentDescription,
  currentNotes,
  history,
}: ServiceITHistoryProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
          <History className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">IT Service History</h3>
          <p className="text-xs text-muted-foreground">
            Previous requests for this device/system
          </p>
        </div>
      </div>

      {/* Current Request Summary */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Current Request</p>
        </div>
        <p className="text-sm leading-relaxed mb-3">{currentDescription}</p>
        {currentNotes && (
          <div className="rounded-lg border border-border/60 bg-card/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Special Notes</p>
            <p className="text-sm">{currentNotes}</p>
          </div>
        )}
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">
          Previous Requests
        </h4>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div
                key={entry.id}
                className="rounded-xl border border-border/60 bg-gradient-to-br from-card/50 to-card/30 p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {entry.requestNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_COLORS[
                        entry.status as keyof typeof STATUS_COLORS
                      ] || STATUS_COLORS.RECEIVED
                    }`}
                  >
                    {entry.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {entry.description && (
                  <div className="rounded-lg border border-border/60 bg-card/50 p-3 mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Issue</p>
                    <p className="text-sm">{entry.description}</p>
                  </div>
                )}

                {entry.notes && (
                  <div className="rounded-lg border border-border/60 bg-card/50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <StickyNote className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Resolution Notes
                      </p>
                    </div>
                    <p className="text-sm">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
            <History className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No previous IT service requests found
            </p>
          </div>
        )}
      </div>
    </MotionBox>
  )
}
