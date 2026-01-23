'use client'

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Skeleton */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-2">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-20 rounded-lg bg-muted/50 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 animate-pulse">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 rounded bg-muted/50" />
                <div className="h-10 w-full rounded-lg bg-muted/50" />
              </div>
            ))}
          </div>
          <div className="h-32 w-full rounded-xl bg-muted/50" />
        </div>
      </div>
    </div>
  )
}
