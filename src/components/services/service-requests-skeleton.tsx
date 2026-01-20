'use client'

export function ServiceRequestsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60">
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-12 w-32 rounded-lg bg-muted/50" />
            <div className="h-12 w-24 rounded-lg bg-muted/50" />
            <div className="h-8 w-24 rounded-full bg-muted/50" />
            <div className="h-8 w-20 rounded-full bg-muted/50" />
            <div className="h-8 w-24 rounded-full bg-muted/50" />
            <div className="ml-auto h-9 w-20 rounded-lg bg-muted/50" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServiceRequestsCardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-40 rounded-lg bg-muted/50" />
              <div className="h-6 w-20 rounded-full bg-muted/50" />
            </div>
            <div className="h-4 w-48 rounded bg-muted/50" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-muted/50" />
              <div className="h-6 w-16 rounded-full bg-muted/50" />
            </div>
            <div className="h-4 w-32 rounded bg-muted/50" />
            <div className="h-9 w-full rounded-lg bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
